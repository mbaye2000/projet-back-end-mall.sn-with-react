const axios = require('axios');

const createPayment = async (req, res) => {
  try {
    const { amount, itemName, successUrl, cancelUrl, refOrder } = req.body;

    if (!amount || !itemName) {
      return res.status(400).json({ message: "Montant et nom de l'article requis" });
    }

    const paytechData = {
      item_name: itemName,
      item_price: amount,
      currency: "XOF",
      ref_command: refOrder || `CMD_${Date.now()}`,
      command_name: `Paiement pour ${itemName}`,
      env: "test",
      success_url: successUrl || `${process.env.FRONTEND_URL}/success`,
      cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/cancel`,
    };

    const response = await axios.post(
      "https://paytech.sn/api/payment/request-payment",
      paytechData,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          API_KEY: process.env.PAYTECH_API_KEY,
          API_SECRET: process.env.PAYTECH_SECRET_KEY,
        },
      }
    );

    if (response.data && response.data.success === 1) {
      return res.status(200).json({
        success: true,
        redirect_url: response.data.redirect_url,
        token: response.data.token
      });
    } else {
      console.error("Erreur PayTech API:", response.data);
      return res.status(400).json({
        success: false,
        message: response.data.errors ? response.data.errors[0] : "Erreur lors de la création du paiement"
      });
    }
  } catch (error) {
    console.error("Erreur Serveur Payment:", error.message);
    return res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'initialisation du paiement",
      error: error.message
    });
  }
};

module.exports = { createPayment };
