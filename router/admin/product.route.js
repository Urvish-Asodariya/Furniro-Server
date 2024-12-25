const express = require("express");
const router = express.Router();
const ProductControl = require("../../controller/admin/product.control");
const { upload } = require("../../utils/cloudinaryConfig");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.post("/add", upload.array("pics", 8), auth, isadmin, ProductControl.addProduct);
router.get("/all", auth, isadmin, ProductControl.allProduct);
router.get("/singleProduct/:id", auth, isadmin, ProductControl.singleProduct);
router.put("/change/:id", upload.array("pics", 8), auth, isadmin, ProductControl.updateProduct);
router.delete("/delete/:id", auth, isadmin, ProductControl.deleteProduct);

module.exports = router;
