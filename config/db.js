const mongoose = require("mongoose");

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined. Vérifie ton fichier .env.");
  process.exit(1);
}

// connexion à la base de données MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("connected to MongoDB");
  } catch (err) {
    console.error("error connecting to MongoDB:", err.message);
    throw err;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

module.exports = connectDB;
