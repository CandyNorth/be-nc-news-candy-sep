const db = require("../db/connection");
//const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return rows[0];
    })
    .catch();
};

exports.selectArticles = () => {
  return db.query("SELECT * FROM articles;").then(({ rows }) => rows);
};

// exports.selectArticles = (articles) => {
//     return db
//       .query('SELECT * FROM articles;')
//       .then(({ rows }) => {
//         rows.forEach((article) => {
//           const commentCount = db.query("SELECT COUNT(*) FROM comments WHERE article_id = $1;", [article_id_here])
//           article.comment_count = 69
//         })
//         console.log(rows)
//         const articles = rows;
//         if (!articles) {
//           return Promise.reject({
//             status: 404,
//             msg: "Not Found"
//           });
//         }
//         return rows;
//       })
//       .catch();
//   };
