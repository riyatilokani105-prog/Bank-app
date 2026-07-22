const XLSX = require("xlsx");
const Customer = require("../models/Customer");
const createAuditLog = require("../utils/createAuditLog");

// Import Customers
exports.importCustomers = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const data = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    let inserted = 0;

    for (const item of data) {

      const exists = await Customer.findOne({
        accountNumber: item.accountNumber,
      });

      if (exists) continue;

      await Customer.create({
        fullName: item.fullName,
        accountNumber: item.accountNumber,
        mobile: item.mobile,
        address: item.address,
        balance: item.balance || 0,
      });

      inserted++;
    }

    // Audit Log
    await createAuditLog(
      req.user._id,
      "Excel Import",
      `${inserted} customers imported from Excel`,
      req.ip
    );

    res.json({
      success: true,
      inserted,
      message: `${inserted} customers imported successfully.`,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Export Customers
exports.exportCustomers = async (req, res) => {

  try {

    const customers = await Customer.find();

    const worksheet = XLSX.utils.json_to_sheet(customers);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Customers"
    );

    const filePath = "uploads/customers.xlsx";

    XLSX.writeFile(workbook, filePath);

    // Audit Log
    await createAuditLog(
      req.user._id,
      "Excel Export",
      `${customers.length} customers exported to Excel`,
      req.ip
    );

    res.download(filePath);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};