const mongoose = require("mongoose");

//creation un schema de product
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productRef: {
      type: String,
      required: true,
      unique: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    stock: {
      quantityAvailable: {
        type: Number,
        required: true,
      },
      quantitySold: {
        type: Number,
        default: 0,
      },
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
  },
  { timestamps: true },
);

//creation du model de product
module.exports = mongoose.model("product", productSchema);
