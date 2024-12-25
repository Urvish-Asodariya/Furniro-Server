const express = require("express");
const router = express.Router();
const ProductControl = require("../../controller/user/product.control");

router.get("/all", ProductControl.allProduct);
router.get("/singleProduct/:id", ProductControl.singleProduct);
router.get("/categories", ProductControl.listcategory);

module.exports = router;