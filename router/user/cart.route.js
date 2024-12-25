const express = require("express");
const router = express.Router();
const CartControl = require("../../controller/user/cart.control");
// const { auth } = require("../middleware/auth.middleware");
// const { validateCart } = require("../validators/cart.validation");

router.post("/add/:Id", CartControl.addcart);
router.get("/all", CartControl.allcarts);
router.get("/single/:Id", CartControl.singleUserCart);
router.patch("/update/:Id", CartControl.updatecart);
router.delete("/delete/:Id", CartControl.deletecart);
router.get("/totalamount/:Id", CartControl.totalamount);

module.exports = router;