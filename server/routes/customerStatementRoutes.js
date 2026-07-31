const express = require("express");
const router = express.Router();

const {
  getCustomerStatement,
  downloadCustomerStatement,
} = require("../controllers/customerStatementController");

const auth = require("../middleware/auth");

router.get("/", auth, getCustomerStatement);

router.get("/pdf", auth, downloadCustomerStatement);

module.exports = router;