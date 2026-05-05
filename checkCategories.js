const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkCategories() {
  try {
    console.log("Connexion à MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connecté.");

    const Category = mongoose.model('category', new mongoose.Schema({
      categoryName: String
    }, { collection: 'categories' }));

    const count = await Category.countDocuments();
    console.log(`Nombre de catégories trouvées: ${count}`);

    if (count > 0) {
      const categories = await Category.find({});
      categories.forEach(c => {
        console.log(`- ${c.categoryName}: ${c._id}`);
      });
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error("Erreur:", error);
  }
}

checkCategories();
