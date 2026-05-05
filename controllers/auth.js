const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 générer token JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { fullname, address, email, age, phone, password, role } = req.body;

    // vérifier si utilisateur existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "l'utilisateur existe deja",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // créer utilisateur
    const newUser = await User.create({
      fullname,
      address,
      email,
      age: Number(age),
      phone,
      password: hashedPassword,
      role: role || "client",
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: "utilisateur cree avec succes",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Erreur register:", error);
    
    // Si c'est une erreur de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: "Erreur de validation",
        errors: messages
      });
    }

    return res.status(500).json({
      message: "erreur serveur",
      error: error.message
    });
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // vérifier user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // comparer password
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect",
      });
    }

    // générer token
    const token = generateToken(existingUser);

    return res.status(200).json({
      message: "connexion reussie",
      token,
      user: existingUser,
    });
  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(500).json({
      message: "erreur serveur",
    });
  }
};

// export
module.exports = { registerUser, loginUser };
