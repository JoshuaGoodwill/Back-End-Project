const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const fs = require("fs/promises");
const { readFile } = require("fs");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  test("GET - status: 200 - responds with json object with key of categories and value of array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories.length).toBeGreaterThan(0);
        res.body.categories.forEach((category) => {
          expect(Object.keys(category).length).toBe(2);
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        });
      });
  });
});

describe('/api', () => {
    test("GET - status: 200 - responds with endpoints.json content", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((apiResult) => {
            return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((readFileResult) => {
                expect(apiResult.body.endpoints).toEqual(JSON.parse(readFileResult));
            })
        })
    });
});