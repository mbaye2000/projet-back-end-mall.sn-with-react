const Contact = require("../models/contactModel.js");

const createContact = async (req, res) => {
  try {
    const { fullname, address, email, message } = req.body;

    if (!fullname || !address || !email || !message) {
      return res
        .status(400)
        .json({ message: "Tous les champs du formulaire sont requis" });
    }

    const newContact = await Contact.create({
      fullname,
      address,
      email,
      message,
    });

    return res.status(201).json({
      message: "Message de contact enregistré avec succès",
      contact: newContact,
    });
  } catch (error) {
    console.error("Erreur contact:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { createContact };
