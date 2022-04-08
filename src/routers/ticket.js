const express = require("express");
const controller = require('../controllers/ticket');
const router = express.Router();

router.post("/create", controller.createTicket);

module.exports = router;
