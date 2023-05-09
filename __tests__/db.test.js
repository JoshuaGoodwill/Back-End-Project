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

describe('/api/reviews/:review_id', () => {
    test('GET - status: 200 - responds with correct review object', () => {
        return request(app)
        .get("/api/review/3")
        .expect(200)
        .then((result) => {
            expect(result.body.review).toEqual({ review_id: 3, title: "Ultimate Werewolf", category: "social deduction", designer: "Akihisa Okui", owner: "bainesface", review_body: "We couldn't find the werewolf!", review_img_url: "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700", created_at: "2021-01-18T10:01:41.251Z", votes: 5});
        })
    });
    test('GET - status: 400 - gives correct error when given an invalid review_id number', () => {
        return request(app)
        .get("/api/review/666")
        .expect(400)
        .then((result) => {
            expect(result.body.msg).toEqual("Invalid review_id")
        });
    });
    test('GET - status: 400 - gives correct error when given an invalid review_id data type', () => {
        return request(app)
        .get("/api/review/woof")
        .expect(400)
        .then((result) => {
            expect(result.body.msg).toEqual("Invalid review_id")
        });
    });
    test('GET - status: 400 - gives correct error when given an integer overflow', () => {
        return request(app)
        .get("/api/review/124124124124124")
        .expect(400)
        .then((result) => {
            expect(result.body.msg).toEqual("Invalid review_id")
        });
    });
});