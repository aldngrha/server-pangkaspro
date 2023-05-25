const mongoose = require("mongoose");
const Rating = require("./rating");

const BarberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama barber harus diisi"],
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    accountName: {
      type: String,
    },
    bank: {
      type: String,
    },
    accountNumber: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 0,
    },
    imageId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    kapsterId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Kapster",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Barber", BarberSchema);
