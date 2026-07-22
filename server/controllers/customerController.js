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
      mobile,
      address,
      balance,
    } = req.body;

    if (!accountNumber || !fullName || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Account Number, Full Name and Mobile are required.",
      });
    }

    const exists = await Customer.findOne({ accountNumber });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Account number already exists.",
      });
    }

    const customer = await Customer.create({
      accountNumber,
      fullName,
      mobile,
      address: address || "",
      balance: Number(balance) || 0,
    });

    // Create Audit Log only if authenticated user exists
    if (req.user && req.user._id) {
      await createAuditLog(
        req.user._id,
        "Customer Added",
        `${customer.fullName} (${customer.accountNumber}) Added`,
        req.ip
      );
    }

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

    const customers = await Customer.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      total: customers.length,
      customers,
    });

  } catch (err) {

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

    const customer = await Customer.findById(req.params.id);

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

    const customer = await Customer.findByIdAndUpdate(
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
      message: "Customer updated successfully.",
      customer,
    });

  } catch (err) {

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

    const customer = await Customer.findByIdAndDelete(req.params.id);

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
      message: "Customer deleted successfully.",
    });

  } catch (err) {

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

    return res.json({
      success: true,
      total: customers.length,
      customers,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};