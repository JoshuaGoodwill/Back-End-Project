const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.modelGetCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((result) => {
    return result.rows;
  });
};

exports.modelGetEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((readFileResult) => {
      return JSON.parse(readFileResult);
    });
};

exports.modelGetReview = (reviewID) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewID])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid review_id" });
      }

      return result.rows[0];
    });
};

exports.modelGetReviews = () => {
  return db
    .query(
      `SELECT reviews.review_id, title, category, designer, owner, review_img_url, reviews.created_at, reviews.votes, Count(comment_id) AS comment_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id=comments.review_id 
    GROUP BY reviews.review_id 
    ORDER BY reviews.review_id`
    )
    .then((result) => {
      return result.rows;
    });
};
