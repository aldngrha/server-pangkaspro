const User = require("../../../models/user");
const Barber = require("../../../models/barber");
const Transaction = require("../../../models/transaction");

module.exports = {
  dashboard: async (req, res) => {
    try {
      const session = req.session.user;
      const user = await User.findById(session.id);
      let transactions;
      let totalAmount = 0; // Inisialisasi totalAmount
      let count = 0;
      let users = 0;

      if (user.role === "barber") {
        const barbers = await Barber.find({ _id: user.barber });
        const barberIds = barbers.map((barber) => barber._id);

        transactions = await Transaction.find({ barberId: { $in: barberIds } })
          .populate({
            path: "barberId",
            select: "_id name",
            populate: { path: "imageId", select: "_id imageUrl" },
          })
          .populate({ path: "userId", select: "_id name" })
          .limit(10);

        // Menghitung totalAmount dari transaksi dengan role barber
        totalAmount = await Transaction.aggregate([
          {
            $match: {
              barberId: { $in: barberIds },
              status: "completed",
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$totalAmount" },
            },
          },
        ]);

        count = await Transaction.countDocuments({
          barberId: { $in: barberIds },
        });
      } else if (user.role === "admin") {
        transactions = await Transaction.find()
          .populate({
            path: "barberId",
            select: "_id name",
            populate: { path: "imageId", select: "_id imageUrl" },
          })
          .populate({ path: "userId", select: "_id name" })
          .limit(10);

        // Menghitung totalAmount dari seluruh transaksi
        totalAmount = await Transaction.aggregate([
          {
            $match: {
              status: "completed",
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$totalAmount" },
            },
          },
        ]);

        count = await Transaction.countDocuments();
        users = await User.countDocuments();
      }

      const grandTotal =
        totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;

      res.render("pages/dashboard", {
        url: req.url,
        name: session.name,
        role: session.role,
        title: "Pangkaspro | Dashboard",
        transactions,
        grandTotal,
        count,
        users,
      });
    } catch (error) {
      res.redirect("/dashboard");
    }
  },
};
