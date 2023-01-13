const Article = require('../model.resource/article.model');
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
      { $match: { comments: { $elemMatch: { $exists: true } } } },
    ])
      .then((articles) => {
        res.json({ articles });
      })
      .catch((e) => console.log(e, 'getAllArticles'));
  },
  getArticleById(req, res) {
    let articleId = req.params.articleId;
    axios
      .get(process.env.CMS_ARTICLE_API + articleId)
      .then((response) => {
        let responseData = response.data;
        let articleData = {
          slug: responseData.slug,
          title: responseData.title,
          articleId: responseData.id,
          publishedAt: responseData.published_at,
          author: responseData.author?.name?.slice(8),
        };
        let payload = {
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
  },
};
