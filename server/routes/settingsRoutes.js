const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    updateTheme,
    updateSystemSettings,
} = require("../controllers/settingsController");

router.put("/theme", protect, updateTheme);

router.put("/system", protect, updateSystemSettings);

module.exports = router;