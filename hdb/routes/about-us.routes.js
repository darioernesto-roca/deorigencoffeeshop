const express = require("express");
const router = express.Router();
const aboutUsController = require("../controllers/aboutUs.controller");

router.get("/", aboutUsController.aboutUsController);

module.exports = router;