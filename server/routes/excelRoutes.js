const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");

const {
  importCustomers,
  exportCustomers,
} = require("../controllers/excelController");

router.post(
  "/import",
  protect,
  upload.single("file"),
  importCustomers
);

router.get(
  "/export",
  protect,
  exportCustomers
);

module.exports = router;