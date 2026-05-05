const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// chargement des variables d environnement
require("dotenv").config();

// import de la configuration de la base de donne
const connectDB = require("./config/db");

// importation des routes
const userRoutes = require("./routes/routes");

// Create an instance of the Express application
const app = express();

// creation d une port pour le serveur
const PORT = process.env.PORT || 5020;

//middleware pour parser le corps des requetes en json
app.use(morgan("dev"));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
  }),
);

//route de teste

app.get("/", (req, res) => {
  res.send("hello word");
});

// utilisation des routes
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));
app.use("/api", userRoutes);

// demarrage du serveur uniquement apres connexion a MongoDB
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
