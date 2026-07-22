const AuditLog = require("../models/AuditLog");

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("admin", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: logs.length,
      logs,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.deleteAuditLogs = async (req, res) => {
  try {

    await AuditLog.deleteMany();

    res.json({
      success: true,
      message: "Audit Logs Cleared",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};