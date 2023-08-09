const Comment = require('../model.resource/comment.model');
const Config = require('../model.resource/config.model.js');

module.exports = {
  getAllComments(_, res) {
    Comment.aggregate([
      { $sort: { _id: -1 } },
      { $project: { _id: 0 } },

      {
        $lookup: {
          from: 'users',
          pipeline: [{ $limit: 1 }, { $project: { fullName: 1, _id: 0 } }],
          localField: 'userId',
          foreignField: 'userId',
          as: 'userName',
        },
      },
      {
        $lookup: {
          from: 'articles',
          pipeline: [
            { $limit: 1 },
            { $project: { slug: 1, title: 1, _id: 0 } },
          ],
          localField: 'articleId',
          foreignField: 'articleId',
          as: 'article',
        },
      },
      {
        $lookup: {
          from: 'reports',
          pipeline: [
            { $project: { ref: 0, reason: 0, _id: 0 } },
            {
              $lookup: {
                from: 'users',
                pipeline: [
                  { $limit: 1 },
                  { $project: { status: 1, _id: 0, userId: 1 } },
                  {
                    $lookup: {
                      from: 'reports',
                      pipeline: [{ $project: { _id: 1 } }, { $count: 'total' }],
                      localField: 'userId',
                      foreignField: 'reportedUser',
                      as: 'reported',
                    },
                  },
                ],
                localField: 'reportedUser',
                foreignField: 'userId',
                as: 'user',
              },
            },
          ],
          localField: 'comId',
          foreignField: 'ref',
          as: 'reporters',
        },
      },
    ])
      .then((comments) => res.json(comments))
      .catch((e) => console.log(e, 'getAllComments'));
  },

  getUserComments(req, res) {
    const userId = req.params.userId;
    if (!userId) {
      res.status(500).json({ error: 'userId not found' });
    } else {
      Comment.aggregate([
        { $match: { userId } },
        { $project: { _id: 0 } },
        {
          $lookup: {
            from: 'articles',
            pipeline: [{ $limit: 1 }, { $project: { slug: 1, _id: 0 } }],
            localField: 'articleId',
            foreignField: 'articleId',
            as: 'article',
          },
        },
        {
          $lookup: {
            from: 'reports',
            pipeline: [
              { $project: { ref: 0, reason: 0, _id: 0 } },
              {
                $lookup: {
                  from: 'users',
                  pipeline: [
                    { $limit: 1 },
                    { $project: { status: 1, _id: 0, userId: 1 } },
                    {
                      $lookup: {
                        from: 'reports',
                        pipeline: [
                          { $project: { _id: 1 } },
                          { $count: 'total' },
                        ],
                        localField: 'userId',
                        foreignField: 'reportedUser',
                        as: 'reported',
                      },
                    },
                  ],
                  localField: 'reportedUser',
                  foreignField: 'userId',
                  as: 'user',
                },
              },
            ],
            localField: 'comId',
            foreignField: 'ref',
            as: 'reporters',
          },
        },
      ])
        .then((comments) => res.json(comments))
        .catch((e) => console.log(e, 'getUserComments'));
    }
  },

  moderateComment(req, res) {
    const payload = req.body;
    Comment.updateOne(
      { comId: payload.comId },
      {
        moderated: true,
        moderator: payload.moderator,
        moderateReason: payload.reason,
      }
    )
      .then((result) => res.send(result))
      .catch((e) => res.status(500).json(e));
  },

  acknowledgeComment(req, res) {
    const payload = req.body;
    Comment.updateMany(
      { comId: { $in: payload.comIds } },
      {
        acknowledged: true,
        acknowledgedBy: payload.acknowledgedBy,
        acknowledgedAt: payload.acknowledgedAt,
      }
    )
      .then((result) => res.send(result))
      .catch((e) => res.status(500).json(e));
  },

  unReviewedCommentsCount(req, res) {
    Comment.aggregate([
      { $match: { acknowledged: false } },
      { $count: 'total' },
    ])
      .then((result) => res.status(200).json(result[0].total))
      .catch((e) => res.status(500).json(e));
  },

  async fetchUnReviewedComments(req, res) {
    const payload = req.body;

    const searchType = payload.searchType || 'Default';
    const matchParams = {
      acknowledged: false,
      articleId: payload.selectedArticle,
      ...(searchType === 'By Article' && { platform: 'NEWS' }),
      ...(searchType === 'By Podcast' && { platform: 'PODCAST' }),
    };

    // sort type for default, oldest and latest comments
    let sortType = { _id: -1 }; // latest sort type
    if (searchType === 'Oldest') sortType._id = 1;
    if (searchType === 'Default') sortType = { 'reporters.count': -1 };

    try {
      const reviewBatchCessation = await Config.findOne({
        type: 'REVIEW_BATCH_CESSATION',
      });
      if (!reviewBatchCessation)
        throw new Error('REVIEW_BATCH_CESSATION not found');

      const cessation = reviewBatchCessation.prelude;
      let cessationValue = 60;

      switch (cessation.unit) {
        case 'min':
          cessationValue = cessationValue * cessation.value;
          break;
        case 'hour':
          cessationValue = cessationValue * 60 * cessation.value;
          break;
        case 'day':
          cessationValue = cessationValue * 60 * 24 * cessation.value;
          break;

        default:
          throw new Error('invalid cessation');
      }
      matchParams.reviewTag = {
        $lte: new Date(Date.now() - 1000 * cessationValue),
      };
      Comment.aggregate([
        { $match: matchParams },
        { $limit: payload.limit },
        {
          $lookup: {
            from: 'articles',
            pipeline: [
              { $limit: 1 },
              { $project: { slug: 1, title: 1, _id: 0 } },
            ],
            localField: 'articleId',
            foreignField: 'articleId',
            as: 'article',
          },
        },
        {
          $lookup: {
            from: 'users',
            pipeline: [{ $limit: 1 }, { $project: { fullName: 1, _id: 0 } }],
            localField: 'userId',
            foreignField: 'userId',
            as: 'userDetails',
          },
        },
        {
          $lookup: {
            from: 'reports',
            pipeline: [
              { $project: { _id: 0, reason: 1 } },
              { $group: { _id: '$reporters', count: { $sum: 1 } } },
              { $project: { _id: 0, count: 1 } },
            ],
            localField: 'comId',
            foreignField: 'ref',
            as: 'reporters',
          },
        },

        { $unwind: '$userDetails' },
        { $unwind: '$reporters' },
        { $unwind: '$article' },

        { $sort: sortType },
        {
          $project: {
            _id: 0,
            text: 1,
            comId: 1,
            article: 1,
            moderator: 1,
            timeStamp: 1,
            reporters: 1,
            userDetails: 1,
          },
        },
      ]).then((unReviewedComments) => {
        // update reviewTag for fetched comments
        Comment.updateMany(
          { comId: { $in: unReviewedComments.map((el) => el.comId) } },
          { reviewTag: new Date() }
        ).then(() => res.status(200).json({ unReviewedComments, cessation }));
      });
    } catch (e) {
      console.log(error, 'fetchUnReviewedComments');
      res.status(500).json(e);
    }
  },
};
