const express = require("express");
const { getCategories, getEndpoints, getReview } = require("./controllers/categories.controller");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api", getEndpoints);

app.get("/api/review/:review_id", getReview);

app.use((err,req, res, next) => {
    if(err.code === "22P02" || err.code === "22003") {
        res.status(400).send({msg: "Invalid review_id"});
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err)
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Server error!'})
})

module.exports = app;