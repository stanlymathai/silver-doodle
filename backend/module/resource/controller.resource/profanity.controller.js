const Profanity = require('../model.resource/profanity.model');
const ProfanityHistory = require('../model.resource/history.profanity.modal');

const fs = require('fs');
const readXlsxFile = require('read-excel-file/node');

module.exports = {
  async getList(_, res) {
    await Profanity.aggregate([
      { $sort: { _id: -1 } },
      { $addFields: { id: '$_id' } },
      { $project: { _id: 0, id: 1, swear: 1, countryCode: 1, type: 1 } },
    ])
      .then((result) => res.json(result))
      .catch((e) => res.status(500).json(e));
  },
  async addToList(req, res) {
    const payload = req.body;
    if (!payload.length > 0) {
      return res.status(500).json('Must contain payload');
    }

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
            error: `The word: ${extDoc.swear} and country: ${extDoc.countryCode} already exist.`,
          });
        } else {
          res.status(500).json(e);
        }
      });
  },
  async softDelete(req, res) {
    const payload = req.body;
    await Profanity.updateMany(
      { _id: payload.id },
      { $set: { type: 'Removed' } }
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

    if (!modifyType)
      return res.status(500).json({ error: 'modify type required.' });

    try {
      const doc = await Profanity.findOne({ _id: payload.id });
      switch (modifyType) {
        case 'word':
          await Profanity.updateOne(
            { _id: payload.id },
            {
              type: 'Edited',
              swear: payload.newWord,
            }
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
            {
              type: 'Edited',
              countryCode: payload.newCountry,
            }
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
              type: 'Edited',
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
          error: `The word: ${extDoc.swear} and country: ${extDoc.countryCode} already exist.`,
        });
      } else {
        res.status(500).json(e);
      }
    }
  },
  addMultipleSwears: async function (req, res) {
    const filePath = 'uploads/' + req.file.filename;

    const payload = req.body;
    const adminId = payload.adminId;
    const timestamp = payload.timestamp;
    const internalId = payload.internalId;

    if (!adminId || !internalId)
      return res.status(500).json({
        error: 'payload should contain both "adminId" and "internalId"',
      });

    let bulkUploadData = [];

    await readXlsxFile(filePath)
      .then(async (rows) => {
        fs.unlinkSync(filePath);
        if (!rows.length)
          return res
            .status(500)
            .json({ error: 'Uploaded file contains no data' });

        for (const row of rows) {
          if (row.length < 2) continue;
          if (row[0] == null || row[1] == null) continue;

          bulkUploadData.push({
            type: 'Added',
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

        await Profanity.insertMany(bulkUploadData)
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
                adminId,
                timestamp,
                internalId,
              });
            });
            await ProfanityHistory.insertMany(history)
              .then(() =>
                res.json({
                  message: `${result.length} out of ${rows.length} uploaded successfully.`,
                })
              )
              .catch((error) => res.status(500).json({ error }));
          })
          .catch((e) => {
            if (e.code === 11000) {
              const extDoc = e.writeErrors[0].err.op;
              res.status(500).json({
                error: `The word: ${extDoc.swear} and country: ${extDoc.countryCode} already exist.`,
              });
            } else res.status(500).json({ error: e });
          });
      })
      .catch((error) => res.status(500).json({ error }));
  },
};
