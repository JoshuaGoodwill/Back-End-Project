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
      .get("/api/reviews/3")
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
      .get("/api/reviews/666")
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("review_id not found");
      });
  });
  test("GET - status: 400 - gives correct error when given an invalid review_id data type", () => {
    return request(app)
      .get("/api/reviews/woof")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid endpoint input");
      });
  });
  test("GET - status: 400 - gives correct error when given an integer overflow", () => {
    return request(app)
      .get("/api/reviews/124124124124124")
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid endpoint input");
      });
  });

  test("PATCH - status: 200 - increases votes by correct amount", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: 5 })
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
          votes: 10,
        });
      });
  });

  test("PATCH - status: 200 - decreases votes by correct amount", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: -5 })
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
          votes: 0,
        });
      });
  });

  test("PATCH - status: 400 - gives correct error when not given a number", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: "string" })
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid input");
      });
  });

  test("PATCH - status: 400 - gives correct error when not given inc_votes key", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ randomKey: 5, secondRandomKey: "string" })
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid input");
      });
  });

  test("PATCH - status: 400 - gives correct error when given an invalid review_id data type", () => {
    return request(app)
      .patch("/api/reviews/woof")
      .send({ inc_votes: 5 })
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Invalid endpoint input");
      });
  });

  test("PATCH - status: 404 - gives correct error when review_id not found", () => {
    return request(app)
      .patch("/api/reviews/666")
      .send({ inc_votes: 5 })
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("review_id not found");
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

  test("POST - status: 201 - should add comment and return the new comment object", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
        body: "How did the farmer find his lost cow? He tractor down.",
      })
      .expect(201)
      .then((result) => {
        expect(result.body.comment.review_id).toBe(1);
        expect(result.body.comment.author).toBe("mallionaire");
        expect(result.body.comment.body).toBe(
          "How did the farmer find his lost cow? He tractor down."
        );
        expect(typeof result.body.comment.comment_id).toBe("number");
        expect(typeof result.body.comment.votes).toBe("number");
        expect(typeof result.body.comment.created_at).toBe("string");
      });
  });

  test("POST - status: 201 - should add comment and return the new comment object when given extra keys on the input object", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
        body: "How did the farmer find his lost cow? He tractor down.",
        a: 1,
        b: 2,
        c: 3,
      })
      .expect(201)
      .then((result) => {
        expect(result.body.comment.review_id).toBe(1);
        expect(result.body.comment.author).toBe("mallionaire");
        expect(result.body.comment.body).toBe(
          "How did the farmer find his lost cow? He tractor down."
        );
        expect(typeof result.body.comment.comment_id).toBe("number");
        expect(typeof result.body.comment.votes).toBe("number");
        expect(typeof result.body.comment.created_at).toBe("string");

        expect(Object.keys(result.body.comment)).not.toContain("a");
        expect(Object.keys(result.body.comment)).not.toContain("b");
        expect(Object.keys(result.body.comment)).not.toContain("c");
      });
  });

  test("POST - status: 404 - should return message when review_id isn't found", () => {
    return request(app)
      .post("/api/reviews/123/comments")
      .send({
        username: "mallionaire",
        body: "How did the farmer find his lost cow? He tractor down.",
      })
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("review_id not found");
      });
  });

  test("POST - status: 404 - should return message when username isn't found", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "josh",
        body: "How did the farmer find his lost cow? He tractor down.",
      })
      .expect(404)
      .then((result) => {
        expect(result.body.msg).toBe("username not found");
      });
  });

  test("POST - status: 400 - should return message when input data is missing", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "mallionaire",
      })
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Input data missing");
      });
  });

  test("POST - status: 400 - should return message when input data is missing", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({
        username: "",
        body: "body",
      })
      .expect(400)
      .then((result) => {
        expect(result.body.msg).toBe("Input data missing");
      });
  });
});
