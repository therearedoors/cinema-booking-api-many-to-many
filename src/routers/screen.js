const express = require("express");
const controller = require('../controllers/screen');
const router = express.Router();

router.get("/:id", controller.getScreenById);

module.exports = router;
