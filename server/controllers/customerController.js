const Customer = require("../models/Customer");
const createAuditLog = require("../utils/createAuditLog");

// ==========================
// Add Customer
// ==========================
exports.addCustomer = async (req, res) => {
  try {
    const {
      accountNumber,
      fullName,
      address,
      balance,
      shift,
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================

    if (!accountNumber || !fullName) {
      return res.status(400).json({
        success: false,
        message:
          "Account Number and Full Name are required.",
      });
    }

    // ==========================
    // CHECK ACCOUNT NUMBER
    // ==========================

    const exists = await Customer.findOne({
      accountNumber,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message:
          "Account number already exists.",
      });
    }

    // ==========================
    // VALIDATE SHIFT
    // ==========================

    let customerShift = [];

if (Array.isArray(shift)) {
  customerShift = [
    ...new Set(
      shift.filter(
        (item) =>
          item === "Morning" ||
          item === "Evening"
      )
    ),
  ];
}

if (customerShift.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Please select at least one collection shift.",
  });
}

    // ==========================
    // CREATE CUSTOMER
    // ==========================

    // ==========================
// DEBUG SHIFT
// ==========================

console.log("========== ADD CUSTOMER ==========");
console.log("REQ.BODY:", req.body);
console.log("SHIFT FROM REQUEST:", shift);
console.log("CUSTOMER SHIFT TO SAVE:", customerShift);

// ==========================
// CREATE CUSTOMER
// ==========================

const customer = await Customer.create({
  accountNumber: accountNumber.trim(),
  fullName: fullName.trim(),
  balance: Number(balance) || 0,
  shift: customerShift,
});

console.log("SHIFT SAVED IN DATABASE:", customer.shift);
console.log("=================================");

    // ==========================
    // AUDIT LOG
    // ==========================

    if (req.user && req.user._id) {
      await createAuditLog(
        req.user._id,
        "Customer Added",
        `${customer.fullName} (${customer.accountNumber}) Added`,
        req.ip
      );
    }

    // ==========================
    // RESPONSE
    // ==========================

    return res.status(201).json({
      success: true,
      message: "Customer added successfully.",
      customer,
    });

  } catch (err) {
    console.error("ADD CUSTOMER ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// Get All Customers
// ==========================
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    // ==========================
    // HANDLE OLD CUSTOMERS
    // ==========================

    const formattedCustomers = customers.map(
      (customer) => {
        const customerObject =
          customer.toObject();

        if (
          !Array.isArray(customerObject.shift) ||
          customerObject.shift.length === 0
        ) {
          customerObject.shift = ["Morning"];
        }

        return customerObject;
      }
    );

    // ==========================
    // SORT BY ACCOUNT NUMBER
    // ==========================

    formattedCustomers.sort((a, b) => {
      return (
        Number(a.accountNumber) -
        Number(b.accountNumber)
      );
    });

    return res.json({
      success: true,
      total: formattedCustomers.length,
      customers: formattedCustomers,
    });
  } catch (err) {
    console.error("GET CUSTOMERS ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// Get Customer
// ==========================
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(
      req.params.id
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.json({
      success: true,
      customer,
    });
  } catch (err) {
    console.error("GET CUSTOMER ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// Update Customer
// ==========================
exports.updateCustomer = async (req, res) => {
  try {
    const customer =
      await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    if (req.user && req.user._id) {
      await createAuditLog(
        req.user._id,
        "Customer Updated",
        `${customer.fullName} (${customer.accountNumber}) Updated`,
        req.ip
      );
    }

    return res.json({
      success: true,
      message:
        "Customer updated successfully.",
      customer,
    });
  } catch (err) {
    console.error("UPDATE CUSTOMER ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// Delete Customer
// ==========================
exports.deleteCustomer = async (req, res) => {
  try {
    const customer =
      await Customer.findByIdAndDelete(
        req.params.id
      );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    if (req.user && req.user._id) {
      await createAuditLog(
        req.user._id,
        "Customer Deleted",
        `${customer.fullName} (${customer.accountNumber}) Deleted`,
        req.ip
      );
    }

    return res.json({
      success: true,
      message:
        "Customer deleted successfully.",
    });
  } catch (err) {
    console.error("DELETE CUSTOMER ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================
// Search Customers
// ==========================
exports.searchCustomers = async (req, res) => {
  try {
    const query = req.query.query || "";

    const customers = await Customer.find({
      $or: [
        {
          fullName: {
            $regex: query,
            $options: "i",
          },
        },
        {
          accountNumber: {
            $regex: query,
            $options: "i",
          },
        },
        {
          mobile: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });

    // ==========================
    // HANDLE OLD CUSTOMERS
    // ==========================

   

    // ==========================
    // SORT
    // ==========================

    formattedCustomers.sort((a, b) => {
      return (
        Number(a.accountNumber) -
        Number(b.accountNumber)
      );
    });

    return res.json({
      success: true,
      total: formattedCustomers.length,
      customers: formattedCustomers,
    });
  } catch (err) {
    console.error("SEARCH CUSTOMERS ERROR:");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};