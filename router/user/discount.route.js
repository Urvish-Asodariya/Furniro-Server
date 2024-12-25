const express = require("express");
const router = express.Router();
const DiscountControl = require("../../controller/user/discount.control");
const { auth } = require("../../middleware/auth.middleware");

router.get("/coupans", auth, DiscountControl.alldiscount);
router.post("/apply", auth, DiscountControl.applydiscount);

module.exports = router;