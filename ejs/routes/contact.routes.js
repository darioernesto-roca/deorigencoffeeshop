const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("contact", {
    title: "Contact | De Origen | Coffee Shop",
    pageHeader: "Contact - EJS Version",
  });
});

module.exports = router;