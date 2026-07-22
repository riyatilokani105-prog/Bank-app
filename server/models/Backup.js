const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema(
  {
    month: Number,

    year: Number,

    totalCollection: Number,

    totalTransactions: Number,

    collections: [],

    backupDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Backup", backupSchema);