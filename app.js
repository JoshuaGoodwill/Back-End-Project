const express = require("express");
const {
  getCategories,
  getEndpoints,
  getReview,
  getReviews,
  getComments,
  postComment,
  patchReview,
  getUsers,
} = require("./controllers/categories.controller");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/categories", getCategories);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReview);
app.patch("/api/reviews/:review_id", patchReview);

app.get("/api/reviews/:review_id/comments", getComments);
app.post("/api/reviews/:review_id/comments", postComment);

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "22003") {
    res.status(400).send({ msg: "Invalid endpoint input" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server error!" });
});

module.exports = app;
