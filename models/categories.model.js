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
        return Promise.reject({ status: 404, msg: "review_id not found" });
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

exports.modelGetComments = (reviewID) => {
  return db
  .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewID])
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "review_id not found" });
    } else {
    return db
      .query(
        `SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id 
    FROM comments 
    LEFT JOIN reviews ON comments.review_id=reviews.review_id 
    WHERE comments.review_id = $1
    ORDER BY comments.created_at;`,
        [reviewID]
      )
      .then((result) => {
        return result.rows;
      });
    }
  });
};

exports.modelPostComment = (reviewID, username, body) => {
  return db
  .query(`SELECT * FROM reviews WHERE review_id = $1`, [reviewID])
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "review_id not found" });
    } else if(!username || !body || username === "" || body === ""){
      console.log("in model")
      console.log(`username: ${username}, body: ${body}`);
      return Promise.reject({status: 400, msg: "Input data missing"});
    } else {
      return db
      .query(`SELECT * FROM users WHERE username = $1`, [username])
      .then((result) => {
        if(result.rows.length === 0){
          return Promise.reject({status: 404, msg: "username not found"})
        } else {
          return db
          .query(`
          INSERT INTO comments 
          (body, review_id, author) 
          VALUES 
          ( $1, $2, $3) 
          RETURNING *;`, [body, reviewID, username])
          .then((result) => {
            return result.rows[0];
          })
        }
      })
    }
  });
}