const fs = require("fs-extra");
const path = require("path");
const Barber = require("../../../models/barber");
const User = require("../../../models/user");
const Image = require("../../../models/image");

module.exports = {
  index: async (req, res) => {
    try {
      const session = req.session.user;
      const user = await User.findById(session.id);
      let barbers;
      if (user.role === "barber") {
        barbers = await Barber.find({ _id: user.barber });
      }

      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("pages/barber/index", {
        name: session.name,
        role: session.role,
        title: "Pangkaspro | My Barber",
        alert,
        barbers,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/barber");
    }
  },
  create: async (req, res) => {
    try {
      const session = req.session.user;
      res.render("pages/barber/create", {
        name: session.name,
        role: session.role,
        title: "Pangkaspro | Add Barber",
      });
    } catch (error) {
      res.redirect("/barber");
    }
  },
  store: async (req, res) => {
    try {
      const { name, price, bank, accountName, accountNumber, description } =
        req.body;
      if (req.files.length > 0) {
        const barber = new Barber({
          name,
          price,
          bank,
          accountName,
          accountNumber,
          description,
        });
        await barber.save();
        // Mengupdate barberId pada user dengan id yang sesuai

        const user = await User.findOne({ _id: req.session.user.id });
        user.barber.push(barber._id);
        await user.save();

        for (let i = 0; i < req.files.length; i++) {
          const imageSave = await Image.create({
            imageUrl: `uploads/${req.files[i].filename}`,
          });
          barber.imageId.push({ _id: imageSave._id });
          await barber.save();
        }
      }
      res.redirect("/barber");
    } catch (error) {
      console.log(error);
      res.redirect("/barber");
    }
  },
  edit: async (req, res) => {
    try {
      const { id } = req.params;
      const barber = await Barber.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      const session = req.session.user;
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("pages/barber/edit", {
        name: session.name,
        role: session.role,
        title: "Pangkaspro | Edit Barber",
        alert,
        barber,
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
      const { name, price, bank, accountName, accountNumber, description } =
        req.body;
      const barber = await Barber.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });
      if (req.files.length > 0) {
        if (barber.imageId.length > 0) {
          for (let i = 0; i < barber.imageId.length; i++) {
            const imageUpdate = await Image.findOne({
              _id: barber.imageId[i]._id,
            });
            await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
            imageUpdate.imageUrl = `uploads/${req.files[i].filename}`;
            await imageUpdate.save();
          }
        } else {
          for (let i = 0; i < req.files.length; i++) {
            const imageSave = await Image.create({
              imageUrl: `uploads/${req.files[i].filename}`,
            });
            barber.imageId.push({ _id: imageSave._id });
            await barber.save();
          }
        }
        barber.name = name;
        barber.price = price;
        barber.bank = bank;
        barber.accountName = accountName;
        barber.accountNumber = accountNumber;
        barber.description = description;
        await barber.save();
        req.flash("alertMessage", "Success update barber");
        req.flash("alertStatus", "green");
        res.redirect("/barber");
      } else {
        barber.name = name;
        barber.price = price;
        barber.bank = bank;
        barber.accountName = accountName;
        barber.accountNumber = accountNumber;
        barber.description = description;
        await barber.save();
        req.flash("alertMessage", "Success update barber");
        req.flash("alertStatus", "green");
        res.redirect("/barber");
      }
    } catch (error) {
      console.error(error);
      res.redirect("/barber");
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const barber = await Barber.findOneAndRemove({ _id: id }).populate(
        "imageId"
      );
      for (let i = 0; i < barber.imageId.length; i++) {
        Image.findOneAndRemove({ _id: barber.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
          })
          .catch((error) => {
            console.log(error);
            req.flash("alertMessage", `${error.message}`);
            req.flash("alertStatus", "red");
            res.redirect("/barber");
          });
      }
      req.flash("alertMessage", "Success delete Barber");
      req.flash("alertStatus", "green");
      res.redirect("/barber");
    } catch (error) {
      console.log(error);
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "red");
      res.redirect("/barber");
    }
  },
};
