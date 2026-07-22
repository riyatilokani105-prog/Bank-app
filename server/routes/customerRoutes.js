const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
} = require("../controllers/customerController");

router.post("/", protect, addCustomer);

router.get("/", protect, getCustomers);
router.get("/search", protect, searchCustomers); // Move this above

router.get("/:id", protect, getCustomer);
router.put("/:id", protect, updateCustomer);
router.delete("/:id", protect, deleteCustomer);

module.exports = router;