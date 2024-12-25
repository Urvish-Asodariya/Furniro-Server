const express = require("express");
const router = express.Router();
const Ordercontrol = require("../../controller/user/order.control");
// const { auth } = require("../middleware/auth.middleware");
// const { validateOrder } = require("../validators/order.validation");

router.post("/create/:cartId", Ordercontrol.createorder);
router.get("/single/:Id", Ordercontrol.singleorder);
router.put("/update/:Id", Ordercontrol.updateorder);
router.delete("/delete/:Id", Ordercontrol.deleteorder);

module.exports = router; 