const express = require("express");
const router = express.Router();
const NotificationController = require("../../controller/user/notification.control");

router.get("/list", NotificationController.list);
router.put("/mark-read", NotificationController.read_notifications);

module.exports = router;