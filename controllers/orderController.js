const mongoose = require("mongoose");
const order = require("../models/orderModel.js");
const product = require("../models/productModel.js");
const axios = require("axios");
const { sendOrderNotification } = require("./emailService.js");

//controller pour creer une commande
const createOrder = async (req, res) => {
  const refOrder = `ORD-${Date.now()}`;
  try {
    const { user, products, shippingAddress, paymentMethod, totalPrice: frontendTotalPrice } = req.body;

    console.log("--- NOUVELLE COMMANDE ---");
    console.log("Body reçu:", JSON.stringify(req.body, null, 2));

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Aucun produit n'a été sélectionné" });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Adresse de livraison et méthode de paiement requises" });
    }

    if (!user || !user.guest || !user.guest.fullname || !user.guest.email) {
      return res.status(400).json({ message: "Informations client (nom et email) incomplètes" });
    }

    let calculatedTotalPrice = 0;
    const updatedProducts = [];

    for (const item of products) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) {
        console.error(`ID de produit invalide: ${item.productId}`);
        return res.status(400).json({
          message: `ID de produit invalide : ${item.productId}. Veuillez sélectionner un produit valide du catalogue.`,
        });
      }

      const productData = await product.findById(item.productId);
      if (!productData) {
        console.error(`Produit non trouvé: ${item.productId}`);
        return res.status(404).json({
          message: `Produit avec l'ID ${item.productId} non trouvé. Il a peut-être été supprimé.`,
        });
      }

      const available = productData.stock?.quantityAvailable ?? 0;
      if (item.quantity > available) {
        return res.status(400).json({
          message: `Quantité demandée (${item.quantity}) supérieure au stock disponible (${available}) pour ${productData.productName}`,
        });
      }

      const itemPrice = productData.productPrice || 0;
      calculatedTotalPrice += itemPrice * item.quantity;
      updatedProducts.push({ productData, quantity: item.quantity });
    }

    // Utiliser le prix du frontend s'il est cohérent, sinon le prix calculé
    const finalTotalPrice = frontendTotalPrice || calculatedTotalPrice;

    console.log(`Prix calculé: ${calculatedTotalPrice}, Prix frontend: ${frontendTotalPrice}, Final: ${finalTotalPrice}`);

    const newOrder = await order.create({
      refOrder,
      user,
      products,
      totalPrice: finalTotalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
    });

    // Mise à jour du stock
    for (const item of updatedProducts) {
      const currentStock = item.productData.stock || { quantityAvailable: 0, quantitySold: 0 };
      await product.findByIdAndUpdate(item.productData._id, {
        stock: {
          quantityAvailable: Math.max(0, (currentStock.quantityAvailable || 0) - item.quantity),
          quantitySold: (currentStock.quantitySold ?? 0) + item.quantity,
        },
      });
    }

    // Email notification
    try {
      await sendOrderNotification(newOrder);
    } catch (emailError) {
      console.error("Email notification failed:", emailError.message);
    }

    // PayTech Integration
    const mobileMoneyMethods = ["wave", "orange money", "freemoney"];
    if (mobileMoneyMethods.includes(paymentMethod.toLowerCase())) {
      try {
        const paytechData = {
          item_name: products.length > 1 ? `Commande ${refOrder} (${products.length} articles)` : `Achat ${updatedProducts[0].productData.productName}`,
          item_price: finalTotalPrice,
          currency: "XOF",
          ref_command: refOrder,
          command_name: `Paiement Mall SN - ${refOrder}`,
          env: "test",
          success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/success?ref=${refOrder}`,
          cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/order?ref=${refOrder}`,
        };

        const paytechResponse = await axios.post(
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

        if (paytechResponse.data && paytechResponse.data.success === 1) {
          return res.status(201).json({
            message: "Commande créée, redirection paiement...",
            order: newOrder,
            redirect_url: paytechResponse.data.redirect_url,
          });
        } else {
          console.error("PayTech API Error:", paytechResponse.data);
        }
      } catch (paytechError) {
        console.error("PayTech request failed:", paytechError.message);
      }
    }

    return res.status(201).json({ message: "Commande créée avec succès", order: newOrder });

  } catch (error) {
    console.error("ERREUR CRÉATION COMMANDE:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Erreur de validation des données", errors: messages });
    }
    return res.status(500).json({ message: "Erreur serveur lors de la commande", error: error.message });
  }
};

//controller pour recuperer une commande par son id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = await order
      .findById(id)
      .populate("products.productId")
      .populate("user.clientId");
    if (!orderData) {
      return res.status(404).json({ message: "commande non trouve" });
    }
    return res.status(200).json({
      ordemessage: "commande recuperee avec succes",
      order: orderData,
    });
  } catch (error) {
    console.error("erreur lors de la recuperation de la commande", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

//controller pour mettre a jour le status d'une commande
const updateOrder = async (req, res) => {
  //exemple de donnes pour creer une commande
  /*
    {
      "user": {
        "guest": {
          "fullname": "John Doe",
          
          "email": "    
        "phone": 1234567890
        },
        "clientId": "64a1f8c2e5b0c9a1b2c3d4e"
      },
      "products": [ 
        {
          "productId": "64a1f8c2e5b0c9a1b2c3d4e",
          "quantity": 2
        },
        {
          "productId": "64a1f8c2e5b0c9a1b2c3d4f",
            "quantity": 1
        }
      ],
      "totalPrice": 100,
        "orderStatus": "pending"
    }
    */
  try {
    const { id } = req.params;
    const { refOrder, user, products, totalPrice, orderStatus } = req.body;
    const updatedOrder = await order
      .findByIdAndUpdate(
        id,
        { refOrder, user, products, totalPrice, orderStatus },
        { new: true },
      )
      .populate("products.productId")
      .populate("user.clientId");
    if (!updatedOrder) {
      return res.status(404).json({ message: "commande non trouve" });
    }
    return res.status(200).json({
      message: "commande mise a jour avec succes",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("erreur lors de la mise a jour de la commande", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

//controller pour supprimer une commande
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "commande non trouve" });
    }
    return res.status(200).json({ message: "commande supprimee avec succes" });
  } catch (error) {
    console.error("erreur lors de la suppression de la commande", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

// controller pour recuperer toutes les commandes
const getAllOrders = async (req, res) => {
  try {
    const orders = await order
      .find()
      .populate("products.productId")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    console.error("erreur lors de la recuperation des commandes", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

// controller pour mettre a jour le statut d'une commande (ex: expediee, annulee)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;
    
    if (!["pending", "shipped", "deliverd", "canceled"].includes(orderStatus)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const updatedOrder = await order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    ).populate("products.productId");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    return res.status(200).json({
      message: `Statut de la commande mis à jour : ${orderStatus}`,
      order: updatedOrder
    });
  } catch (error) {
    console.error("erreur lors de la mise a jour du statut", error);
    return res.status(500).json({ message: "erreur serveur" });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
};
