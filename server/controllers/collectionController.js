const Customer = require("../models/Customer");
const Collection = require("../models/Collection");
const Ledger = require("../models/Ledger");
const createAuditLog = require("../utils/createAuditLog");

// Add Collection
exports.addCollection = async (req, res) => {
  try {
    const { customerId, amount } = req.body;

    if (!customerId || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection data.",
      });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Check duplicate collection for today
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
      0
    );

    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    const alreadyCollected = await Collection.findOne({
      customer: customer._id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (alreadyCollected) {
      return res.status(400).json({
        success: false,
        message:
          "Collection for this account has already been added today.",
      });
    }

    const previousBalance = customer.balance;
    const newBalance = previousBalance + Number(amount);

    customer.balance = newBalance;

    await customer.save();

    const collection = await Collection.create({
      customer: customer._id,
      accountNumber: customer.accountNumber,
      customerName: customer.fullName,
      amount: Number(amount),
      previousBalance,
      newBalance,
    });

    await Ledger.create({
      customer: customer._id,
      accountNumber: customer.accountNumber,
      customerName: customer.fullName,
      previousBalance,
      amount: Number(amount),
      currentBalance: newBalance,
    });

    await createAuditLog(
      req.user?._id || null,
      "Collection Added",
      `${customer.fullName} (${customer.accountNumber}) collected ₹${amount}`,
      req.ip
    );

    res.status(201).json({
      success: true,
      message: "Collection Added Successfully",
      collection,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// Get All Collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find();

    console.log("Collections Found:", collections.length);
    console.log(collections);

    res.json({
      success: true,
      total: collections.length,
      collections,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Customer Collection History
exports.getCustomerCollections = async (req, res) => {

  try {

    const collections = await Collection.find({
      customer: req.params.id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      collections,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// Delete Collection
exports.deleteCollection = async (req, res) => {

  try {

    const collection = await Collection.findById(req.params.id);

    if (!collection) {

      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });

    }

    const customer = await Customer.findById(collection.customer);

    if (customer) {

      customer.balance -= collection.amount;

      await customer.save();

    }

    await collection.deleteOne();

    // Audit Log
    await createAuditLog(
  req.user?._id || null,
  "Collection Added",
  `${customer.fullName} (${customer.accountNumber}) collected ₹${amount}`,
  req.ip
);
    res.json({
      success: true,
      message: "Collection Deleted",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// Bulk Collection
exports.bulkCollection = async (req, res) => {

  try {

    const collections = req.body;

    if (!Array.isArray(collections) || collections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No collection data received.",
      });
    }

    const savedCollections = [];

    for (const item of collections) {

      const { customerId, amount } = item;

      if (!customerId || !amount || Number(amount) <= 0) {
        continue;
      }

      const customer = await Customer.findById(customerId);

      if (!customer) continue;

      const previousBalance = customer.balance;
      const newBalance = previousBalance + Number(amount);

      customer.balance = newBalance;

      await customer.save();

      const collection = await Collection.create({
        customer: customer._id,
        accountNumber: customer.accountNumber,
        customerName: customer.fullName,
        amount,
        previousBalance,
        newBalance,
      });

      await Ledger.create({
        customer: customer._id,
        accountNumber: customer.accountNumber,
        customerName: customer.fullName,
        previousBalance,
        amount,
        currentBalance: newBalance,
      });

      savedCollections.push(collection);
    }

    // Audit Log
    await createAuditLog(
  req.user?._id || null,
  "Collection Added",
  `${customer.fullName} (${customer.accountNumber}) collected ₹${amount}`,
  req.ip
);
    res.status(201).json({
      success: true,
      message: "Bulk Collection Saved Successfully",
      totalCollections: savedCollections.length,
      collections: savedCollections,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};