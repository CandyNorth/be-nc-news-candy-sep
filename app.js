const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics } = require("./controllers/topics-controller");

app.use(express.json());

app.get("/api/topics", getTopics)

// Request method whitelist/handler
app.use((request, response, next) => {
    // if (!/^(GET|PUT|POST|DELETE)$/.test(request.method)) {
    if (!/^(GET)$/.test(request.method)) {
      response.status(405).json({ msg: "Method Not Allowed" });
    } else {
      next();
    }
  });

module.exports = { app, endpoints }