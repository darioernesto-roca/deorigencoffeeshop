const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about-us", {
    title: "About Us | De Origen | Coffee Shop",
    pageHeader: "About Us - EJS Version",
  });
});

module.exports = router;