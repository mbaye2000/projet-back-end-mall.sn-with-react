const jwt = require("jsonwebtoken");

//middleware pour verifier le token d'authentification
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "token d'authentification manquant" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("erreur lors de la verification du token", error);
    return res
      .status(403)
      .json({ message: "token d'authentification invalide" });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé, administrateur requis" });
  }
  next();
};

module.exports = { authorization: authMiddleware, adminOnly };
