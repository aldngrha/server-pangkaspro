const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../configuration");
const User = require("../../../models/user");
const Barber = require("../../../models/barber");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, option, barberName } = req.body;

      let userRole = "user";
      let user;

      // Jika memilih 'Yes', buat data Barber terlebih dahulu
      if (option === "yes") {
        const barber = new Barber({
          name: barberName,
          price: 0,
          shippingCost: 0,
          description: "",
          accountName: "",
          bank: "",
          accountNumber: "",
          imageId: [],
          rating: 0,
        });
        await barber.save();
        // set role untuk user yang terkait
        userRole = "barber";

        // buat user baru dengan role barber
        user = new User({
          name: name,
          email: email,
          password: password,
          phoneNumber: "",
          address: "",
          role: userRole,
          barber: [barber._id],
        });
      } else {
        // buat user baru dengan role user
        user = new User({
          name: name,
          email: email,
          password: password,
          phoneNumber: "",
          address: "",
          role: userRole,
        });
      }

      // simpan user
      await user.save();

      // hapus field password dari response
      delete user._doc.password;

      // kirim response dengan data user
      res
        .status(201)
        .json({ status: 201, message: "Successfully registered", data: user });
    } catch (error) {
      if (error && error.name === "ValidationError") {
        console.error(error);
        res.status(422).json({
          message: error.message,
          fields: error.errors,
        });
      } else {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
      }
    }
  },
  login: async (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
      .then((user) => {
        if (user) {
          const checkPassword = bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            const token = jwt.sign(
              {
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                },
              },
              config.jwtSecret
            );
            res.status(200).json({
              data: { token },
            });
          } else {
            res.status(403).json({
              message: "password yang anda masukan salah.",
            });
          }
        } else {
          res.status(403).json({
            message: "email yang anda masukan belum terdaftar.",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message || `Internal server error`,
        });
        next();
      });
  },
  changePassword: async (req, res) => {
    try {
      const userId = req.user._id;
      const { currentPassword, newPassword, confirmPassword } = req.body;

      // Periksa apakah pengguna ada berdasarkan ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }

      // Periksa kecocokan password saat ini
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(400).json({
          status: 400,
          message: "Current password is incorrect",
        });
      }

      // Periksa kecocokan password baru dan konfirmasi password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          status: 400,
          message: "New password and confirm password do not match",
        });
      }

      // Generate hash untuk password baru
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Update password pengguna
      user.password = newPasswordHash;
      await user.save();

      res.status(200).json({
        status: 200,
        message: "Password has been changed successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  },
};
