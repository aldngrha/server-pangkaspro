const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HASH_ROUND = 10;

const KapsterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama barber harus diisi"],
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
    },
    imageUrl: {
      type: String,
    },
    barberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barber",
    },
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
    },
  },
  { timestamps: true }
);

KapsterSchema.methods.createUser = async function () {
  const User = mongoose.model("User");
  // const hashedPassword = await bcrypt.hash(this.password, 10);
  const user = new User({
    name: this.name,
    email: this.email,
    password: this.password,
    phoneNumber: "",
    address: "",
    imageUrl: this.imageUrl,
    role: "kapster",
    kapster: this._id,
  });
  return user.save();
};

KapsterSchema.methods.updateUser = async function ({
  name,
  email,
  password,
  imageUrl,
}) {
  const User = mongoose.model("User");
  const hashedPassword = await bcrypt.hash(this.password, HASH_ROUND);
  const user = await User.findOneAndUpdate(
    { kapster: this._id, role: "kapster" },
    { name, email, password: hashedPassword, imageUrl }
  );
  return user;
};

KapsterSchema.pre("remove", async function (next) {
  try {
    const User = mongoose.model("User");
    // Hapus user dengan kapsterId yang sama dengan id kapster yang akan dihapus
    await User.deleteMany({ kapsterId: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Kapster", KapsterSchema);
