const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addCollection,
  bulkCollection,
  getCollections,
  getCustomerCollections,
  deleteCollection,
} = require("../controllers/collectionController");



router.post("/", protect, addCollection);
router.post("/bulk", protect, bulkCollection);
router.get("/", protect, getCollections);

router.get("/customer/:id", protect, getCustomerCollections);

router.delete("/:id", protect, deleteCollection);

module.exports = router;