const express = require("express");
const router = express.Router();
const CategoryControl = require("../../controller/admin/category.control");
// const { auth, isadmin } = require("../../middleware/auth.middleware");

router.post("/add",  CategoryControl.add);
router.get("/all", CategoryControl.all);
router.put("/update/:id", CategoryControl.update);
router.delete("/delete/:id",  CategoryControl.delete);

module.exports=router;