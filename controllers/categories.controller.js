const {
  modelGetCategories,
  modelGetEndpoints,
  modelGetReview,
} = require("../models/categories.model.js");

exports.getCategories = (req, res, next) => {
  modelGetCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res, next) => {
  modelGetEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReview = (req, res, next) => {
  modelGetReview(req.params.review_id).then((review) => {
    res.status(200).send({ review });
  }).catch((err) => {
    next(err);
  });
};
