const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getReports,
  getReportSummary,
  todayReport,
  monthReport,
  yearReport,
  customerReport,
  dateRangeReport,
  exportPDF,
  exportExcel,
} = require("../controllers/reportController");

// Dashboard Reports
router.get("/", protect, getReports);

router.get("/summary", protect, getReportSummary);


// Existing Reports
router.get("/today", protect, todayReport);

router.get("/month", protect, monthReport);

router.get("/year", protect, yearReport);

router.get("/customer/:id", protect, customerReport);

router.get("/range", protect, dateRangeReport);


// Export
router.get("/pdf", protect, exportPDF);

router.get("/excel", protect, exportExcel);


module.exports = router;