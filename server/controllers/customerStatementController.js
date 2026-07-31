const Customer = require("../models/Customer");
const Collection = require("../models/Collection");

// ================================
// Search Customer Statement
// ================================
exports.getCustomerStatement = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    // Search by Account Number or Name
    const customer = await Customer.findOne({
      $or: [
        { accountNumber: query },
        { fullName: { $regex: query, $options: "i" } },
      ],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    // Get all collections
    const collections = await Collection.find({
      customer: customer._id,
    }).sort({ createdAt: 1 });

    let runningBalance = 0;

    const history = collections.map((item) => {
      runningBalance += Number(item.amount || 0);

      return {
        _id: item._id,
        date: item.createdAt,
        amount: item.amount,
        runningBalance,
      };
    });

    res.json({
      success: true,

      customer: {
        _id: customer._id,
        accountNumber: customer.accountNumber,
        fullName: customer.fullName,
        createdAt: customer.createdAt,
        currentBalance: customer.balance,
      },

      summary: {
        totalCollections: collections.length,
        totalAmount: runningBalance,
        lastCollection:
          collections.length > 0
            ? collections[collections.length - 1].createdAt
            : null,
      },

      history,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};