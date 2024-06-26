const Comment = require('../model.resource/comment.model');
const Article = require('../model.resource/article.model');
const Reaction = require('../model.resource/reaction.model');
const Platform = require('../model.resource/platform.model');

const Config = require('../model.resource/config.model.js');
const Profanity = require('../model.resource/profanity.model');

const User = require('../../auth/model.auth/user.model.js');
const UserLog = require('../../auth/model.auth/log.user.model.js');

const alerts = require('../utils.resource/alert.utils');

const TYPES = { TIMEOUT_CONFIG: 'TIMEOUT_CONFIG' };
const MILLI_SECONDS = 60 * 1000;

module.exports = {
  async getComments(req, res) {
    const payload = req.body;

    const articleInfo = (({
      id,
      slug,
      title,
      author,
      platformId,
      publishedAt,
    }) => ({
      slug,
      title,
      author,
      platformId,
      publishedAt,
      articleId: id,
    }))(payload);

    const articleId = articleInfo.articleId;
    const userId = payload.userId;
    if (!articleId || !userId)
      return res
        .status(500)
        .json({ error: `unique ${userId} identifier ${articleId} required` });

    try {
      await Platform.exists(
        { code: articleInfo.platformId, status: 'Active' },
        (_, pdata) => {
          if (!pdata)
            return res.status(500).json({ error: 'Invalid Platform.' });
        }
      );

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
          const commentFilter = {
            articleId,
            parentId: null,
            moderator: { $ne: 'Profanity' },
            platform: articleInfo.platformId,
          };

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
            moderated: 1,
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
              { $match: { moderator: { $ne: 'Profanity' } } },
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
            { $match: commentFilter },
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
        } else {
          const responseData = {
            articleData: {
              articleId,
              reaction: {
                like: false,
                brilliant: false,
                thoughtful: false,
              },
              reactionCount: 0,
            },
            commentData: [],
          };
          const ARTICLE = new Article(articleInfo);
          ARTICLE.save().then(() => res.json({ ...responseData }));
        }
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },

  async addComment(req, res) {
    const payload = req.body.payload;
    const commentData = (({
      text,
      comId,
      userId,
      parentId,
      platform,
      articleId,
      timeStamp,
    }) => ({
      text,
      comId,
      userId,
      parentId,
      platform,
      articleId,
      timeStamp,
    }))(payload);

    try {
      const USER = await User.aggregate([
        { $match: { userId: payload.userId } },
        { $limit: 1 },
        {
          $lookup: {
            from: 'userlogs',
            pipeline: [{ $limit: 1 }],
            localField: 'userId',
            foreignField: 'userId',
            as: 'userLog',
          },
        },
      ]);

      if (USER.status == 'BANNED')
        return res.json({
          ...commentData,
          alert: alerts.banedAlert,
        });

      const timeNow = Date.now();
      const userLogs = USER[0].userLog[0];
      const userBans = [...userLogs.bans];
      const tickers = [...userLogs.tickers];
      const timeouts = [...userLogs.timeouts];

      // check user is in temporary ban
      if (userBans.length > 0) {
        const banStarts = new Date(userBans[userBans.length - 1].banStarts);
        const banUntil = new Date(userBans[userBans.length - 1].banUntil);

        const dateInQuestion = new Date().toJSON().slice(0, 10);
        const dateNow = new Date(dateInQuestion);
        const isInBan =
          dateNow.getTime() <= banUntil.getTime() &&
          dateNow.getTime() >= banStarts.getTime();

        if (isInBan)
          return res.json({
            ...commentData,
            alert: alerts.tempBanAlert + banUntil.toDateString(),
          });
      }

      await Config.findOne({ type: TYPES.TIMEOUT_CONFIG }).then(
        async (config) => {
          const prelude = config?.prelude;
          if (!prelude) return;

          const isInTimeout =
            timeouts.length &&
            timeouts[timeouts.length - 1].createdAt >
              timeNow - prelude.timeout * MILLI_SECONDS;

          const response = {
            alert:
              alerts.timoutMessage[0] +
              prelude.timeout +
              alerts.timoutMessage[1],
            ...commentData,
          };
          if (isInTimeout) return res.json(response);

          const tickersInQuestion = tickers.filter(
            (el) => timeNow - el.ticker < prelude.interval * MILLI_SECONDS
          );

          if (tickersInQuestion.length >= prelude.moderation) {
            await UserLog.updateOne(
              { userId: USER[0].userId },
              {
                $push: {
                  timeouts: {
                    createdAt: timeNow,
                    timeout: prelude.timeout,
                    timeStamp: payload.timeStamp,
                  },
                },
              }
            );
            return res.json(response);
          }

          // profanity section
          const checkList = commentData.text.split(' ') || [];

          Profanity.find(
            { swear: { $in: checkList }, status: 'Active' },
            { _id: 0, swear: 1 }
          ).then(async (result) => {
            let responseData = { message: 'Success' };
            if (result.length) {
              responseData = {
                ...commentData,
                alert: alerts.profanityWarning,
              };

              commentData.moderated = true;
              commentData.status = 'Moderated';
              commentData.moderator = 'Profanity';
              commentData.moderateReason =
                'Comment contains ' + result.map((item) => item['swear']);

              await UserLog.updateOne(
                { userId: USER[0].userId },
                {
                  $push: {
                    tickers: {
                      ticker: Date.now(),
                      comId: payload.comId,
                      timeStamp: payload.timeStamp,
                    },
                  },
                }
              );
            }

            const comment = new Comment(commentData);
            comment.save().then(() => res.json(responseData));
          });
        }
      );
    } catch (error) {
      console.log(error, 'addComment');
      res.status(500).json({ error });
    }
  },

  async guestViewComments(req, res) {
    const payload = req.body;

    const articleInfo = (({
      id,
      slug,
      title,
      author,
      platformId,
      publishedAt,
    }) => ({
      slug,
      title,
      author,
      platformId,
      publishedAt,
      articleId: id,
    }))(payload);

    const articleId = articleInfo.articleId;

    if (!articleId)
      return res.status(500).json({ error: 'article identifier required' });

    try {
      await Platform.exists(
        { code: articleInfo.platformId, status: 'Active' },
        (_, pdata) => {
          if (!pdata)
            return res.status(500).json({ error: 'Invalid Platform.' });
        }
      );
      Article.exists({ articleId }, async function (_, result) {
        if (result) {
          // article aggregations
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
            reaction: {
              like: false,
              brilliant: false,
              thoughtful: false,
            },
          };

          // comment aggregations
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
            moderated: 1,
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
            {
              $match: {
                articleId,
                parentId: null,
                platform: articleInfo.platformId,
              },
            },
            { $sort: { _id: -1 } },
            { $lookup: userLookup },
            { $unwind: '$user' },
            { $project: commentProject },
            { $lookup: reactionLookup },
            { $lookup: replyLookup },
            { $project: { userId: 0 } },
          ]);

          commentData.forEach((thread) => {
            thread.reaction = {
              like: false,
              brilliant: false,
              thoughtful: false,
            };
            thread.reactionCount = thread.reactions.length;
            delete thread.reactions;

            if (thread.replies.length) {
              thread.replies.forEach((rThread) => {
                rThread.reaction = {
                  like: false,
                  brilliant: false,
                  thoughtful: false,
                };
                rThread.reactionCount = rThread.reactions.length;
                delete rThread.reactions;
              });
            }
          });
          res.json({ articleData, commentData });
        } else {
          const responseData = {
            articleData: {
              articleId,
              reaction: {
                like: false,
                brilliant: false,
                thoughtful: false,
              },
              reactionCount: 0,
            },
            commentData: [],
          };
          const ARTICLE = new Article(articleInfo);
          ARTICLE.save().then(() => res.json({ ...responseData }));
        }
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  },
};
