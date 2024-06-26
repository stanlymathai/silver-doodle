const Config = require('../model.resource/config.model');
const Profanity = require('../model.resource/profanity.model');
const ProfanityHistory = require('../model.resource/history.profanity.modal');

const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

module.exports = {
  async getList(_, res) {
    await Profanity.aggregate([
      { $match: { status: 'Active' } },
      { $sort: { _id: -1 } },
      { $addFields: { id: '$_id' } },
      { $project: { _id: 0, status: 0 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },

  async addToList(req, res) {
    let payload = req.body;
    if (!payload.length > 0)
      return res.status(500).json('Must contain payload');

    // remove duplicates
    payload = payload.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) => t.swear === value.swear && t.countryCode === value.countryCode
        )
    );

    await Profanity.insertMany(payload)
      .then(async (result) => {
        const history = [];
        result.forEach(function (el) {
          history.push({
            oldWord: '',
            oldCountry: '',
            type: 'Added',
            swear: el.swear,
            newWord: el.swear,
            profanityId: el._id,
            newCountry: el.countryCode,
            countryCode: el.countryCode,
            adminId: payload[0].adminId,
            timestamp: payload[0].timestamp,
            internalId: payload[0].internalId,
          });
        });
        await ProfanityHistory.insertMany(history)
          .then(() => res.json(result))
          .catch((e) => res.status(500).json(e));
      })
      .catch((e) => {
        if (e.code === 11000) {
          const extDoc = e.writeErrors[0].err.op;
          res.status(500).json({
            error: `The word '${extDoc.swear}' and country '${extDoc.countryCode}' already exist.`,
          });
        } else {
          res.status(500).json(e);
        }
      });
  },

  addMultipleSwears: async function (req, res) {
    const filePath = 'uploads/' + req.file.filename;

    const payload = req.body;
    const adminId = payload.adminId;
    const timestamp = payload.timestamp;
    const internalId = payload.internalId;

    if (!adminId || !internalId)
      return res.status(500).json({
        error: "Payload should contain both 'adminId' and 'internalId'.",
      });

    let bulkUploadData = [];

    await readXlsxFile(filePath)
      .then(async (reader) => {
        fs.unlinkSync(filePath);
        if (!reader.length)
          return res
            .status(500)
            .json({ error: 'Uploaded file contains no data' });

        const headerRow = reader[0];
        if (!headerRow.length || headerRow.length < 2)
          return res.status(500).json({
            error: 'Uploaded file should contain two columns (word, country).',
          });
        if (!/word/i.test(headerRow[0]))
          return res.status(500).json({
            error: "First column header should contain a 'word' column.",
          });
        if (!/country/i.test(headerRow[1]))
          return res.status(500).json({
            error: "Second column header should contain a 'country' column.",
          });

        const rows = reader.slice(1);

        for (const row of rows) {
          if (row.length < 2) continue;
          if (row[0] == null || row[1] == null) continue;

          bulkUploadData.push({
            swear: row[0],
            countryCode: row[1],
          });
        }
        bulkUploadData = bulkUploadData.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.swear === value.swear && t.countryCode === value.countryCode
            )
        );

        const addToHistory = async (data) => {
          const history = [];
          data.forEach(function (el) {
            history.push({
              oldWord: '',
              oldCountry: '',
              type: 'Added',
              swear: el.swear,
              newWord: el.swear,
              profanityId: el._id,
              newCountry: el.countryCode,
              countryCode: el.countryCode,
              adminId,
              timestamp,
              internalId,
            });
          });
          await ProfanityHistory.insertMany(history)
            .then(() =>
              res.json({
                message: `${data.length} out of ${rows.length} uploaded successfully.`,
              })
            )
            .catch((error) => res.status(500).json({ error }));
        };

        await Profanity.insertMany(bulkUploadData, { ordered: false })
          .then((result) => addToHistory(result))
          .catch((e) => {
            if (e.code === 11000) {
              const insertCount = e.result.nInserted;
              const insertedDocs = e.insertedDocs;
              if (insertCount && insertedDocs.length) {
                addToHistory(insertedDocs);
              } else res.status(500).json({ error: 'Duplicate Entries' });
            } else res.status(500).json({ error: e });
          });
      })
      .catch((error) => res.status(500).json({ error }));
  },

  async softDelete(req, res) {
    const payload = req.body;
    await Profanity.updateMany(
      { _id: payload.id },
      { $set: { status: 'Disabled' } }
    )
      .then((result) => {
        Profanity.findOne({ _id: payload.id }).then((el) => {
          const historyDoc = new ProfanityHistory({
            newWord: '',
            newCountry: '',
            type: 'Removed',
            swear: el.swear,
            oldWord: el.swear,
            profanityId: el._id,
            oldCountry: el.countryCode,
            countryCode: el.countryCode,
            adminId: payload.adminId,
            internalId: payload.internalId,
            timestamp: payload.timestamp,
          });
          historyDoc
            .save()
            .then(() => res.json(result))
            .catch((e) => res.status(500).json(e));
        });
      })
      .catch((e) => res.status(500).json(e));
  },

  async history(_, res) {
    await ProfanityHistory.aggregate([
      { $sort: { _id: -1 } },
      { $addFields: { id: '$profanityId' } },
      { $project: { _id: 0, profanityId: 0 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },

  async updateList(req, res) {
    const payload = req.body;
    const modifyType = payload.modified;

    if (!modifyType) return res.status(500).json({ error: 'Invalid data.' });

    try {
      const doc = await Profanity.findOne({ _id: payload.id });
      switch (modifyType) {
        case 'word':
          await Profanity.updateOne(
            { _id: payload.id },
            { swear: payload.newWord }
          ).then((result) => {
            const history = new ProfanityHistory({
              type: 'Edited',
              profanityId: payload.id,
              swear: payload.newWord,
              oldWord: doc.swear,
              newWord: payload.newWord,
              countryCode: doc.countryCode,
              adminId: payload.adminId,
              internalId: payload.internalId,
              timestamp: payload.timestamp,
            });
            history
              .save()
              .then(() => res.json(result))
              .catch((e) => res.status(500).json({ error: e }));
          });
          break;
        case 'country':
          await Profanity.updateOne(
            { _id: payload.id },
            { countryCode: payload.newCountry }
          ).then((result) => {
            const history = new ProfanityHistory({
              type: 'Edited',
              profanityId: payload.id,
              swear: doc.swear,
              countryCode: payload.newCountry,
              oldCountry: doc.countryCode,
              newCountry: payload.newCountry,
              adminId: payload.adminId,
              internalId: payload.internalId,
              timestamp: payload.timestamp,
            });
            history
              .save()
              .then(() => res.json(result))
              .catch((e) => res.status(500).json({ error: e }));
          });
          break;
        case 'both':
          await Profanity.updateOne(
            { _id: payload.id },
            {
              swear: payload.newWord,
              countryCode: payload.newCountry,
            }
          ).then(async (result) => {
            await ProfanityHistory.insertMany([
              {
                type: 'Edited',
                profanityId: payload.id,
                swear: payload.newWord,
                oldWord: doc.swear,
                newWord: payload.newWord,
                countryCode: doc.countryCode,
                adminId: payload.adminId,
                internalId: payload.internalId,
                timestamp: payload.timestamp,
              },
              {
                type: 'Edited',
                profanityId: payload.id,
                swear: payload.newWord,
                countryCode: payload.newCountry,
                oldCountry: doc.countryCode,
                newCountry: payload.newCountry,
                adminId: payload.adminId,
                internalId: payload.internalId,
                timestamp: payload.timestamp,
              },
            ])
              .then(() => res.json(result))
              .catch((e) => res.status(500).json({ error: e }));
          });
          break;
        default:
          res.status(500).json({ error: 'modify type required.' });
          break;
      }
    } catch (e) {
      if (e.code === 11000) {
        const extDoc = e.keyValue;
        res.status(500).json({
          error: `The word '${extDoc.swear}' and country '${extDoc.countryCode}' already exist.`,
        });
      } else {
        res.status(500).json(e);
      }
    }
  },
  configure(req, res) {
    const payload = req.body;
    if (!payload.activity.length) return res.json();

    const CONFIG_TYPE = 'TIMEOUT_CONFIG';
    const history = [];

    payload.activity.forEach((type) => {
      let prelude = {
        adminId: payload.adminId,
        timestamp: payload.timestamp,
        internalId: payload.internalId,
      };
      switch (type) {
        case 'interval':
          prelude.interval = payload.interval;
          prelude.type = 'Interval in Minutes';
          break;
        case 'timeout':
          prelude.interval = payload.timeout;
          prelude.type = 'Timeout in Minutes';
          break;
        case 'moderation':
          prelude.type = 'Moderations';
          prelude.interval = payload.moderation;
          break;

        default:
          break;
      }

      return history.push(prelude);
    });

    Config.updateOne(
      { type: CONFIG_TYPE },
      {
        $set: {
          prelude: payload,
          updatedAt: payload.timestamp,
        },
        $push: { history: { $each: history } },
      },
      { upsert: true }
    )
      .then((result) => res.json(result))
      .catch((error) => res.status(500).json({ error }));
  },
  configuration(_, res) {
    const CONFIG_TYPE = 'TIMEOUT_CONFIG';

    Config.aggregate([
      { $match: { type: CONFIG_TYPE } },
      { $addFields: { config: '$prelude' } },
      {
        $project: {
          _id: 0,
          history: 1,
          updatedAt: 1,
          'config.timeout': 1,
          'config.interval': 1,
          'config.moderation': 1,
        },
      },
    ])
      .then((result) => res.json(result))
      .catch((error) => res.status(500).json({ error }));
  },
};
