const express = require("express");
const router = express.Router();
const ReportControl = require("../../controller/admin/report.control");
// const { auth, isadmin } = require("../../middleware/auth.middleware");

router.get("/sales", ReportControl.sales);
router.get("/inventory", ReportControl.inventory);
router.get("/user-report", ReportControl.userreport);
router.get("/productsell", ReportControl.productSells);
router.get("/categorysell", ReportControl.categorySells);
router.get("/last5month", ReportControl.last5monthrevenue);

module.exports = router;