const {modelGetCategories} = require("../models/categories.model.js");


exports.getCategories = (req, res) => {
    modelGetCategories().then((categories) => {
        res.status(200).send({categories});
    })
}