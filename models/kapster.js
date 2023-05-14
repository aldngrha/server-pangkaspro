const mongoose = require("mongoose");

const KapsterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama barber harus diisi"],
    },
    imageUrl: {
      type: String,
      required: [true, "Foto harus diisi"],
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kapster", KapsterSchema);
