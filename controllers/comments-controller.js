const { selectCommentsByArticleId } = require("../models/comments-model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).json({ comments });
    })
    .catch((err) => {
      if (err) {
        next(err);
      }
    });
};
