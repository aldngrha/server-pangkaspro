const mongoose = require("mongoose");

let BarberSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Barber", BarberSchema);
