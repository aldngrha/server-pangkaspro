const User = require("../../../models/user");
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
          title: "Pangkaspro | Signin user",
        });
      } else {
        res.redirect("/dashboard");
      }
    } catch (error) {
      res.redirect("/");
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
