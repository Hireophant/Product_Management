const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/setting.controller");
const multer = require("multer");
const uploadCloud = require("../../middleware/admin/uploadCloud.middleware");
const upload = multer();
router.get("/general", controller.general);
router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.updateGeneral,
);

module.exports = router;
