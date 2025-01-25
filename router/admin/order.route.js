const express = require("express");
const router = express.Router();
const Ordercontrol = require("../../controller/admin/order.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.get("/all",  Ordercontrol.allorder);
router.get("/single/:id",  Ordercontrol.singleorder);
router.put("/update/:id",  Ordercontrol.updateorder);
router.delete("/cancel/:id",  Ordercontrol.cancelorder);
router.get("/ordersell",  Ordercontrol.ordersells);
router.get("/orderreport",  Ordercontrol.orderreport);

module.exports = router; 