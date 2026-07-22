const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {

checkBackup,

createBackup,

deleteMonthData,

backupHistory

}=require("../controllers/backupController");

router.get("/check",protect,checkBackup);

router.post("/create",protect,createBackup);

router.delete("/delete",protect,deleteMonthData);

router.get("/history",protect,backupHistory);

module.exports=router;