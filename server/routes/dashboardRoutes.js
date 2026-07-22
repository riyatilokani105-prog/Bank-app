const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

getDashboard,
recentCollections,
topCustomers

} = require("../controllers/dashboardController");

router.get("/",protect,getDashboard);

router.get("/recentCollections",protect,recentCollections);

router.get("/topCustomers",protect,topCustomers);

module.exports = router;