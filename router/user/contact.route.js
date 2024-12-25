const express = require("express");
const router = express.Router();
const ContactControl = require("../../controller/user/contact.control");
// const { auth } = require("../../middleware/auth.middleware");

router.post("/add", ContactControl.add);
router.get("/all", ContactControl.all);
router.get("/single", ContactControl.single);
router.delete("/delete", ContactControl.delete);

module.exports = router;