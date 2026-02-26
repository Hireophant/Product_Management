const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/rooms-chat.controller");

router.get("/", controller.roomsChat);
module.exports = router;
