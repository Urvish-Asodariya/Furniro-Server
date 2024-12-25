const express=require("express");
const router = express.Router();
const AdminControl= require("../../controller/admin/admin.control");
const { auth } = require("../../middleware/auth.middleware");

router.post("/register", AdminControl.register);
router.post("/login", AdminControl.login);
router.patch("/changePass", auth, AdminControl.changePass);
router.put("/logout", auth, AdminControl.logout);

module.exports = router;