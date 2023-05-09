const express = require("express");
const { getCategories } = require("./controllers/categories.controller");
const app = express();

app.get("/api/categories", getCategories);

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