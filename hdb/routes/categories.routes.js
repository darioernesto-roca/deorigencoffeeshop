const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");

router.get("/", categoriesController.renderCategories);

module.exports = router;