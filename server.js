const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Charger les variables d'environnement
require("dotenv").config();

// Import connexion DB
const connectDB = require("./config/db");

// Import routes
const userRoutes = require("./routes/routes");

// Initialisation app
const app = express();

// Port (Render fournit automatiquement PORT)
const PORT = process.env.PORT || 10000;

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);

// Route test
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Ping test
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Routes principales
app.use("/api", userRoutes);

// Démarrage serveur après connexion DB
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
