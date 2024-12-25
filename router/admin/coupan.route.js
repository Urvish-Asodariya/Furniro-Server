const express = require("express");
const router = express.Router();
const CoupanControl = require("../../controller/admin/coupan.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.post("/add", CoupanControl.add);
router.get("/all", CoupanControl.allcoupan);
router.get("/single/:id", CoupanControl.singlecoupan);
router.put("/update/:id", CoupanControl.updatecoupan);
router.delete("/delete/:id", CoupanControl.deletecoupan);

module.exports = router;