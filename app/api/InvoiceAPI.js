const Transaction = require("../../models/transaction");
const GetInvoice = async (req, res) => {
  try {
    const user = req.user._id;
    const { id } = req.params;
    const invoice = await Transaction.findOne({
      _id: id,
      userId: user,
    })
      .populate({
        path: "barberId",
        select: "_id name",
      })
      .populate({
        path: "kapsterId",
        select: "_id name",
      });

    if (!invoice) {
      return res.status(404).json({
        status: 404,
        message: "Transaction not found, please order at least one",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Successfully get invoice",
      data: {
        invoice,
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

module.exports = { GetInvoice };
