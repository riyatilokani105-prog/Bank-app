const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    accountNumber: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    previousBalance: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currentBalance: {
      type: Number,
      required: true,
    },

    transactionType: {
      type: String,
      default: "Collection",
    },

    remarks: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ledger", ledgerSchema);