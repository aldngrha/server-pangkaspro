const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  barberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Barber",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  value: {
    type: Number,
    min: 0,
    max: 5,
  },
});

module.exports = mongoose.model("Rating", RatingSchema);
