const Customer = require("../models/Customer");
const Collection = require("../models/Collection");
const Ledger = require("../models/Ledger");
const createAuditLog = require("../utils/createAuditLog");

// =====================================================
// ADD SINGLE COLLECTION
// =====================================================

exports.addCollection = async (req, res) => {
  try {
    const {
      customerId,
      amount,
      session,
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
    // COLLECTION SESSION
    // ==========================

    let collectionSession = session;

    if (!collectionSession) {
      collectionSession = customerShifts[0];
    }

    // ==========================
    // VALIDATE SESSION
    // ==========================

    if (
      collectionSession !== "Morning" &&
      collectionSession !== "Evening"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid collection session.",
      });
    }

    // ==========================
    // CHECK CUSTOMER SHIFT
    // ==========================

    if (!customerShifts.includes(collectionSession)) {
      return res.status(400).json({
        success: false,
        message: `Customer is not assigned to ${collectionSession} shift.`,
      });
    }

    // =====================================================
    // IMPORTANT:
    // NO DAILY DUPLICATE CHECK
    //
    // Customer can now save multiple collections
    // on the same day and same shift.
    // =====================================================

    // ==========================
    // BALANCE
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
    // CREATE LEDGER
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

    try {
      await createAuditLog(
        req.user?._id || null,

        "Collection Added",

        `${customer.fullName} (${customer.accountNumber}) collected ₹${amount} - ${collectionSession}`,

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

      message: "Collection Added Successfully",

      collection,
    });

  } catch (err) {
    console.error(
      "ADD COLLECTION ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================================
// GET ALL COLLECTIONS
// =====================================================

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(
      "Collections Found:",
      collections.length
    );

    res.json({
      success: true,

      total: collections.length,

      collections,
    });

  } catch (err) {
    console.error(
      "GET COLLECTIONS ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================================
// GET CUSTOMER COLLECTION HISTORY
// =====================================================

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
    console.error(
      "GET CUSTOMER COLLECTIONS ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================================
// DELETE COLLECTION
// =====================================================

exports.deleteCollection = async (req, res) => {
  try {
    const collection =
      await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    const customer =
      await Customer.findById(
        collection.customer
      );

    if (customer) {
      customer.balance =
        Number(customer.balance || 0) -
        Number(collection.amount || 0);

      await customer.save();
    }

    await collection.deleteOne();

    // ==========================
    // AUDIT LOG
    // ==========================

    try {
      await createAuditLog(
        req.user?._id || null,

        "Collection Deleted",

        customer
          ? `${customer.fullName} (${customer.accountNumber}) deleted collection of ₹${collection.amount}`
          : `Collection deleted: ₹${collection.amount}`,

        req.ip
      );
    } catch (auditError) {
      console.log(
        "Audit Log Error:",
        auditError.message
      );
    }

    res.json({
      success: true,

      message: "Collection Deleted",
    });

  } catch (err) {
    console.error(
      "DELETE COLLECTION ERROR:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================================
// BULK COLLECTION
// =====================================================

exports.bulkCollection = async (req, res) => {
  try {
    console.log(
      "BULK COLLECTION REQUEST:"
    );

    console.log(req.body);

    const {
      collections,
    } = req.body;

    // ==========================
    // VALIDATION
    // ==========================

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

    const invalidShiftCustomers = [];

    // =====================================================
    // IMPORTANT:
    // NO TODAY'S DATE CHECK
    // NO DUPLICATE CHECK
    //
    // Multiple collections can now be saved
    // for the same customer on the same day.
    // =====================================================

    // ==========================
    // PROCESS EACH CUSTOMER
    // ==========================

    for (const item of collections) {
      console.log(
        "Processing:",
        item
      );

      // ==========================
      // CUSTOMER ID
      // ==========================

      if (!item.customerId) {
        console.log(
          "Skipped - customerId missing"
        );

        continue;
      }

      // ==========================
      // AMOUNT
      // ==========================

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
          customerId:
            customer._id,

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
          customerId:
            customer._id,

          accountNumber:
            customer.accountNumber,

          customerName:
            customer.fullName,

          message:
            `Customer is not assigned to ${collectionSession} shift.`,
        });

        continue;
      }

      // =====================================================
      // NO DUPLICATE CHECK HERE
      //
      // Every valid collection will be saved.
      // =====================================================

      // ==========================
      // BALANCE
      // ==========================

      const previousBalance =
        Number(
          customer.balance || 0
        );

      const newBalance =
        previousBalance +
        Number(item.amount);

      customer.balance =
        newBalance;

      await customer.save();

      // ==========================
      // CREATE COLLECTION
      // ==========================

      const collection =
        await Collection.create({
          customer:
            customer._id,

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
      // CREATE LEDGER
      // ==========================

      await Ledger.create({
        customer:
          customer._id,

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

      // ==========================
      // ADD TO SAVED LIST
      // ==========================

      savedCollections.push(
        collection
      );
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
      "BULK COLLECTION ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};