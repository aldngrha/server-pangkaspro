const fs = require("fs-extra");
const path = require("path");
const User = require("../../models/user");

const UpdateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phoneNumber, address } = req.body;

    // Periksa apakah pengguna ada berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    // Update data pengguna
    if (req.file === undefined) {
      user.name = name;
      user.phoneNumber = phoneNumber;
      user.address = address;
      await user.save();
    } else {
      user.name = name;
      user.phoneNumber = phoneNumber;
      user.address = address;
      if (user.imageUrl) {
        await fs.unlink(path.join(`public/${user.imageUrl}`));
      }
      user.imageUrl = `uploads/${req.file.filename}`;
      await user.save();
    }

    res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = { UpdateUser };
