const {
  modelGetCategories,
  modelGetEndpoints,
} = require("../models/categories.model.js");

exports.getCategories = (req, res) => {
  modelGetCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getEndpoints = (req, res) => {
  modelGetEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch((err) => {
      next(err);
    });
};
