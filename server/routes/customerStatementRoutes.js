const express = require("express");

const router = express.Router();

const {
  getCustomerStatement,
} = require("../controllers/customerStatementController");

router.get("/", getCustomerStatement);

module.exports = router;