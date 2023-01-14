const Comment = require('../model.resource/comment.model');
const Reaction = require('../model.resource/reaction.model');
const Article = require('../model.resource/article.model');
const articleController = require('./article.controller');
module.exports = {
  addComment(req, res) {
    const payload = req.body.payload;
    const comment = new Comment(req.body.payload);
    comment
      .save()
      .then(() => res.json({ message: 'Success' }))
      .catch((e) => res.status(500).json({ error: e }));
  },

  getComments(req, res) {
    const articleId = req.params.articleId;
    const userId = req.user.userId;
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
            {
              $match: {
                type: 'COMMENT',
                status: 'Active',
              },
            },
            { $project: { _id: 0, userId: 1, reaction: 1 } },
          ];
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
              { $lookup: reactionLookup },
              { $project: { _id: 0, userId: 0, articleId: 0 } },
            ],
            localField: 'comId',
            foreignField: 'parentId',
            as: 'replies',
          };

          const commentData = await Comment.aggregate([
            { $match: { parentId: null, articleId } },
            { $sort: { _id: -1 } },
            { $project: { _id: 0, userId: 0, articleId: 0 } },
            { $lookup: reactionLookup },
            { $lookup: replyLookup },
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
};
