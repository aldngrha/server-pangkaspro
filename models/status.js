const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
  {
    kapsterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kapster",
    },
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
