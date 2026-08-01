const Customer = require("../models/Customer");
const Collection = require("../models/Collection");
const PDFDocument = require("pdfkit");

// =========================================
// Get Customer Statement
// =========================================
exports.getCustomerStatement = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search is required",
      });
    }

    const customer = await Customer.findOne({
      $or: [
        { accountNumber: search },
        { fullName: { $regex: search, $options: "i" } },
      ],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const collections = await Collection.find({
      customer: customer._id,
    }).sort({ createdAt: 1 });

    let runningBalance = 0;

    const history = collections.map((item) => {
      runningBalance += Number(item.amount);

      return {
        _id: item._id,
        date: item.createdAt,
        amount: item.amount,
        runningBalance,
      };
    });

    return res.json({
      success: true,

      customer: {
        _id: customer._id,
        accountNumber: customer.accountNumber,
        fullName: customer.fullName,
        createdAt: customer.createdAt,

        openingBalance: Number(customer.balance || 0),

        currentBalance: Number(customer.balance || 0),
      },

      summary: {
        totalCollections: collections.length,
        totalAmount: runningBalance,
        currentBalance: Number(customer.balance || 0),
        lastCollection:
          collections.length > 0
            ? collections[collections.length - 1].createdAt
            : null,
      },

      history,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =========================================
// Download PDF
// =========================================
exports.downloadCustomerStatement = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    if (!search) {
      return res.status(400).json({
        success: false,
        message: "Search is required",
      });
    }

    const customer = await Customer.findOne({
      $or: [
        { accountNumber: search },
        { fullName: { $regex: search, $options: "i" } },
      ],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const collections = await Collection.find({
      customer: customer._id,
    }).sort({ createdAt: 1 });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Statement-${customer.accountNumber}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Customer Statement", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(13);
    doc.text(`Account Number : ${customer.accountNumber}`);
    doc.text(`Customer Name : ${customer.fullName}`);
    doc.text(`Current Balance : ₹${customer.balance}`);

    doc.moveDown();

    let total = 0;

    collections.forEach((item) => {
      total += item.amount;

      doc.text(
        `${new Date(item.createdAt).toLocaleDateString()}    ₹${item.amount}    Running Total : ₹${total}`
      );
    });

    doc.moveDown();

    doc.fontSize(15).text(`Total Collection : ₹${total}`);

    doc.end();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};