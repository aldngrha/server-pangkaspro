const Transaction = require("../../models/transaction");
const Barber = require("../../models/barber");
const Kapster = require("../../models/kapster");

const CreateTransaction = async (req, res) => {
  try {
    const {
      barberId,
      kapsterId,
      quantity,
      name,
      phoneNumber,
      address,
      paymentMethod,
      accountHolder,
      bankName,
    } = req.body;
    const userId = req.user._id;

    if (paymentMethod === "Transfer" && !req.file) {
      return res.status(404).json({ message: "Image not found" });
    }

    // if (
    //   barberId === undefined ||
    //   kapsterId === undefined ||
    //   quantity === undefined ||
    //   name === undefined ||
    //   phoneNumber === undefined ||
    //   address === undefined ||
    //   (paymentMethod !== "Bayar ditempat" && paymentMethod !== "Transfer") ||
    //   (paymentMethod === "Transfer" && (!image || !accountHolder || !bankName))
    // ) {
    //   return res.status(404).json({
    //     message: "Lengkapi semua field dan pilih metode pembayaran yg valid",
    //   });
    // }

    const barber = await Barber.findOne({ _id: barberId });

    if (!barber) {
      return res.status(404).json({ message: "Barbershop not found" });
    }

    const kapster = await Kapster.findOne({ _id: kapsterId });

    if (!kapster) {
      return res.status(404).json({ message: "Kapster not found" });
    }

    let total = barber.price * quantity;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let invoice = "INV/PP/";
    for (let i = 0; i < 10; i++) {
      invoice += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const newTransaction = {
      invoiceNumber: invoice,
      quantity,
      name,
      phoneNumber,
      address,
      totalAmount: total,
      payments: {
        paymentMethod,
        proofPayment:
          paymentMethod === "Transfer"
            ? req.file
              ? `uploads/${req.file.filename}`
              : ""
            : "",
        accountHolder: paymentMethod === "Transfer" ? accountHolder : "",
        bankName: paymentMethod === "Transfer" ? bankName : "",
      },
      status: "pending",
      addOns: [],
      userId,
      barberId: barber,
      kapsterId: kapster,
    };

    const transaction = await Transaction.create(newTransaction);

    res.status(201).json({
      status: 201,
      message: "Success order barbershop",
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const AddonsTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { addOns } = req.body;

    // Validasi jika transaksi masih dalam status ongoing

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status !== "ongoing") {
      return res
        .status(400)
        .json({ message: "Order sudah selesai atau gagal" });
    }

    // Cari barbershop berdasarkan barberId pada transaksi
    const barber = await Barber.findById(transaction.barberId);

    if (!barber) {
      return res.status(404).json({ message: "Barbershop not found" });
    }
	

    addOns.forEach((addOn) => {
	  const totalAddon = barber.price * addOn.quantity;
      transaction.addOns.push({ ...addOn, totalAddon, isApproved: "pending" });
    });

    transaction.status = "pending approval";

    // Simpan perubahan ke database
    await transaction.save();

    res.status(200).json({
      status: 200,
      message: "Add-ons added to transaction",
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const GetAllTransaction = async (req, res) => {
  try {
    const user = req.user._id;
    const transaction = await Transaction.find({ userId: user, status: { $ne: "ongoing" }})
      .select("_id invoiceNumber createdAt quantity name totalAmount status")
      .populate({
        path: "barberId",
        select: "_id name",
        populate: {
          path: "kapsterId",
          select: "_id name",
        },
      });

    if (!transaction) {
      return res.status(404).json({
        status: 404,
        message: "Transaction not found, please order at least one",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Successfully get all transaction",
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const GetOneTransaction = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const transaction = await Transaction.findOne({
      _id: id,
      userId: user,
    }).populate({
      path: "barberId",
      select: "_id name",
    });

    if (!transaction) {
      return res.status(404).json({
        status: 404,
        message: "Transaction not found, please order at least one",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Successfully get one transaction",
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const GetOngoingTransaction = async (req, res) => {
  try {
    const user = req.user._id;
    const transaction = await Transaction.find({
      userId: user,
      status: "ongoing",
    })
      .select("_id invoiceNumber createdAt quantity name totalAmount status")
      .populate({
        path: "barberId",
        select: "_id name",
        populate: {
          path: "kapsterId",
          select: "_id name",
        },
      });

    if (!transaction) {
      return res.status(404).json({
        status: 404,
        message: "Transaction not found, please order at least one",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Successfully get one transaction",
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = {
  CreateTransaction,
  AddonsTransaction,
  GetAllTransaction,
  GetOneTransaction,
  GetOngoingTransaction,
};
