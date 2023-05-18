const moment = require("moment");
const User = require("../../../models/user");
const Kapster = require("../../../models/kapster");
const Status = require("../../../models/status");
const { EventEmitter } = require("events");
const Barber = require("../../../models/barber");

const statusEmitter = new EventEmitter();

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

      const kapsterIds = kapsters.map((kapster) => kapster._id);

      const statusKapster = await Status.find({
        kapsterId: kapsterIds,
      }).populate({ path: "kapsterId", select: "id name" });

      // Mengirim data statusKapster ke socket.js melalui event 'statusKapsterData'
      statusEmitter.emit("statusKapsterData", statusKapster);

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/status/index", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | Status Work",
        alert,
        statusKapster,
        kapster: kapsterIds,
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/status");
    }
  },
  statusEmitter: statusEmitter,
  create: async (req, res) => {
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

      res.render("pages/status/create", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | Add Status",
        kapsters,
        alert,
      });
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/status");
    }
  },
  store: async (req, res) => {
    try {
      const { kapsterId, statusOption, time } = req.body;

      const newStatus = {
        kapsterId,
        status: statusOption,
        time: time,
      };

      const statusWork = new Status(newStatus);
      await statusWork.save();

      res.redirect("/status");
    } catch (error) {
      console.log(error);
      res.redirect("/status");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
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
      const statusKapster = await Status.findOne({ _id: id }).populate({
        path: "kapsterId",
        select: "id name",
      });

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("pages/status/edit", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | Edit Barber",
        alert,
        kapsters,
        statusKapster,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/barber");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { statusOption, time } = req.body;
      const statusWork = await Status.findOne({ _id: id }).populate({
        path: "kapsterId",
        select: "id name",
      });
      statusWork.status = statusOption;
      statusWork.time = time;
      await statusWork.save();

      res.redirect("/status");
    } catch (error) {
      console.log(error);
      res.redirect("/status");
    }
  },
};
