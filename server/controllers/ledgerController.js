const Ledger = require("../models/Ledger");

exports.getLedger = async (req, res) => {
  try {
    const ledger = await Ledger.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: ledger.length,
      ledger,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getCustomerLedger = async (req, res) => {
  try {
    const ledger = await Ledger.find({
      customer: req.params.id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      ledger,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteLedger = async (req, res) => {
  try {
    const ledger = await Ledger.findById(req.params.id);

    if (!ledger) {
      return res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
    }

    await ledger.deleteOne();

    res.json({
      success: true,
      message: "Ledger deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};