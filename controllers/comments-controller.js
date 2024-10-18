const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentById,
} = require("../models/comments-model");

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).json({ comments });
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};

exports.postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  if (!username || !body) {
    return response.status(400).json({ msg: "Bad Request" });
  }

  insertCommentByArticleId(article_id, username, body)
    .then((comment) => {
      response.status(201).json({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  deleteCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
};
