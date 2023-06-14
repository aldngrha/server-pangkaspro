const fs = require("fs-extra");
const path = require("path");
const User = require("../../../models/user");
const Barber = require("../../../models/barber");
const Kapster = require("../../../models/kapster");
const Status = require("../../../models/status");

module.exports = {
  index: async (req, res) => {
    try {
      const session = req.session.user;
      const user = await User.findById(session.id);

      let kapsters = [];
      if (user.role === "barber") {
        // Loop melalui setiap barber yang dimiliki user
        for (let i = 0; i < user.barber.length; i++) {
          const barber = user.barber[i];

          // Dapatkan semua kapster untuk setiap barber
          const kapster = await Kapster.find({ barberId: barber._id }).populate(
            {
              path: "barberId",
              select: "id name",
            }
          );

          // Tambahkan kapster ke array kapsters
          kapsters.push(...kapster);
        }
      }

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/kapster/index", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Kapster",
        alert,
        kapsters,
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/kapster");
    }
  },
  create: async (req, res) => {
    try {
      const session = req.session.user;
      const user = await User.findById(session.id);

      const barber = await Barber.find({ _id: user.barber });
      res.render("pages/kapster/create", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | Add Kapster",
        barber,
      });
    } catch (error) {
      res.redirect("/barber");
    }
  },
  store: async (req, res) => {
    try {
      const { name, email, password, barberId } = req.body;
      const barber = await Barber.findOne({ _id: barberId });

      const kapster = new Kapster({
        name,
        email,
        password,
        barberId,
        imageUrl: `uploads/${req.file.filename}`,
      });
      await kapster.save();
      await kapster.createUser();

      barber.kapsterId.push({ _id: kapster._id });
      await barber.save();

      req.flash("alertMessage", "Success Menambah Kapster");
      req.flash("alertStatus", "green");
      res.redirect("/kapster");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/kapster");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const session = req.session.user;
      const user = await User.findById(session.id);
      const kapster = await Kapster.findOne({ _id: id }).populate({
        path: "barberId",
        select: "id name",
      });
      const barber = await Barber.find({ _id: user.barber });
      res.render("pages/kapster/edit", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | Edit Kapster",
        kapster,
        barber,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/kapster");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password, barberId } = req.body;
      const kapster = await Kapster.findOne({ _id: id }).populate({
        path: "barberId",
        select: "id name",
      });
      if (req.file === undefined) {
        kapster.name = name;
        kapster.email = email;
        kapster.password = password;
        kapster.barberId = barberId;
        await kapster.updateUser({
          name,
          email,
          password,
        });
        await kapster.save();
        req.flash("alertMessage", "Success Update Kapster");
        req.flash("alertStatus", "green");
        res.redirect("/kapster");
      } else {
        await fs.unlink(path.join(`public/${kapster.imageUrl}`));
        kapster.name = name;
        kapster.email = email;
        kapster.password = password;
        kapster.barberId = barberId;
        kapster.imageUrl = `uploads/${req.file.filename}`;
        await kapster.updateUser({
          name,
          email,
          password,
          imageUrl: kapster.imageUrl,
        });
        await kapster.save();
        req.flash("alertMessage", "Success Update Kapster");
        req.flash("alertStatus", "green");
        res.redirect("/kapster");
      }
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/kapster");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const kapster = await Kapster.findOne({ _id: id }).populate("barberId");
      const barber = await Barber.findOne({
        _id: kapster.barberId._id,
      }).populate("kapsterId");
      await User.deleteOne({ kapster: kapster._id, role: "kapster" });
      for (let i = 0; i < barber.kapsterId.length; i++) {
        if (barber.kapsterId[i]._id.toString() === kapster._id.toString()) {
          barber.kapsterId.pull({ _id: kapster._id });
          await barber.save();
        }
      }
      // Menghapus status yang terkait dengan kapster
      await Status.deleteOne({ kapsterId: kapster._id });
      await fs.unlink(path.join(`public/${kapster.imageUrl}`));
      await kapster.deleteOne();
      req.flash("alertMessage", "Success Delete Kapster");
      req.flash("alertStatus", "green");
      res.redirect("/kapster");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/kapster");
    }
  },
};
