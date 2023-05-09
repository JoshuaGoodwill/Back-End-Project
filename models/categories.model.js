const db = require("../db/connection.js")

exports.modelGetCategories = () => {
return db.query(`SELECT * FROM categories;`)
.then((result) => {
return result.rows;
})
};