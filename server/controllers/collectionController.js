const Customer = require("../models/Customer");
const Collection = require("../models/Collection");
const Ledger = require("../models/Ledger");
const createAuditLog = require("../utils/createAuditLog");

// Add Collection
// ==========================
// Add Collection
// ==========================
exports.addCollection = async (req, res) => {
  try {
    const {
      customerId,
      amount,
      session,
      forceSave = false,
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================

    if (!customerId || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection data.",
      });
    }

    // ==========================
    // GET CUSTOMER
    // ==========================

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // ==========================
    // CUSTOMER SHIFT
    // ==========================

    const customerShifts = Array.isArray(customer.shift)
      ? customer.shift
      : customer.shift
      ? [customer.shift]
      : ["Morning"];

    // ==========================
    // VALIDATE SESSION
    // ==========================

    let collectionSession = session;

    // If frontend didn't send session
    // use customer's first assigned shift
    if (!collectionSession) {
      collectionSession = customerShifts[0];
    }

    // Only Morning / Evening allowed
    if (
      collectionSession !== "Morning" &&
      collectionSession !== "Evening"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection session.",
      });
    }

    // Customer must be assigned to this shift
    if (!customerShifts.includes(collectionSession)) {
      return res.status(400).json({
        success: false,
        message: `Customer is not assigned to ${collectionSession} shift.`,
      });
    }

    // ==========================
    // TODAY'S DATE
    // ==========================

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

    // ==========================
    // DUPLICATE CHECK
    // ==========================

    const alreadyCollected = await Collection.findOne({
      customer: customer._id,
      session: collectionSession,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (alreadyCollected && !forceSave) {
      return res.status(409).json({
        success: false,
        message: `Collection for this account has already been added today for ${collectionSession} shift.`,
      });
    }

    // ==========================
    // UPDATE BALANCE
    // ==========================

    const previousBalance = Number(customer.balance || 0);

    const newBalance =
      previousBalance + Number(amount);

    customer.balance = newBalance;

    await customer.save();

    // ==========================
    // CREATE COLLECTION
    // ==========================

    const collection = await Collection.create({
      customer: customer._id,

      accountNumber: customer.accountNumber,

      customerName: customer.fullName,

      amount: Number(amount),

      previousBalance,

      newBalance,

      session: collectionSession,
    });

    // ==========================
    // LEDGER
    // ==========================

    await Ledger.create({
      customer: customer._id,

      accountNumber: customer.accountNumber,

      customerName: customer.fullName,

      previousBalance,

      amount: Number(amount),

      currentBalance: newBalance,
    });

    // ==========================
    // AUDIT LOG
    // ==========================

    await createAuditLog(
      req.user?._id || null,
      "Collection Added",
      `${customer.fullName} (${customer.accountNumber}) collected ₹${amount} - ${collectionSession}`,
      req.ip
    );

    // ==========================
    // RESPONSE
    // ==========================

    return res.status(201).json({
      success: true,

      message: "Collection Added Successfully",

      collection,
    });
  } catch (err) {
    console.error("ADD COLLECTION ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get All Collections
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find()

.sort({

    createdAt: -1,

})

.lean();

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
// ==========================
// Bulk Collection
// ==========================
exports.bulkCollection = async (req, res) => {
  try {
    console.log("BULK COLLECTION REQUEST:");
    console.log(req.body);

    const {
      collections,
      forceSave = false,
    } = req.body;

    if (
      !Array.isArray(collections) ||
      collections.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No collection data received.",
      });
    }

    const savedCollections = [];
    const duplicateCustomers = [];
    const invalidShiftCustomers = [];

    // ==========================
    // TODAY'S DATE
    // ==========================

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

    // ==========================
    // PROCESS EACH CUSTOMER
    // ==========================

    for (const item of collections) {
      console.log("Processing:", item);

      if (!item.customerId) {
        console.log(
          "Skipped - customerId missing"
        );
        continue;
      }

      if (
        !item.amount ||
        Number(item.amount) <= 0
      ) {
        console.log(
          "Skipped - invalid amount"
        );
        continue;
      }

      // ==========================
      // GET CUSTOMER
      // ==========================

      const customer =
        await Customer.findById(
          item.customerId
        );

      if (!customer) {
        console.log(
          "Customer not found:",
          item.customerId
        );
        continue;
      }

      // ==========================
      // CUSTOMER SHIFT
      // ==========================

      const customerShifts =
        Array.isArray(customer.shift)
          ? customer.shift
          : customer.shift
          ? [customer.shift]
          : ["Morning"];

      // ==========================
      // COLLECTION SESSION
      // ==========================

      const collectionSession =
        item.session ||
        customerShifts[0];

      // ==========================
      // VALIDATE SESSION
      // ==========================

      if (
        collectionSession !== "Morning" &&
        collectionSession !== "Evening"
      ) {
        invalidShiftCustomers.push({
          customerId: customer._id,
          accountNumber:
            customer.accountNumber,
          customerName:
            customer.fullName,
          message:
            "Invalid collection shift.",
        });

        continue;
      }

      // ==========================
      // CHECK CUSTOMER SHIFT
      // ==========================

      if (
        !customerShifts.includes(
          collectionSession
        )
      ) {
        invalidShiftCustomers.push({
          customerId: customer._id,
          accountNumber:
            customer.accountNumber,
          customerName:
            customer.fullName,
          message: `Customer is not assigned to ${collectionSession} shift.`,
        });

        continue;
      }

      // ==========================
      // DUPLICATE CHECK
      // ==========================

      const alreadyCollected =
        await Collection.findOne({
          customer: customer._id,

          session: collectionSession,

          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

      if (
        alreadyCollected &&
        !forceSave
      ) {
        duplicateCustomers.push({
          customerId: customer._id,

          accountNumber:
            customer.accountNumber,

          customerName:
            customer.fullName,

          session:
            collectionSession,
        });

        continue;
      }

      // ==========================
      // BALANCE
      // ==========================

      const previousBalance =
        Number(customer.balance || 0);

      const newBalance =
        previousBalance +
        Number(item.amount);

      customer.balance = newBalance;

      await customer.save();

      // ==========================
      // CREATE COLLECTION
      // ==========================

      const collection =
        await Collection.create({
          customer: customer._id,

          accountNumber:
            customer.accountNumber,

          customerName:
            customer.fullName,

          amount:
            Number(item.amount),

          previousBalance,

          newBalance,

          session:
            collectionSession,
        });

      // ==========================
      // LEDGER
      // ==========================

      await Ledger.create({
        customer: customer._id,

        accountNumber:
          customer.accountNumber,

        customerName:
          customer.fullName,

        previousBalance,

        amount:
          Number(item.amount),

        currentBalance:
          newBalance,
      });

      savedCollections.push(
        collection
      );
    }

    // ==========================
    // DUPLICATES
    // ==========================

    if (
      duplicateCustomers.length > 0 &&
      !forceSave
    ) {
      return res.status(409).json({
        success: false,

        duplicates:
          duplicateCustomers,

        invalidShiftCustomers,

        savedCollections,

        message:
          "Some customers already have collections for today.",
      });
    }

    // ==========================
    // INVALID SHIFT
    // ==========================

    if (
      invalidShiftCustomers.length > 0 &&
      savedCollections.length === 0
    ) {
      return res.status(400).json({
        success: false,

        invalidShiftCustomers,

        message:
          "Some customers are not assigned to the selected collection shift.",
      });
    }

    // ==========================
    // AUDIT LOG
    // ==========================

    try {
      await createAuditLog(
        req.user?._id || null,

        "Bulk Collection Added",

        `${savedCollections.length} collections added.`,

        req.ip
      );
    } catch (auditError) {
      console.log(
        "Audit Log Error:",
        auditError.message
      );
    }

    // ==========================
    // RESPONSE
    // ==========================

    return res.status(201).json({
      success: true,

      message:
        `${savedCollections.length} collections saved successfully.`,

      totalCollections:
        savedCollections.length,

      collections:
        savedCollections,

      invalidShiftCustomers,
    });
  } catch (err) {
    console.error(
      "BULK COLLECTION ERROR:"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};// ==========================
// Bulk Collection
// ==========================
exports.bulkCollection = async (req, res) => {
  try {
    console.log("BULK COLLECTION REQUEST:");
    console.log(req.body);

    const {
      collections,
      forceSave = false,
    } = req.body;

    if (
      !Array.isArray(collections) ||
      collections.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "No collection data received.",
      });
    }

    const savedCollections = [];
    const duplicateCustomers = [];
    const invalidShiftCustomers = [];

    // ==========================
    // TODAY'S DATE
    // ==========================

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

    // ==========================
    // PROCESS EACH CUSTOMER
    // ==========================

    for (const item of collections) {
      console.log("Processing:", item);

      if (!item.customerId) {
        console.log(
          "Skipped - customerId missing"
        );
        continue;
      }

      if (
        !item.amount ||
        Number(item.amount) <= 0
      ) {
        console.log(
          "Skipped - invalid amount"
        );
        continue;
      }

      // ==========================
      // GET CUSTOMER
      // ==========================

      const customer =
        await Customer.findById(
          item.customerId
        );

      if (!customer) {
        console.log(
          "Customer not found:",
          item.customerId
        );
        continue;
      }

      // ==========================
      // CUSTOMER SHIFT
      // ==========================

      const customerShifts =
        Array.isArray(customer.shift)
          ? customer.shift
          : customer.shift
          ? [customer.shift]
          : ["Morning"];

      // ==========================
      // COLLECTION SESSION
      // ==========================

      const collectionSession =
        item.session ||
        customerShifts[0];

      // ==========================
      // VALIDATE SESSION
      // ==========================

      if (
        collectionSession !== "Morning" &&
        collectionSession !== "Evening"
      ) {
        invalidShiftCustomers.push({
          customerId: customer._id,
          accountNumber:
            customer.accountNumber,
          customerName:
            customer.fullName,
          message:
            "Invalid collection shift.",
        });

        continue;
      }

      // ==========================
      // CHECK CUSTOMER SHIFT
      // ==========================

      if (
        !customerShifts.includes(
          collectionSession
        )
      ) {
        invalidShiftCustomers.push({
          customerId: customer._id,
          accountNumber:
            customer.accountNumber,
          customerName:
            customer.fullName,
          message: `Customer is not assigned to ${collectionSession} shift.`,
        });

        continue;
      }

      // ==========================
      // DUPLICATE CHECK
      // ==========================

      const alreadyCollected =
        await Collection.findOne({
          customer: customer._id,

          session: collectionSession,

          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        });

      if (
        alreadyCollected &&
        !forceSave
      ) {
        duplicateCustomers.push({
          customerId: customer._id,

          accountNumber:
            customer.accountNumber,

          customerName:
            customer.fullName,

          session:
            collectionSession,
        });

        continue;
      }

      // ==========================
      // BALANCE
      // ==========================

      const previousBalance =
        Number(customer.balance || 0);

      const newBalance =
        previousBalance +
        Number(item.amount);

      customer.balance = newBalance;

      await customer.save();

      // ==========================
      // CREATE COLLECTION
      // ==========================

      const collection =
        await Collection.create({
          customer: customer._id,

          accountNumber:
            customer.accountNumber,

          customerName:
            customer.fullName,

          amount:
            Number(item.amount),

          previousBalance,

          newBalance,

          session:
            collectionSession,
        });

      // ==========================
      // LEDGER
      // ==========================

      await Ledger.create({
        customer: customer._id,

        accountNumber:
          customer.accountNumber,

        customerName:
          customer.fullName,

        previousBalance,

        amount:
          Number(item.amount),

        currentBalance:
          newBalance,
      });

      savedCollections.push(
        collection
      );
    }

    // ==========================
    // DUPLICATES
    // ==========================

    if (
      duplicateCustomers.length > 0 &&
      !forceSave
    ) {
      return res.status(409).json({
        success: false,

        duplicates:
          duplicateCustomers,

        invalidShiftCustomers,

        savedCollections,

        message:
          "Some customers already have collections for today.",
      });
    }

    // ==========================
    // INVALID SHIFT
    // ==========================

    if (
      invalidShiftCustomers.length > 0 &&
      savedCollections.length === 0
    ) {
      return res.status(400).json({
        success: false,

        invalidShiftCustomers,

        message:
          "Some customers are not assigned to the selected collection shift.",
      });
    }

    // ==========================
    // AUDIT LOG
    // ==========================

    try {
      await createAuditLog(
        req.user?._id || null,

        "Bulk Collection Added",

        `${savedCollections.length} collections added.`,

        req.ip
      );
    } catch (auditError) {
      console.log(
        "Audit Log Error:",
        auditError.message
      );
    }

    // ==========================
    // RESPONSE
    // ==========================

    return res.status(201).json({
      success: true,

      message:
        `${savedCollections.length} collections saved successfully.`,

      totalCollections:
        savedCollections.length,

      collections:
        savedCollections,

      invalidShiftCustomers,
    });
  } catch (err) {
    console.error(
      "BULK COLLECTION ERROR:"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};