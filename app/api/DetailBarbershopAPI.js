const Barber = require("../../models/barber");

const DetailBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const barbershop = await Barber.findOne({ _id: id })
      .populate({
        path: "imageId",
        select: "_id imageUrl",
      })
      .populate({
        path: "kapsterId",
        select: "_id name",
        populate: {
          path: "statusId",
          select: "_id status time",
        },
      });

    if (!barbershop) {
      return res.status(404).json({
        status: 404,
        message: "Barbershop not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Data successfully found",
      data: {
        barbershop,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { DetailBarbershop };
