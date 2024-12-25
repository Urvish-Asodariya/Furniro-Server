const express = require("express");
const router = express.Router();
const AccountControl = require("../../controller/user/account.control");
// const { auth } = require("../../middleware/auth.middleware");

router.get("/profile", AccountControl.profile);
router.put("/update", AccountControl.update);
router.put("/changepass", AccountControl.changepassword);
router.put("/wallet",AccountControl.addWallet);

module.exports = router;