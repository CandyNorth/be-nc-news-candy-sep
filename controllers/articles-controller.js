const {
  selectArticleById,
  selectArticles,
  updateArticleVotes,
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
  const { sort_by } = request.query;
  selectArticles(sort_by)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  if (typeof inc_votes !== "number") {
    return response.status(400).json({ msg: "Bad Request" });
  } else if (inc_votes === undefined) {
    return response.status(400).json({ msg: "Bad Request" });
  }

  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      response.status(200).json({ article });
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};
