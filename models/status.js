const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
  {
    kapsterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kapster",
    },
    transactionId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
    status: {
      type: String,
      enum: ["available", "work", "unavailable"],
      default: "available",
      required: [true, "Status harus dipilih"],
    },
    time: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Status", StatusSchema);
