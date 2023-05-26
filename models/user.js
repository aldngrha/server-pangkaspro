const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const HASH_ROUND = 10;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
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
    phoneNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "barber", "kapster"],
      default: "user",
    },
    imageUrl: {
      type: String,
    },
    kapster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kapster",
    },
    barber: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Barber",
      },
    ],
  },
  { timestamps: true }
);

// Validasi email agar tidak boleh sama
UserSchema.path("email").validate(
  async function (value) {
    if (this.isNew) {
      // Validasi hanya diterapkan untuk objek User baru
      try {
        const count = await this.model("User").countDocuments({ email: value });
        return !count;
      } catch (err) {
        throw err;
      }
    } else {
      return true; // Return true untuk mengabaikan validasi untuk objek yang sudah ada
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// Middleware pre-save untuk hashing password
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, HASH_ROUND, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", UserSchema);
