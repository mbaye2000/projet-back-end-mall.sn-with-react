const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const ATLAS_URI = process.env.MONGODB_URI;

const categoriesData = [
  { categoryName: "Électronique" },
  { categoryName: "Informatique" },
  { categoryName: "Cosmétique" },
  { categoryName: "Électroménager" }
];

const productsData = [
  {
    productName: "Casque sans fil Premium",
    productDescription: "Son clair, design léger et autonomie longue durée.",
    productPrice: 45000,
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    productRef: "CASQUE-PREMIUM",
    stock: { quantityAvailable: 50, quantitySold: 0 },
    categoryName: "Électronique"
  },
  {
    productName: "Ordinateur portable Pro",
    productDescription: "Puissance optimisée pour le travail et la création.",
    productPrice: 550000,
    productImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
    productRef: "LAPTOP-PRO",
    stock: { quantityAvailable: 20, quantitySold: 0 },
    categoryName: "Informatique"
  },
  {
    productName: "Palette maquillage Luxe",
    productDescription: "Couleurs riches et tenue longue durée pour un look parfait.",
    productPrice: 25000,
    productImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
    productRef: "MAKEUP-LUXE",
    stock: { quantityAvailable: 100, quantitySold: 0 },
    categoryName: "Cosmétique"
  },
  {
    productName: "Robot ménager Intelligent",
    productDescription: "Préparez vos repas rapidement avec des performances fiables.",
    productPrice: 85000,
    productImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
    productRef: "ROBOT-SMART",
    stock: { quantityAvailable: 15, quantitySold: 0 },
    categoryName: "Électroménager"
  }
];

async function seed() {
  try {
    console.log("Connexion à MongoDB Atlas...");
    await mongoose.connect(ATLAS_URI);
    console.log("Connecté.");

    const Category = mongoose.model('category', new mongoose.Schema({
      categoryName: String
    }, { collection: 'categories' }));

    const Product = mongoose.model('product', new mongoose.Schema({
      productName: String,
      productDescription: String,
      productPrice: Number,
      productImage: String,
      productRef: String,
      stock: {
        quantityAvailable: Number,
        quantitySold: Number
      },
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
      }
    }, { collection: 'products' }));

    console.log("Nettoyage des collections...");
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log("Insertion des catégories...");
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`${createdCategories.length} catégories insérées.`);

    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.categoryName] = cat._id;
    });

    console.log("Insertion des produits...");
    const productsToInsert = productsData.map(p => {
      const { categoryName, ...productInfo } = p;
      return {
        ...productInfo,
        categoryId: categoryMap[categoryName]
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`${createdProducts.length} produits insérés.`);

    console.log("\nVoici les nouveaux IDs à utiliser dans le frontend (Home_new.js) :");
    createdProducts.forEach(p => {
      console.log(`${p.productName}: ${p._id}`);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Erreur:", error);
    process.exit(1);
  }
}

seed();
