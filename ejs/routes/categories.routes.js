const express = require("express");
const router = express.Router();
const Category = require("../models/Categories");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("categories", {
      title: "Categories | De Origen | Coffee Shop",
      pageHeader: "Categories - EJS Version",
      categories,
    });
  }
  catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Issue. Check logs for details.");
  }
});

module.exports = router;