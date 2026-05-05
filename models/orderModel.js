const mongoose = require("mongoose");

//creation de schema produit
const orderSchema = new mongoose.Schema(
  {
    refOrder: {
      type: String,
      required: true,
    },
    user: {
      guest: {
        fullname: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
        },
      },
      clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["wave", "orange money", "freemoney"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "deliverd", "canceled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

//creation du model de commande
module.exports = mongoose.model("order", orderSchema);
