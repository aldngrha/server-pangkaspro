const fs = require("fs-extra");
const path = require("path");
const Barber = require("../../../models/barber");
const User = require("../../../models/user");
const Kapster = require("../../../models/kapster");
const Transaction = require("../../../models/transaction");

module.exports = {
  index: async (req, res) => {
    try {
      const session = req.session.user;
      const user = await User.findById(session.id);
      let barbers;
      if (user.role === "barber") {
        barbers = await Barber.find({ _id: user.barber });
      }

      const barberIds = barbers.map((barber) => barber._id);

      const transactions = await Transaction.find({
        barberId: { $in: barberIds },
      })
        .populate({ path: "barberId", select: "_id name" })
        .populate({ path: "userId", select: "_id name" });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/transaction/index", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Transaction",
        alert,
        transactions,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/transaction");
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const session = req.session.user;

      const transaction = await Transaction.findOne({
        _id: id,
      })
        .populate({ path: "barberId", select: "_id name" })
        .populate({ path: "kapsterId", select: "_id name" })
        .populate({ path: "userId", select: "_id name" });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/transaction/detail", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Transaction",
        alert,
        transaction,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/transaction");
    }
  },
  acceptOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const session = req.session.user;

      const transaction = await Transaction.findOne({
        _id: id,
      });

      // Ubah status transaksi menjadi 'ongoing'
      transaction.status = "ongoing";
      await transaction.save();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/transaction/detail", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Transaction",
        alert,
        transaction,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/transaction");
    }
  },
  rejectOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const session = req.session.user;

      const transaction = await Transaction.findOne({
        _id: id,
      });

      // Ubah status transaksi menjadi 'ongoing'
      transaction.status = "rejected";
      await transaction.save();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/transaction/detail", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Transaction",
        alert,
        transaction,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/transaction");
    }
  },
  approveAddons: async (req, res) => {
    try {
      const { id } = req.params;
      const session = req.session.user;

      const transaction = await Transaction.findOne({
        _id: id,
      });

      const barber = await Barber.findById(transaction.barberId);

      let total = transaction.totalAmount;

      transaction.addOns.forEach((addOn) => {
        const quantity = addOn.quantity;
        const addOnPrice = barber.price * quantity;
        total += addOnPrice;
        addOn.isApproved = "approve";
      });

      // Ubah status transaksi menjadi 'ongoing'
      transaction.status = "ongoing";

      // Update totalAmount pada transaksi
      transaction.totalAmount = total;
      await transaction.save();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/transaction/detail", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Transaction",
        alert,
        transaction,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/transaction");
    }
  },
  declineAddons: async (req, res) => {
    try {
      const { id } = req.params;
      const session = req.session.user;

      const transaction = await Transaction.findOne({
        _id: id,
      });

      transaction.addOns.forEach((addOn) => {
        addOn.isApproved = "decline";
      });

      // Ubah status transaksi menjadi 'ongoing'
      transaction.status = "ongoing";

      await transaction.save();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/transaction/detail", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Transaction",
        alert,
        transaction,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/transaction");
    }
  },
};
