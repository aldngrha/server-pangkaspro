const fs = require("fs-extra");
const path = require("path");
const Barber = require("../../../models/barber");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      const session = req.session.user;
      res.render("pages/barber/index", {
        name: session.name,
        role: session.role,
        title: "Pangkaspro | My Barber",
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/barber");
    }
  },
  create: async (req, res) => {
    try {
      res.render("pages/barber/create", {
        title: "Pangkaspro | Add Barber",
      });
    } catch (error) {
      res.redirect("/barber");
    }
  },
  edit: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("pages/barber/edit", {
        name: req.session.user.name,
        title: "Pangkaspro | Edit Barber",
        alert,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/barber");
    }
  },
};
