const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
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

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    previousBalance: {
      type: Number,
      required: true,
    },

    newBalance: {
      type: Number,
      required: true,
    },

    collectedBy: {
      type: String,
      default: "Admin",
    },

    date: {
      type: Date,
      default: Date.now,
    },

    month: {
      type: Number,
      default: () => new Date().getMonth() + 1,
    },

    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Collection", collectionSchema);