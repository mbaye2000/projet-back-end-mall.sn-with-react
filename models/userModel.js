const mongoose = require("mongoose");

//creation du schema de l utilisateur
const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      min: 3,
    },
    address: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
  },
  { timestamps: true },
);

//creation du model d utilisateur
module.exports = mongoose.model("User", userSchema);
