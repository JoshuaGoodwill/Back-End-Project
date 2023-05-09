const db = require("../db/connection.js")
const fs = require("fs/promises");

exports.modelGetCategories = () => {
return db.query(`SELECT * FROM categories;`)
.then((result) => {
return result.rows;
})
};

exports.modelGetEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((readFileResult) => {
        return JSON.parse(readFileResult);
    })
}