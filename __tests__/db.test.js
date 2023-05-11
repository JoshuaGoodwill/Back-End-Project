const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const fs = require("fs/promises");
const { readFile } = require("fs");
const sort = require("jest-sorted");

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

describe("/api", () => {
  test("GET - status: 200 - responds with endpoints.json content", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((apiResult) => {
        return fs
          .readFile(`${__dirname}/../endpoints.json`, "utf-8")
          .then((readFileResult) => {
            expect(apiResult.body.endpoints).toEqual(
              JSON.parse(readFileResult)
            );
          });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET - status: 200 - responds with correct review object", () => {
    return request(app)
      .get("/api/review/3")
      .expect(200)
      .then((result) => {
        expect(result.body.review).toEqual({
          review_id: 3,
          title: "Ultimate Werewolf",
          category: "social deduction",
          designer: "Akihisa Okui",
          owner: "bainesface",
          review_body: "We couldn't find the werewolf!",
          review_img_url:
            "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
        });
      });
  });
  test("GET - status: 404 - gives correct error when review_id not found", () => {
    return request(app)
      .get("/api/review/666")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("review_id not found");
      });
  });
  test("GET - status: 400 - gives correct error when given an invalid review_id data type", () => {
    return request(app)
      .get("/api/review/woof")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid endpoint input");
      });
  });
  test("GET - status: 400 - gives correct error when given an integer overflow", () => {
    return request(app)
      .get("/api/review/124124124124124")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid endpoint input");
      });
  });
});

describe("/api/reviews", () => {
  test("GET - status: 200 - should bring back array with objects in correct structure ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(result.body.reviews.length).toBeGreaterThan(0);
        result.body.reviews.forEach((review) => {
          expect(Object.keys(review).length).toBe(9);
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.title).toBe("string");
          expect(typeof review.category).toBe("string");
          expect(typeof review.designer).toBe("string");
          expect(typeof review.owner).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.comment_count).toBe("string");
        });
      });
  });

  test("GET - status: 200 - should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(result.body.reviews).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
});

describe("/api/reviews/review:id/comments", () => {
  test("GET - status: 200 - should return correct array of comments objects", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments.length).toBeGreaterThan(0);
        result.body.comments.forEach((comment) => {
          expect(Object.keys(comment).length).toBe(6);
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(comment.review_id).toBe(2);
        });
      });
  });

  test("GET - status: 200 - should return empty array when no comments exist but review_id is valid", () => {
    return request(app)
      .get("/api/reviews/5/comments")
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toEqual([]);
      });
  });

  test("GET - status: 404 - should return message when review_id isn't found", () => {
    return request(app)
      .get("/api/reviews/321/comments")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("review_id not found");
      });
  });

  test("GET - status: 400 - should return message when review_id isn't valid", () => {
    return request(app)
      .get("/api/reviews/woof/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid endpoint input");
      });
  });
});
