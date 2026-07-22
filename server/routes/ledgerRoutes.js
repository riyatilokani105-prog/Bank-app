const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getLedger,
  getCustomerLedger,
  deleteLedger,
} = require("../controllers/ledgerController");

router.get("/", protect, getLedger);

router.get("/customer/:id", protect, getCustomerLedger);

router.delete("/:id", protect, deleteLedger);

module.exports = router;