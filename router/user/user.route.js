const express = require("express");
const router = express.Router();
const Usercontrol = require("../../controller/user/user.control");
const { auth } = require("../../middleware/auth.middleware");
const { validateUser } = require("../../validators/user.validation");

router.post("/register", validateUser, Usercontrol.register);
router.post("/login", Usercontrol.login);
router.get("/forgetPass", auth, validateUser, Usercontrol.ForgetPass);
router.post("/resetpass", Usercontrol.resetPass);
router.patch("/reset/:email", validateUser, Usercontrol.newpass);
router.post("/logout", Usercontrol.logout);

module.exports = router;