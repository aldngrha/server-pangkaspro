const User = require("../../../models/user");
const Barber = require("../../../models/barber");
const bcrypt = require("bcryptjs");

module.exports = {
  signin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("pages/signin", {
          alert,
          title: "Pangkaspro | Signin Barbershop & Kapster",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      res.redirect("/");
    }
  },
  signup: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");

      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user === null || req.session.user === undefined) {
        res.render("pages/signup", {
          alert,
          title: "Pangkaspro | Signup Barbershop",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      res.redirect("/");
    }
  },
  actionSignup: async (req, res) => {
    try {
      const { name, email, password, barberName } = req.body;

      let userRole = "barber";

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

      // buat user baru dengan role barber
      let user = new User({
        name: name,
        email: email,
        password: password,
        phoneNumber: "",
        address: "",
        role: userRole,
        barber: [barber._id],
      });
      // simpan user
      await user.save();

      req.flash(
        "alertMessage",
        "Sukses mendaftar sebagai pemilik barbershop, silakan login"
      );
      req.flash("alertStatus", "green");
      res.redirect("/");
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/register");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { email, password } = req.body;
      // Cari user berdasarkan email
      const user = await User.findOne({ email: email });

      // Jika user tidak ditemukan, redirect kembali ke halaman login dengan pesan error
      if (!user) {
        req.flash("alertMessage", "Email atau password salah");
        req.flash("alertStatus", "red");
        return res.redirect("/");
      }

      // Validasi password
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Email atau password salah");
        req.flash("alertStatus", "red");
        return res.redirect("/");
      }

      // Validasi role
      if (
        user.role !== "admin" &&
        user.role !== "barber" &&
        user.role !== "kapster"
      ) {
        req.flash("error", "Anda tidak memiliki akses ke halaman ini");
        req.flash("alertStatus", "red");
        return res.redirect("/");
      }

      // Simpan user pada session
      req.session.user = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
      if (req.session.user.role === "kapster") {
        res.redirect("/cash-on-delivery");
      } else {
        res.redirect("/dashboard");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/");
    }
  },
  actionSignout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
