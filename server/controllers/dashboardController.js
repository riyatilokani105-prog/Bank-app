const Customer = require("../models/Customer");
const Collection = require("../models/Collection");

// ==========================================
// Dashboard Statistics
// ==========================================
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();

    const startToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const endToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const startMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const endMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );

    // Total Customers
    const totalCustomers = await Customer.countDocuments();

    // Today's Collections
    const todayCollections = await Collection.find({
      createdAt: {
        $gte: startToday,
        $lt: endToday,
      },
    });

    const todayCollection = todayCollections.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    // Today's Unique Customers
    const todayCustomers = new Set(
      todayCollections.map((item) => item.customer.toString())
    ).size;

    // Monthly Collection
    const monthCollectionData = await Collection.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startMonth,
            $lt: endMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    // Pending Balance
    const balanceData = await Customer.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$balance",
          },
        },
      },
    ]);

    res.json({
      success: true,

      dashboard: {
        totalCustomers,

        todayCustomers,

        todayCollection,

        monthCollection:
          monthCollectionData[0]?.total || 0,

        pendingBalance:
          balanceData[0]?.total || 0,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Recent Collections
// ==========================================
exports.recentCollections = async (req, res) => {

  try {

    const collections = await Collection.find()
      .sort({ createdAt: -1 })
      .limit(10);

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

// ==========================================
// Top Customers
// ==========================================
exports.topCustomers = async (req, res) => {

  try {

    const customers = await Customer.find()
      .sort({ balance: -1 })
      .limit(10);

    res.json({
      success: true,
      customers,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};