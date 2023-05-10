const jwt = require("jsonwebtoken");
const config = require("../app/configuration");
const User = require("../models/user");

module.exports = {
  isUser: async (req, res, next) => {
    try {
      const token = req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null;
      const data = jwt.verify(token, config.jwtSecret);
      const user = await User.findOne({ _id: data.user.id });
      if (!user || user.role !== "user") {
        throw new Error();
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      res.status(401).json({
        error: "Not authorized to access this resource",
      });
    }
  },
  allRole: async (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        "alertMessage",
        `Mohon maaf session anda telah habis silahkan login kembali`
      );
      req.flash("alertStatus", "red");
      res.redirect("/");
    } else {
      const allowedRoles = ["admin", "barber", "kapster"];
      const userRole = req.session.user.role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        req.flash("alertMessage", "Anda tidak diizinkan mengakses halaman ini");
        req.flash("alertStatus", "red");
        res.redirect("/");
      }
    }
  },
  isAdmin: async (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        "alertMessage",
        `Mohon maaf session anda telah habis silahkan login kembali`
      );
      req.flash("alertStatus", "red");
      res.redirect("/");
    } else {
      const allowedRoles = ["admin"];
      const userRole = req.session.user.role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        req.flash("alertMessage", "Anda tidak diizinkan mengakses halaman ini");
        req.flash("alertStatus", "red");
        res.redirect("/");
      }
    }
  },
  isBarber: async (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        "alertMessage",
        `Mohon maaf session anda telah habis silahkan login kembali`
      );
      req.flash("alertStatus", "red");
      res.redirect("/");
    } else {
      const allowedRoles = ["barber"];
      const userRole = req.session.user.role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        req.flash("alertMessage", "Anda tidak diizinkan mengakses halaman ini");
        req.flash("alertStatus", "red");
        res.redirect("/");
      }
    }
  },
  isKapster: async (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        "alertMessage",
        `Mohon maaf session anda telah habis silahkan login kembali`
      );
      req.flash("alertStatus", "red");
      res.redirect("/");
    } else {
      const allowedRoles = ["kapster"];
      const userRole = req.session.user.role;
      if (allowedRoles.includes(userRole)) {
        next();
      } else {
        req.flash("alertMessage", "Anda tidak diizinkan mengakses halaman ini");
        req.flash("alertStatus", "red");
        res.redirect("/");
      }
    }
  },
};
