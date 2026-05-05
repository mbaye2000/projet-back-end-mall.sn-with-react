const nodemailer = require("nodemailer");

const sendOrderNotification = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Mall SN Notification" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouvelle commande reçue - Réf: ${order.refOrder}`,
      html: `
        <h2>Nouvelle commande reçue sur Mall SN</h2>
        <p><strong>Référence :</strong> ${order.refOrder}</p>
        <p><strong>Client :</strong> ${order.user.guest.fullname}</p>
        <p><strong>Email :</strong> ${order.user.guest.email}</p>
        <p><strong>Téléphone :</strong> ${order.user.guest.phone}</p>
        <p><strong>Adresse :</strong> ${order.shippingAddress}</p>
        <p><strong>Méthode de paiement :</strong> ${order.paymentMethod}</p>
        <p><strong>Statut :</strong> ${order.status}</p>
        <br/>
        <h3>Actions :</h3>
        <p>Vous pouvez confirmer ou annuler cette commande depuis votre tableau de bord administrateur.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email de notification envoyé: " + info.response);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de notification:", error);
    return false;
  }
};

module.exports = { sendOrderNotification };
