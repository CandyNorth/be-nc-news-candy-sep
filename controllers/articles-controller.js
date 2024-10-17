const {
  selectArticleById,
  selectArticles,
} = require("../models/articles-model");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

exports.getArticles = (request, response, next) => {
  const { articles } = request.params;
  selectArticles(articles)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};
