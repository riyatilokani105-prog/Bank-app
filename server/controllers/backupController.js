const Backup = require("../models/Backup");
const Collection = require("../models/Collection");
const createAuditLog = require("../utils/createAuditLog");

// Check if Previous Month Backup is Needed
exports.checkBackup = async (req, res) => {

  try {

    const today = new Date();

    const previousMonth =
      today.getMonth() === 0 ? 12 : today.getMonth();

    const year =
      today.getMonth() === 0
        ? today.getFullYear() - 1
        : today.getFullYear();

    const count = await Collection.countDocuments({
      month: previousMonth,
      year,
    });

    res.json({
      success: true,
      needBackup: count > 0,
      totalRecords: count,
      month: previousMonth,
      year,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// Create Backup
exports.createBackup = async (req, res) => {

  try {

    const today = new Date();

    const previousMonth =
      today.getMonth() === 0 ? 12 : today.getMonth();

    const year =
      today.getMonth() === 0
        ? today.getFullYear() - 1
        : today.getFullYear();

    const collections = await Collection.find({
      month: previousMonth,
      year,
    });

    if (collections.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No previous month data.",
      });
    }

    const totalCollection = collections.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    await Backup.create({
      month: previousMonth,
      year,
      totalCollection,
      totalTransactions: collections.length,
      collections,
    });

    // Audit Log
    await createAuditLog(
      req.user._id,
      "Backup Created",
      `Backup created for Month ${previousMonth}/${year} (${collections.length} transactions)`,
      req.ip
    );

    res.json({
      success: true,
      message: "Backup Created.",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// Delete Previous Month Data
exports.deleteMonthData = async (req, res) => {

  try {

    const today = new Date();

    const previousMonth =
      today.getMonth() === 0 ? 12 : today.getMonth();

    const year =
      today.getMonth() === 0
        ? today.getFullYear() - 1
        : today.getFullYear();

    const deleted = await Collection.deleteMany({
      month: previousMonth,
      year,
    });

    // Audit Log
    await createAuditLog(
      req.user._id,
      "Backup Deleted",
      `${deleted.deletedCount} previous month collection records deleted`,
      req.ip
    );

    res.json({
      success: true,
      message: "Previous Month Deleted",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// Backup History
exports.backupHistory = async (req, res) => {

  try {

    const backups = await Backup
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      backups,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};