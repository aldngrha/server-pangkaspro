const Barber = require("../../models/barber");
const Favorite = require("../../models/favorite");
const FavoriteBarbershop = async (req, res) => {
  try {
    const { barberId } = req.params;
    const userId = req.user._id;

    // Periksa apakah barbershop dengan ID yang diberikan tersedia
    const barber = await Barber.findById(barberId);
    if (!barber) {
      return res
        .status(404)
        .json({ status: 404, message: "Barbershop not found" });
    }

    // Cek apakah barbershop sudah ada dalam daftar favorit pengguna
    const existingFavorite = await Favorite.findOne({
      user: userId,
      barber: barberId,
    });
    if (existingFavorite) {
      return res.status(400).json({
        status: 400,
        message: "Barbershop already added to favorites",
      });
    }

    // Cek apakah dokumen Favorite sudah ada
    let favorite = await Favorite.findOne({ user: userId });

    // Jika belum ada, buat dokumen baru
    if (!favorite) {
      favorite = new Favorite({ user: userId, barber: [barberId] });
      await favorite.save();
    } else {
      // Jika sudah ada, tambahkan barberId ke array barber
      if (!favorite.barber.includes(barberId)) {
        favorite.barber.push(barberId);
        await favorite.save();
      }
    }

    res.status(201).json({
      status: 201,
      message: "Barbershop added to favorites",
      data: {
        favorite,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const GetFavBarbershop = async (req, res) => {
  try {
    const userId = req.user._id;

    // Cari semua favorit berdasarkan ID pengguna
    const favorites = await Favorite.find({ user: userId }).populate("barber");

    res.status(200).json({
      status: 200,
      message: "Favorites successfully retrieved",
      data: {
        favorites,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve favorites",
    });
  }
};

module.exports = { FavoriteBarbershop, GetFavBarbershop };
