const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// URIs
const LOCAL_URI = "mongodb://localhost:27017/AppMallsndatabase"; // URI par défaut de Compass
const ATLAS_URI = process.env.MONGODB_URI;

if (!ATLAS_URI) {
  console.error("Erreur: MONGODB_URI n'est pas défini dans le fichier .env");
  process.exit(1);
}

async function migrate() {
  let localConn, atlasConn;

  try {
    console.log("--- Début de la migration ---");

    // 1. Connexion au MongoDB local (Compass)
    console.log("Connexion au MongoDB local...");
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log("Connecté au MongoDB local.");

    // 2. Connexion à MongoDB Atlas
    console.log("Connexion à MongoDB Atlas...");
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log("Connecté à MongoDB Atlas.");

    // 3. Lister les collections à migrer
    const collections = await localConn.db.listCollections().toArray();
    console.log(`Trouvé ${collections.length} collections à migrer.`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith("system.")) continue; // Ignorer les collections système

      console.log(`Migration de la collection : ${colName}...`);

      const localCol = localConn.db.collection(colName);
      const atlasCol = atlasConn.db.collection(colName);

      // Récupérer toutes les données locales
      const data = await localCol.find({}).toArray();

      if (data.length > 0) {
        // Nettoyer la collection de destination avant (optionnel, mais plus propre pour une migration totale)
        await atlasCol.deleteMany({});
        
        // Insérer les données dans Atlas
        await atlasCol.insertMany(data);
        console.log(`  -> ${data.length} documents migrés pour ${colName}.`);
      } else {
        console.log(`  -> Collection ${colName} vide, migration ignorée.`);
      }
    }

    console.log("--- Migration terminée avec succès ! ---");
  } catch (error) {
    console.error("Erreur pendant la migration :", error);
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
    process.exit(0);
  }
}

migrate();
