const express = require("express");
const router = express.Router();
const ItemsControl = require("../../controller/admin/related_item.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");
const { upload } = require("../../utils/cloudinaryConfig");

router.post("/add",ItemsControl.additem)
router.get("/all", ItemsControl.allCard);
router.get("/single/:id", ItemsControl.single);
router.put("/update/:id", ItemsControl.change);
router.delete("/delete/:id",ItemsControl.deleteitem);

module.exports = router;