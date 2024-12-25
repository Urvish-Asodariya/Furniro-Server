const express = require("express");
const router = express.Router();
const ItemsControl = require("../../controller/user/related_items.control");
const { upload } = require("../../utils/cloudinaryConfig");

router.get("/all", ItemsControl.allCard);
router.get("/single/:ItemId", ItemsControl.single);


module.exports = router;