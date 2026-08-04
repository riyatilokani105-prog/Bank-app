const Customer = require("../models/Customer");
const Collection = require("../models/Collection");
const Ledger = require("../models/Ledger");
const createAuditLog = require("../utils/createAuditLog");

// Add Collection
exports.addCollection = async (req, res) => {
  try {
    const {
      customerId,
      amount,
      forceSave = false,
    } = req.body;

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

    // Today's Date
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

    // Duplicate Check
    const alreadyCollected = await Collection.findOne({
      customer: customer._id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (alreadyCollected && !forceSave) {
      return res.status(409).json({
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
  "Collection Deleted",
  `${customer.fullName} (${customer.accountNumber}) deleted collection of ₹${collection.amount}`,
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
console.log(req.body);
const { collections, forceSave = false } = req.body;
console.log("COLLECTIONS =>", collections);

    if (!Array.isArray(collections) || collections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No collection data received.",
      });
    }

    const savedCollections = [];
    const duplicateCustomers = [];

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

    for (const item of collections) {
      console.log("Processing:", item);

      if (!item.customerId) {
        console.log("Skipped - customerId missing");
        continue;
      }

      if (!item.amount || Number(item.amount) <= 0) {
        console.log("Skipped - invalid amount");
        continue;
      }

      const customer = await Customer.findById(item.customerId);

      if (!customer) {
        console.log("Customer not found:", item.customerId);
        continue;
      }

      // Duplicate Check
      const alreadyCollected = await Collection.findOne({
        customer: customer._id,
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });

      if (alreadyCollected && !forceSave) {
        duplicateCustomers.push({
          customerId: customer._id,
          accountNumber: customer.accountNumber,
          customerName: customer.fullName,
        });

        console.log("Duplicate Collection:", customer.fullName);
        continue;
      }

const previousBalance = Number(customer.balance ?? 0);
const newBalance = previousBalance + Number(item.amount);

customer.balance = newBalance;
await customer.save();

console.log("Previous Balance:", previousBalance);
console.log("New Balance:", newBalance);
      console.log("Customer Updated");
      console.log({
        customer: customer._id,
        accountNumber: customer.accountNumber,
        customerName: customer.fullName,
        amount: Number(item.amount),
        previousBalance,
        newBalance,
      });
      const collection = await Collection.create({

        
        customer: customer._id,
        accountNumber: customer.accountNumber,
        customerName: customer.fullName,
        amount: Number(item.amount),
        previousBalance,
        newBalance,
      });

      console.log("Collection Saved");

      await Ledger.create({
        customer: customer._id,
        accountNumber: customer.accountNumber,
        customerName: customer.fullName,
        previousBalance,
        amount: Number(item.amount),
        currentBalance: newBalance,
      });

      console.log("Ledger Saved");

      savedCollections.push(collection);
    }

    // Duplicate found
    if (duplicateCustomers.length > 0 && !forceSave) {
      return res.status(409).json({
        success: false,
        duplicates: duplicateCustomers,
        message: "Some customers already have collections for today.",
      });
    }

    try {
      await createAuditLog(
        req.user?._id || null,
        "Bulk Collection Added",
        `${savedCollections.length} collections added.`,
        req.ip
      );

      console.log("Audit Log Saved");
    } catch (auditError) {
      console.log("Audit Log Error:", auditError.message);
    }

    return res.status(201).json({
      success: true,
      message: `${savedCollections.length} collections saved successfully.`,
      totalCollections: savedCollections.length,
      collections: savedCollections,
    });

  } catch (err) {
    console.log("====================");
    console.log(err);
    console.log(err.stack);
    console.log("====================");

    res.status(500).json({
        success: false,
        message: err.message,
    });
}
};