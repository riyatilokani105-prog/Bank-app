const express = require("express");
const router = express.Router();

const {
  getCustomerStatement,
  downloadCustomerStatement,
} = require("../controllers/customerStatementController");

router.get("/", getCustomerStatement);
router.get("/pdf", downloadCustomerStatement);

module.exports = router;