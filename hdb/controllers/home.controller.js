const db = require("../config/db");

exports.renderHome = (req, res) => {
  let sql = 'SELECT * FROM `table_products`';
  let query = db.query(sql, (err, products) => {
    if(err) throw err;
    res.render("home", {
      title: "De Origen | Coffee Shop",
      pageHeader: "De Origen | Coffee Shop - Handlebars Version",
      products: products
    });
  });
}