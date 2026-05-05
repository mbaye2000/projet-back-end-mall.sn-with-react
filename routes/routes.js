const router = require("express").Router();

// CONTROLLERS
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { createContact } = require("../controllers/contactController");
const { registerUser, loginUser } = require("../controllers/auth");
const { createPayment } = require("../controllers/paymentController");

// ================== AUTH ==================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================== PAYMENT ==================
router.post("/payment/create", createPayment);

// ================== CATEGORIES ==================
router.post("/categories", createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// ================== PRODUCTS ==================
router.post("/products", createProduct);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// ================== ORDERS ==================
router.post("/orders", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id", updateOrder);
router.patch("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

// ================== CONTACT ==================
router.post("/contact", createContact);

module.exports = router;
