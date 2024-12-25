const express=require("express");
const router=express.Router();
const RatingController = require("../../controller/user/userratings.control");

router.post("/add/:productId",RatingController.addratings);
router.get("/single/:productId",RatingController.productratings);
router.put("/change/:id",RatingController.changerating);
router.delete("/delete/:id",RatingController.deleteratings);

module.exports = router;