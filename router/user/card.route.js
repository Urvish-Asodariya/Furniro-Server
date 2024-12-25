const express = require("express");
const router = express.Router();
const CardControl = require("../../controller/user/card.control");

router.get("/all", CardControl.allCard);
router.get("/productcard",CardControl.allProductCard);
router.get("/relatedproduct",CardControl.relatedproduct);

module.exports = router;