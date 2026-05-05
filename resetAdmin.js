const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("./models/userModel");

const resetAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      console.error("MONGODB_URI is not defined in .env");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "mbayemben05@gmail.com";
    const password = "Mbengue2026";
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      await existingUser.save();
      console.log(`Admin user updated: ${email}`);
    } else {
      await User.create({
        fullname: "Administrateur",
        address: "Dakar, Sénégal",
        email: email,
        age: 30,
        phone: 770000000,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Admin user created: ${email}`);
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error resetting admin:", error);
    process.exit(1);
  }
};

resetAdmin();
