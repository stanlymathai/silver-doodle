const Article = require('../model.resource/article.model');
const Platform = require('../model.resource/platform.model');

const axios = require('axios');

module.exports = {
  getAllArticles(_, res) {
    Article.aggregate([
      { $project: { _id: 0, timeStamp: 0 } },
      {
        $lookup: {
          from: 'reactions',
          pipeline: [
            { $match: { type: 'ARTICLE', status: 'Active' } },
            { $project: { reaction: 1, _id: 0 } },
            { $group: { _id: '$reaction', count: { $sum: 1 } } },
            { $project: { _id: 0, type: '$_id', count: 1 } },
          ],
          localField: 'articleId',
          foreignField: 'ref',
          as: 'reactions',
        },
      },
      {
        $lookup: {
          from: 'comments',
          pipeline: [{ $count: 'total' }],
          localField: 'articleId',
          foreignField: 'articleId',
          as: 'comments',
        },
      },
      {
        $match: {
          $or: [
            { comments: { $elemMatch: { $exists: true } } },
            { reactions: { $elemMatch: { $exists: true } } },
          ],
        },
      },
    ])
      .then((articles) => res.json(articles))
      .catch((e) => console.log(e, 'getAllArticles'));
  },

  async getArticleById(req, res) {
    const articleId = req.params.articleId;
    const platformId = req.params.platformId;

    await Platform.findOne({
      code: platformId,
      status: 'Active',
    })
      .then(async (platform) => {
        await axios
          .get(platform.resourceUrl + articleId)
          .then((response) => {
            const responseData = response.data;
            const articleData = {
              slug: responseData.slug,
              title: responseData.title,
              platformId: platform.code,
              articleId: responseData.id,
              publishedAt: responseData.published_at,
              author: responseData.author?.name?.slice(8),
            };
            const payload = {
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
            const article = new Article(articleData);
            article
              .save()
              .then(() => res.json({ ...payload }))
              .catch((e) => res.status(500).json({ error: e }));
          })
          .catch(function (error) {
            console.log(error, 'getArticleById');
          });
      })
      .catch((e) => res.status(500).json(e));
  },
};
