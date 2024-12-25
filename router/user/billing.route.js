const express = require("express");
const router = express.Router();
const BillingControl = require("../../controller/user/billing.control");
// const { auth } = require("../middleware/auth.middleware");

router.post("/payment/:Id", BillingControl.paybill);
router.get("/orderitems/:id", BillingControl.orderitems);
router.get("/status/:orderId", BillingControl.orderstatus);

module.exports = router;