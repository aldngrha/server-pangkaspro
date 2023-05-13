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
          favourite: [],
        });
      }

      // simpan user
      await user.save();

      // hapus field password dari response
      delete user._doc.password;

      // kirim response dengan data user
      res.status(201).json({ data: user });
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
                  name: user.nama,
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
};
