const express = require("express");
const router = express.Router();
const CardControl = require("../../controller/admin/card.control");
const { upload } = require("../../utils/cloudinaryConfig");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.post("/add", upload.single("image"), auth, isadmin, CardControl.addCard);
router.get("/all", auth, isadmin, CardControl.allCard);
router.get("/single/:id", auth, isadmin, CardControl.singlecard);
router.put("/update/:id", auth, isadmin, CardControl.updateCard);
router.delete("/delete/:id", auth, isadmin, CardControl.deleteCard);

module.exports = router;