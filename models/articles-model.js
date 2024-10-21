const db = require("../db/connection");
//const format = require("pg-format");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
    `,
      [article_id],
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return article;
    });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validColumns = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort column" });
  }

  const validOrders = ["asc", "desc"];

  if (!validOrders.includes(order.toLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let query = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  const queryParams = [];

  if (topic) {
    return db
      .query("SELECT * FROM topics WHERE slug = $1", [topic])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        }
        query += ` WHERE articles.topic = $1`;
        queryParams.push(topic);
        return;
      })
      .then(() => {
        query += ` GROUP BY articles.article_id`;

        if (sort_by === "comment_count") {
          query += ` ORDER BY comment_count ${order.toUpperCase()}`;
        } else {
          query += ` ORDER BY articles.${sort_by} ${order.toUpperCase()}`;
        }

        return db.query(query, queryParams);
      })
      .then(({ rows }) => rows);
  } else {
    query += ` GROUP BY articles.article_id`;

    if (sort_by === "comment_count") {
      query += ` ORDER BY comment_count ${order.toUpperCase()}`;
    } else {
      query += ` ORDER BY articles.${sort_by} ${order.toUpperCase()}`;
    }

    return db.query(query).then(({ rows }) => rows);
  }
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [inc_votes, article_id],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      return rows[0];
    });
};
