const {
  modelGetCategories,
  modelGetEndpoints,
  modelGetReview,
  modelGetReviews,
  modelGetComments,
  modelPostComment,
  modelPatchReview,
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
  modelGetReview(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  modelPatchReview(req.params.review_id, req.body.inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  modelGetReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getComments = (req, res, next) => {
  modelGetComments(req.params.review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const review_id = req.params.review_id;
  const { username, body } = req.body;
  modelPostComment(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
