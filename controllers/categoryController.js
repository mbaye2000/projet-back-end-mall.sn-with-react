const Category = require("../models/categoryModel.js");

//controller pour creer une categorie
const createCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;
    const normalizedName = (categoryName || "").trim();
    const normalizedDescription = (categoryDescription || "").trim();

    if (!normalizedName || !normalizedDescription) {
      return res.status(400).json({
        message: "Le nom et la description de la catégorie sont obligatoires",
      });
    }

    //verifier si le category existe deja

    const existCategory = await Category.findOne({
      categoryName: { $regex: `^${normalizedName}$`, $options: "i" },
    });

    if (existCategory) {
      return res.status(409).json({ message: "La catégorie existe déjà" });
    }
    //creer une nouvelle category
    const newCategory = await Category.create({
      categoryName: normalizedName,
      categoryDescription: normalizedDescription,
    });
    return res.status(201).json({
      message: "Catégorie créée avec succès",
      category: newCategory,
    });
  } catch (error) {
    console.error("error creating category:", error);
    return res
      .status(500)
      .json({ message: "error server", error: error.message });
  }
};

//recuperer tous les categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    return res
      .status(200)
      .json({ message: "categories recuperees avec succes", categories });
  } catch (error) {
    console.error("errorlors de la recuperation des categories:", error);
    return res
      .status(500)
      .json({ message: "error server", error: error.message });
  }
};

//recuperer une category par son id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundCategory = await Category.findById(id);
    if (!foundCategory) {
      return res.status(404).json({ message: "category not found" });
    }
    return res.status(200).json({
      message: "category recuperee avec succes",
      category: foundCategory,
    });
  } catch (error) {
    console.error("error lors de la recuperation de la category:", error);
    return res
      .status(500)
      .json({ message: "error server", error: error.message });
  }
};

// controller pour mettre a jour une category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName, categoryDescription },
      { new: true },
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "category not found" });
    }

    return res
      .status(200)
      .json({
        message: "category updated successfully",
        category: updatedCategory,
      });
  } catch (error) {
    console.error("error lors de la mise a jour de la category:", error);
    return res
      .status(500)
      .json({ message: "error server", error: error.message });
  }
};

// suppression d une category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "category not found" });
    }
    return res.status(200).json({ message: "category supprimee avec succes" });
  } catch (error) {
    console.error("error lors de la suppression de la category:", error);
    return res
      .status(500)
      .json({ message: "error server", error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
