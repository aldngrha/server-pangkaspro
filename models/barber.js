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

BarberSchema.methods.calculateAvgRating = async function () {
  const ratingDocs = await Rating.find({ barberId: this._id });
  const ratingValues = ratingDocs.map((rating) => rating.value);
  const sum = ratingValues.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const avgRating = ratingValues.length > 0 ? sum / ratingValues.length : 0;
  this.rating = avgRating;
  await this.save();
};

module.exports = mongoose.model("Barber", BarberSchema);
