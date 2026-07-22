const Customer = require("../models/Customer");
const Collection = require("../models/Collection");

exports.dashboardStats = async (req, res) => {
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

    const [
      totalCustomers,
      todayCollection,
      monthCollection,
      balance,
    ] = await Promise.all([

      Customer.countDocuments(),

      Collection.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startToday,
              $lt: endToday,
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
      ]),

      Collection.aggregate([
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
      ]),

      Customer.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$balance",
            },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalCustomers,

        todayCollection:
          todayCollection[0]?.total || 0,

        monthCollection:
          monthCollection[0]?.total || 0,

        pendingBalance:
          balance[0]?.total || 0,
      },
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};