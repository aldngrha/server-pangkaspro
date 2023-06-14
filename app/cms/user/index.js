const User = require("../../../models/user");
const Barber = require("../../../models/barber");
const Kapster = require("../../../models/kapster");

module.exports = {
  index: async (req, res) => {
    try {
      const session = req.session.user;

      const users = await User.find();

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/user/index", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | My Users",
        alert,
        users,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/user");
    }
  },
  create: async (req, res) => {
    try {
      const session = req.session.user;

      const barbers = await Barber.find();

      res.render("pages/user/create", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | Add User",
        barbers,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/user");
    }
  },
  store: async (req, res) => {
    try {
      const { name, email, password, statusOption, barberName, barberId } =
        req.body;

      let userRole = "user";
      let user;

      // Jika memilih 'Yes', buat data Barber terlebih dahulu
      if (statusOption === "barber") {
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
      } else if (statusOption === "kapster") {
        const barber = await Barber.findOne({ _id: barberId });
        const kapster = new Kapster({
          name,
          email,
          password,
          barberId,
          imageUrl: "",
        });
        await kapster.save();
        barber.kapsterId.push({ _id: kapster._id });
        await barber.save();

        userRole = "kapster";
        // buat user baru dengan role barber
        user = new User({
          name: name,
          email: email,
          password: password,
          phoneNumber: "",
          address: "",
          role: userRole,
          kapster: kapster._id,
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

      req.flash("alertMessage", "Success Menambah User");
      req.flash("alertStatus", "green");
      res.redirect("/user");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/user");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const session = req.session.user;

      const barbers = await Barber.find();

      const user = await User.findOne({ _id: id });

      res.render("pages/user/edit", {
        name: session.name,
        role: session.role,
        url: req.url,
        title: "Pangkaspro | Add User",
        barbers,
        user,
      });
    } catch (error) {
      console.log(error);
      res.redirect("/user");
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      const user = await User.findOne({ _id: id });

      user.name = name;
      user.email = email;
      user.password = password;
      // simpan user
      await user.save();

      req.flash("alertMessage", "Success Menambah User");
      req.flash("alertStatus", "green");
      res.redirect("/user");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/user");
    }
  },
};
