const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payments: {
      type: {
        paymentMethod: {
          type: String,
          enum: ["Transfer", "Bayar ditempat"],
          required: true,
        },
        proofPayment: {
          type: String,
        },
        accountHolder: {
          type: String,
        },
        bankName: {
          type: String,
        },
      },
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "ongoing", "completed", "rejected", "pending approval"],
      default: "pending",
    },
    addOns: [
      {
        quantity: {
          type: Number,
        },
        isApproved: {
          type: String,
          enum: ["pending", "approve", "decline"],
          default: "pending", // Default value is false, indicating not approved
        },
        totalAddon: {
          type: Number,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
    },
    kapsterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kapster",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
