const Barber = require("../../models/barber");
const Favorite = require("../../models/favorite");
const FavoriteBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Periksa apakah barbershop dengan ID yang diberikan tersedia
    const barber = await Barber.findById(id);
    if (!barber) {
      return res
        .status(404)
        .json({ status: 404, message: "Barbershop not found" });
    }

    // Cek apakah barbershop sudah ada dalam daftar favorit pengguna
    const existingFavorite = await Favorite.findOne({
      user: userId,
      barber: id,
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
      favorite = new Favorite({ user: userId, barber: [id] });
      await favorite.save();
    } else {
      // Jika sudah ada, tambahkan id ke array barber
      if (!favorite.barber.includes(id)) {
        favorite.barber.push(id);
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
    const favorites = await Favorite.find({ user: userId }).populate({path: "barber", populate: { path: "imageId", select: "_id imageUrl"}});

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

const GetOneFavBarbershop = async (req, res) => {
  try {
	const { id } = req.params;  
	const userId = req.user._id;

    // Cari semua favorit berdasarkan ID pengguna
    const favorite = await Favorite.findOne({ user: userId, barber: id }).populate("barber");
	
	if (!favorite) {
      return res.status(404).json({
        status: 404,
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Favorites successfully retrieved",
      data: {
        favorite,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Failed to retrieve favorites",
    });
  }
};

module.exports = { FavoriteBarbershop, GetFavBarbershop, GetOneFavBarbershop };
