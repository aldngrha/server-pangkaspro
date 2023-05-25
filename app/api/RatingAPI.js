const Rating = require("../../models/rating");
const Barber = require("../../models/barber");

const AddRating = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { value } = req.body;

    // Periksa apakah barber dengan id yang diberikan ada
    const barber = await Barber.findById(id);
    if (!barber) {
      return res.status(404).json({
        status: 404,
        message: "Barber not found",
      });
    }

    // Periksa apakah pengguna sudah memberikan rating sebelumnya
    const existingRating = await Rating.findOne({ barberId: id, userId });
    if (existingRating) {
      return res.status(400).json({
        status: 400,
        message: "Rating already exists for this barber by the user",
      });
    }

    // Membuat objek Rating baru
    const rating = new Rating({
      barberId: id,
      userId,
      value,
    });

    await rating.save();

    const ratings = await Rating.find({ barberId: id });

    let averageRating = 0;
    if (ratings.length > 0) {
      const totalRatings = ratings.reduce(
        (sum, rating) => sum + rating.value,
        0
      );
      averageRating = totalRatings / ratings.length;

      await Barber.findByIdAndUpdate(id, { rating: averageRating });
    }

    res.status(201).json({
      status: 201,
      message: "Successfully add rating",
      data: {
        averageRating,
        ratings,
      },
    });
  } catch (error) {
    console.log(error);
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { AddRating };
