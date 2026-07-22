const PDFDocument = require("pdfkit");
const Collection = require("../models/Collection");
const createAuditLog = require("../utils/createAuditLog");

exports.downloadReceipt = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Receipt-${collection.accountNumber}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("Daily Collection Receipt", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(14);

    doc.text(`Receipt No : ${collection._id}`);

    doc.text(`Date : ${new Date(collection.createdAt).toLocaleString()}`);

    doc.text(`Customer : ${collection.customerName}`);

    doc.text(`Account No : ${collection.accountNumber}`);

    doc.text(`Collected Amount : ₹${collection.amount}`);

    doc.text(`Previous Balance : ₹${collection.previousBalance}`);

    doc.text(`Current Balance : ₹${collection.newBalance}`);

    doc.moveDown();

    doc.text(
      "Thank you for your payment.",
      {
        align: "center",
      }
    );

    // Audit Log
    await createAuditLog(
      req.user._id,
      "Receipt Generated",
      `Receipt generated for ${collection.customerName} (${collection.accountNumber}) - ₹${collection.amount}`,
      req.ip
    );

    doc.end();

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};