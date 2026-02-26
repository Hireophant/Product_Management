const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");

const chatMiddleware = require("../../middleware/client/chat.middleware");

router.get("/:roomChatId", chatMiddleware.isAccess, controller.index);
module.exports = router;
