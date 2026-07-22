const AuditLog = require("../models/AuditLog");

const createAuditLog = async (
  admin,
  action,
  description,
  ipAddress = ""
) => {
  try {
    await AuditLog.create({
      admin: admin || null,
      action,
      description,
      ipAddress,
    });
  } catch (err) {
    console.log("Audit Log Error:", err.message);
  }
};

module.exports = createAuditLog;