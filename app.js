const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics-controller");
const { getArticleById, getArticles } = require("./controllers/articles-controller");

app.use(express.json());

// Topics endpoint
app.get("/api/topics", getTopics);

// API index endpoint
app.get("/api", (request, response) => {
    response.json(endpoints);
});

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

// Request method whitelist/handler
app.use((request, response, next) => {
    // if (!/^(GET|PUT|POST|DELETE)$/.test(request.method)) {
    if (!/^(GET)$/.test(request.method)) {
        response.status(405).json({ msg: "Method Not Allowed" });
    } else {
        next();
    }
});

// 404 handler for unknown routes (sometimes can have errors that look normal)
app.all("*", (request, response, next) => {
    response.status(404).json({ msg: "Route not found" });
});

// Custom Error handlers
app.use((err, request, response, next) => {
    if (err.code === "22P02") {
        response.status(400).json({ msg: "Bad Request" });
    } else {
        next(err);
    }
})

// Error handler
app.use((err, request, response, next) => {
    //console.log(err);
    if (err.status === 400) {
        response.status(400).json({ msg: "Bad Request" });
    } else if (err.status === 404) {
        response.status(404).json({ msg: "Not Found" });
    } else if (err.status === 405) {
        response.status(405).json({ msg: "Method Not Allowed" });
    } else if (err.status === 500) {
        response.status(500).json({ msg: "Internal Server Error" });
    } else {
        console.log(err);
        next(err);
    }
});

module.exports = { app, endpoints };
