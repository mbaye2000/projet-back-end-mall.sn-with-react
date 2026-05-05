const mongoose = require("mongoose");

//creation du schema de la categorie
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      require: true,
    },
    categoryDescription: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
);

//creation de model de cathegorie
module.exports = mongoose.model("category", categorySchema);
