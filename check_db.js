
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.ATLAS_URI);
    console.log('Connecté à MongoDB');
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const Product = mongoose.model('product', new mongoose.Schema({}, { strict: false }));
    const products = await Product.find({}).limit(5);
    
    console.log(`Nombre de produits trouvés: ${await Product.countDocuments()}`);
    if (products.length > 0) {
      console.log('Exemples de produits:');
      products.forEach(p => console.log(`- ${p.productName} (ID: ${p._id})`));
    } else {
      console.log('Aucun produit trouvé dans la collection "products".');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Erreur:', error);
  }
}

checkProducts();
