const mongoose = require("mongoose");
const product = require("../models/productModel.js");

//controller pour creer un produit
const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productRef,
      productDescription,
      stock,
      productPrice,
      productImage,
      categoryId,
    } = req.body;

    //verifier si le produit existe deja par nom ou reference
    const existingProduct = await product.findOne({ productName });
    const existingRef = await product.findOne({ productRef });
    if (existingProduct || existingRef) {
      return res.status(400).json({
        message: "Le produit existe déjà ou la référence est déjà utilisée",
      });
    }

    //creer une nouvelle produit
    const newProduct = await product.create({
      productName,
      productRef,
      productDescription,
      productPrice,
      stock,
      productImage,
      categoryId,
    });
    return res
      .status(201)
      .json({ message: "produit cree avec succes", product: newProduct });
  } catch (error) {
    console.error("erreur lors de la recuperation", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

// controller pour recuperer tous les produits
const getAllProducts = async (req, res) => {
  try {
    const products = await product.find().populate("categoryId");
    return res
      .status(200)
      .json({ message: "produits recuperees avec succes", products });
  } catch (error) {
    console.error("erreur lors de la recuperation", error);
    return res.status(508).json({ message: "erreur serveur" });
  }
};

// controller pour recuperer un produit par son id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "id produit invalide" });
    }
    const productData = await product.findById(id).populate("categoryId");
    if (!productData) {
      return res.status(404).json({ message: "produit non trouve" });
    }
    return res
      .status(200)
      .json({ message: "produit recuperee avec succes", product: productData });
  } catch (error) {
    console.error("erreur lors de la recuperation", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

//controller pour mettre a jour un produit
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "id produit invalide" });
    }
    const {
      productName,
      productRef,
      productDescription,
      stock,
      productPrice,
      productImage,
      categoryId,
    } = req.body;

    const existingProduct = await product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "produit non trouve" });
    }

    const updatedProduct = await product
      .findByIdAndUpdate(
        id,
        {
          productName,
          productRef,
          productDescription,
          stock,
          productPrice,
          productImage,
          categoryId,
        },
        { new: true },
      )
      .populate("categoryId");

    return res.status(200).json({
      message: "produit mis a jour avec succes",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("erreur lors de la mise a jour", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

// controller pour supprimer un produit
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "id produit invalide" });
    }
    const existingProduct = await product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "produit non trouve" });
    }

    await product.findByIdAndDelete(id);
    return res.status(200).json({ message: "produit supprime avec succes" });
  } catch (error) {
    console.error("erreur lors de la suppression", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
