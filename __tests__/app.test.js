const { app, endpoints } = require("../app");
const request = require("supertest");
const req = request(app);
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app.js", () => {
  describe("/api/topics", () => {
    test("GET:200 sends an array of topics to the client", () => {
      return req
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.topics)).toBe(true);
          expect(body.topics).toHaveLength(3);
        });
    });
    test("GET:200 each topic has the correct properties", () => {
      return req
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          body.topics.forEach((topic) => {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
    test("GET:404 comes back with an error for a path that doesnt exist", () => {
      return req
        .get("/api/topcsx")
        .expect(404)
        .then((response) => {
          expect(response.request.res.statusMessage).toBe("Not Found");
          expect(response.status).toBe(404);
        });
    });
    test("POST:405 will return a  'Method Not Allowed' for unsupported HTTP method", () => {
      return req
        .post("/api/topics")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
    test("DELETE:405 will return 'Method Not Allowed' for an unsupported HTTP method", () => {
      return req
        .delete("/api/topics")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("/api", () => {
    test("GET:200 gives a JSON object describing all of the available endpoints that there are", () => {
      return req
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(endpoints);
        });
    });
    test("GET:200 the response includes all of the endpoints in the browser from the endpoints.json file", () => {
      return req
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          //console.log(Object.keys(body))
          // --> Object.keys(something) gets all the keys of the something obj
          // jest will compare ....
          expect(Object.keys(body)).toEqual(Object.keys(endpoints));
        });
    });
    test("GET:200 the contents of a specific endpoint matches/is the same as the endpoints.json file", () => {
      return req
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body["GET /api/topics"]).toEqual(endpoints["GET /api/topics"]);
        });
    });
    test("GET:404 returns an error for a route that doesnt exist", () => {
      return req
        .get("/api/non-existent-route")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
    test("GET:400 returns an error for a badly written/formed request", () => {
      return req
        .get("/api/articles/bad-request/%")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("POST:405 returns an error when using the wrong HTTP method", () => {
      return req
        .post("/api")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    test("GET:200 sends an array with a valid article inside to the client", () => {
      return req
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          expect(response.body.article.article_id).toBe(1);
          expect(response.body.article.title).toBe(
            "Living in the shadow of a great man",
          );
          expect(response.body.article.topic).toBe("mitch");
          expect(response.body.article.author).toBe("butter_bridge");
          expect(response.body.article.body).toBe(
            "I find this existence challenging",
          );
          expect(response.body.article.created_at).toBe(
            "2020-07-09T20:11:00.000Z",
          );
          expect(response.body.article.votes).toBe(100);
          expect(response.body.article.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          );
        });
    });
    test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
      return req
        .get("/api/articles/999")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Not Found");
        });
    });
    test("GET:400 responds with an appropriate error message when given an invalid id", () => {
      return req
        .get("/api/articles/not-an-id")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad Request");
        });
    });
  });
  describe("/api/articles", () => {
    test("GET:200 sends an array of articles to the client", () => {
      return req
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.articles)).toBe(true);
          expect(body.articles.length).toBeGreaterThan(0);
        });
    });
    test("GET:200 each article has the required properties and no body", () => {
      return req
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).not.toHaveProperty("body");
            expect(article).not.toHaveProperty("not_a_property");
          });
        });
    });
    test("GET:200 each article includes a comment_count", () => {
      return req
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          body.articles.forEach((article) => {
            expect(article).toHaveProperty("comment_count");
            expect(typeof article.comment_count).toBe("number");
          });
        });
    });
    test("GET:200 articles are sorted by date in descending order", () => {
      return req
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("GET:404 responds with an error for a non-existent route", () => {
      return req
        .get("/api/non-existent-route")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Route not found");
        });
    });
    test("GET:400 responds with an error for an invalid article_id", () => {
      return req
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("GET:404 responds with an error for a non-existent article_id", () => {
      return req
        .get("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("POST:405 will return a  'Method Not Allowed' for unsupported HTTP method", () => {
      return req
        .post("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
    test("DELETE:405 will return 'Method Not Allowed' for an unsupported HTTP method", () => {
      return req
        .delete("/api/articles")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with an array of comments for the given article_id", () => {
      return req
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.comments)).toBe(true);
          expect(body.comments.length).toBeGreaterThan(0);
          body.comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id", expect.any(Number));
            expect(comment).toHaveProperty("votes", expect.any(Number));
            expect(comment).toHaveProperty("created_at", expect.any(String));
            expect(comment).toHaveProperty("author", expect.any(String));
            expect(comment).toHaveProperty("body", expect.any(String));
            expect(comment).toHaveProperty("article_id", 1);
          });
        });
    });
    test("200: comments are served with the most recent first", () => {
      return req
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("404: responds with an error for a non-existent article_id", () => {
      return req
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400: responds with an error for an invalid article_id", () => {
      return req
        .get("/api/articles/not-a-number/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("DELETE:405 will return 'Method Not Allowed' for an unsupported HTTP method", () => {
      return req
        .delete("/api/articles/1/comments")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: this will insert someones new comment and come back/respond with the posted comment", () => {
      const newComment = {
        username: "rogersop",
        body: "I only like soap operas with cheese involved",
      };
      return req
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: expect.any(Number),
            body: "I only like soap operas with cheese involved",
            article_id: 1,
            author: "rogersop",
            votes: 0,
            created_at: expect.any(String),
          });
        });
    });
    test("400: comes back with an error for missing required fields", () => {
      const invalidComment = { username: "butter_bridge" };
      return req
        .post("/api/articles/1/comments")
        .send(invalidComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Missing required fields");
        });
    });
    test("404: comes back with an error for a non-existent article_id", () => {
      const newComment = {
        username: "butter_bridge",
        body: "This is a test comment",
      };
      return req
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
    test("400: comes back with an error for an invalid article_id", () => {
      const newComment = {
        username: "lettuce_pray",
        body: "eat more veg you absolute carnivore!!",
      };
      return req
        .post("/api/articles/not-a-number/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    test("404: comes back with an error for a user that doesn't exist", () => {
      const newComment = {
        username: "non_existent_user",
        body: "non existent grilled cheese sandwich",
      };
      return req
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});
