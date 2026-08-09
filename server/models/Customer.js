const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      default: "",
      trim: true,
    },

    balance: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // COLLECTION SHIFT
    // ==========================

    shift: {
      type: [String],
      enum: ["Morning", "Evening"],
      default: ["Morning"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);