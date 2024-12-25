const express = require("express");
const router = express.Router();
const UserControl = require("../../controller/admin/user.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.get("/all", auth, isadmin, UserControl.alluser);
router.get("/single/:id", auth, isadmin, UserControl.singleuser);
router.put("/update/:id", auth, isadmin, UserControl.updateuser);
router.delete("/delete/:id", auth, isadmin, UserControl.deleteuser);

module.exports = router;