const Barber = require("../../models/barber");
const Image = require("../../models/image");

const LandingPage = async (req, res) => {
  try {
    const barbershop = await Barber.find()
      .select("_id name price rating")
      .limit(5)
      .populate({ path: "imageId", select: "_id imageUrl" });

    const image = await Image.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, imageUrl: 1 } },
    ]);

    res.status(200).json({
      status: 200,
      message: "Data successfully found",
      data: {
        barbershop,
        image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { LandingPage };
