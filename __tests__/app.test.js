const { app, endpoints } = require("../app");
const request = require("supertest")
const req = request(app);
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")

beforeEach(() => seed(testData)) 
afterAll(() => db.end())

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
});