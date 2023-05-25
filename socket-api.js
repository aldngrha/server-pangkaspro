const { io } = require("./app");
const { statusEmitter } = require("./app/cms/status");
const moment = require("moment");
const Transaction = require("./models/transaction");

const socketApi = () => {
  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    statusEmitter.on("statusKapsterData", async (statusKapster) => {
      const intervals = [];
      let countdownPromises = [];

      // Lakukan sesuatu dengan data statusKapster yang diterima
      statusKapster.forEach((data) => {
        if (data.status === "work") {
          const { time } = data;
          const targetTime = moment(time, "HH:mm");
          const currentTime = moment();

          const remainingTime = moment.duration(targetTime.diff(currentTime));

          // Hapus interval yang ada jika ada perubahan pada data
          if (intervals[data._id]) {
            clearInterval(intervals[data._id]);
          }

          const countdownPromise = new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (remainingTime <= 0) {
                clearInterval(interval);
                resolve();
              } else {
                const remainingHours = remainingTime.hours();
                const minutes = remainingTime.minutes();
                const formattedTime = `${remainingHours} jam ${minutes} menit`;
                io.emit("countdownUpdate", {
                  id: data._id,
                  countdown: formattedTime,
                });
                remainingTime.subtract(1, "minutes");
              }
            }, 60000);

            intervals[data._id] = interval;
          });

          countdownPromises.push(countdownPromise);
        }
      });

      try {
        await Promise.all(countdownPromises);

        // Semua countdown telah selesai, perbarui status
        for (const data of statusKapster) {
          if (data.status === "work") {
            data.time = "";
            data.status = "available";

            await data.save();

            // Mengubah status transaksi menjadi "completed" di sini
            const transactions = await Transaction.find({
              kapsterId: data.kapsterId,
              status: "ongoing",
            });

            transactions.forEach(async (transaction) => {
              transaction.status = "completed"; // Ubah status sesuai kebutuhan Anda
              await transaction.save();
              // Mengirim event emit untuk mengupdate status transaksi
              io.emit("transactionStatusUpdate", {
                transactionId: transaction._id,
                status: "completed",
              });
            });

            io.emit("statusUpdate", {
              id: data._id,
              status: "available",
              time: "",
            });
          }
        }
      } catch (error) {
        console.log("Gagal menyimpan data:", error);
      }
    });

    // Handle the "disconnect" event
    socket.on("disconnect", () => {
      console.log("A client has disconnected.");
    });
  });
};
module.exports = socketApi;
