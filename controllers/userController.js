const User = require("../models/userModel");

//controller pour creer un nouvel utilisateur
const createUser = async (req, res) => {
  try {
    const { fullname, addresse, email, age, phone, password } = req.body;
    const newUser = await User.create({
      fullname,
      addresse,
      email,
      age,
      phone,
      password,
    });
    return res
      .status(201)
      .json({ message: "user created successfully", user: newUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error creating user", error: error.message });
  }
};

// exportation  des fontion du controller
module.exports = { createUser };
