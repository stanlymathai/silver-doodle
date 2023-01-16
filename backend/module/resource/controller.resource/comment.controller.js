const Comment = require('../model.resource/comment.model');
const Reaction = require('../model.resource/reaction.model');
const Article = require('../model.resource/article.model');
const articleController = require('./article.controller');
module.exports = {
  addComment(req, res) {
    const payload = req.body.payload;
    const commentData = (({
      text,
      comId,
      userId,
      parentId,
      articleId,
      timeStamp,
    }) => ({
      text,
      comId,
      userId,
      parentId,
      articleId,
      timeStamp,
    }))(payload);

    const comment = new Comment(commentData);
    comment
      .save()
      .then(() => res.json({ message: 'Success' }))
      .catch((e) => res.status(500).json({ error: e }));
  },

  getComments(req, res) {
    const articleId = req.params.articleId;
    const userId = req.params.userId;
    if (!articleId || !userId)
      return res
        .status(500)
        .json({ error: `unique ${userId} identifier ${articleId} required` });

    try {
      Article.exists({ articleId }, async function (_, result) {
        if (result) {
          // reaction handlers
          const hasUserReacted = (arr, val) =>
            arr.some((el) => el.reaction == val && el.userId == userId);
          const userReactions = (reactions) => {
            return {
              like: hasUserReacted(reactions, 'like'),
              brilliant: hasUserReacted(reactions, 'brilliant'),
              thoughtful: hasUserReacted(reactions, 'thoughtful'),
            };
          };

          // article session
          const articleQueryParams = {
            ref: articleId,
            status: 'Active',
            type: 'ARTICLE',
          };

          const articleReactions = await Reaction.aggregate([
            { $match: articleQueryParams },
            { $project: { _id: 0, userId: 1, reaction: 1 } },
          ]);

          const articleData = {
            articleId,
            reactionCount: articleReactions.length,
            reaction: userReactions(articleReactions),
          };

          // comment session
          const reactionPipe = [
            { $match: { type: 'COMMENT', status: 'Active' } },
            { $project: { _id: 0, userId: 1, reaction: 1 } },
          ];

          const commentProject = {
            _id: 0,
            text: 1,
            comId: 1,
            userId: 1,
            timeStamp: 1,
            fullName: '$user.fullName',
            avatarUrl: '$user.avatarUrl',
          };

          const userLookup = {
            from: 'users',
            pipeline: [{ $limit: 1 }],
            localField: 'userId',
            foreignField: 'userId',
            as: 'user',
          };

          const reactionLookup = {
            from: 'reactions',
            pipeline: reactionPipe,
            localField: 'comId',
            foreignField: 'ref',
            as: 'reactions',
          };

          const replyLookup = {
            from: 'comments',
            pipeline: [
              { $lookup: userLookup },
              { $unwind: '$user' },
              { $project: { parentId: 1, ...commentProject } },
              { $lookup: reactionLookup },
              { $project: { userId: 0 } },
            ],
            localField: 'comId',
            foreignField: 'parentId',
            as: 'replies',
          };

          const commentData = await Comment.aggregate([
            { $match: { parentId: null, articleId } },
            { $sort: { _id: -1 } },
            { $lookup: userLookup },
            { $unwind: '$user' },
            { $project: commentProject },
            { $lookup: reactionLookup },
            { $lookup: replyLookup },
            { $project: { userId: 0 } },
          ]);

          commentData.forEach((thread) => {
            thread.reaction = userReactions(thread.reactions);
            thread.reactionCount = thread.reactions.length;
            delete thread.reactions;

            if (thread.replies.length) {
              thread.replies.forEach((rThread) => {
                rThread.reaction = userReactions(rThread.reactions);
                rThread.reactionCount = rThread.reactions.length;
                delete rThread.reactions;
              });
            }
          });
          res.json({ articleData, commentData });
        } else articleController.getArticleById(req, res);
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  getAllComments(_, res) {
    Comment.aggregate([
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
};
