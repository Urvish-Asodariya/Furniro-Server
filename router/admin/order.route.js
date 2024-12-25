const express = require("express");
const router = express.Router();
const Ordercontrol = require("../../controller/admin/order.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.get("/all", auth, isadmin, Ordercontrol.allorder);
router.get("/single/:id", auth, isadmin, Ordercontrol.singleorder);
router.put("/update/:id", auth, isadmin, Ordercontrol.updateorder);
router.delete("/cancle/:id", auth, isadmin, Ordercontrol.cancelorder);

module.exports = router; 