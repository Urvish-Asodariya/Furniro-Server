const express = require("express");
const router = express.Router();
const WishlistControl = require("../../controller/user/wishlist.control");

router.get("/userlist/:id", WishlistControl.userwishlist);
router.post("/addlist", WishlistControl.addlist);
router.delete("/deletelist/:id", WishlistControl.deletewishlist);

module.exports = router;