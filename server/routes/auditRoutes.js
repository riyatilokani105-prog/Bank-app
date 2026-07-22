const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getAuditLogs,
  deleteAuditLogs,
} = require("../controllers/auditController");

router.get("/", protect, getAuditLogs);

router.delete("/", protect, deleteAuditLogs);

module.exports = router;