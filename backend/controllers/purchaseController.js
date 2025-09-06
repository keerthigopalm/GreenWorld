import Purchase from "../models/Purchase.js";
import sanitizeHtml from "sanitize-html";
import { body, validationResult } from "express-validator";
import Product from "../models/Product.js"; // assuming you have it

// Reusable validators (runs BEFORE handler)
export const validatePurchase = [
  body("productName").isString().trim().notEmpty(),
  body("quantity").isInt({ min: 1, max: 999 }),
  body("deliveryTime").isIn(["10:00", "11:00", "12:00"]),
  body("deliveryDistrict").isIn([
    "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya","Galle","Matara","Hambantota",
    "Jaffna","Kilinochchi","Mannar","Vavuniya","Mullaitivu","Batticaloa","Ampara","Trincomalee",
    "Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla","Monaragala","Ratnapura","Kegalle"
  ]),
  body("purchaseDate").isISO8601().toDate(),
  body("message").optional().isString().isLength({ max: 1000 }),
];

export const createPurchase = async (req, res) => {
  // Input validation (prevents injection/XSS)
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: "Validation error", errors: errors.array() });

  const { productName, quantity, message, purchaseDate, deliveryTime, deliveryDistrict } = req.body;

  // Business rules: date >= today and not Sunday
  const today = new Date(); today.setHours(0,0,0,0);
  const chosen = new Date(purchaseDate); chosen.setHours(0,0,0,0);
  if (chosen < today) return res.status(400).json({ message: "Purchase date must be today or later" });
  if (chosen.getDay() === 0) return res.status(400).json({ message: "No purchases on Sundays" });

  // Product must exist (prevents tampering)
  const product = await Product.findOne({ name: productName });
  if (!product) return res.status(400).json({ message: "Invalid product" });

  // Sanitize message (defense in depth for XSS)
  const cleanMessage = message ? sanitizeHtml(message, { allowedTags: [], allowedAttributes: {} }) : "";

  // Build record from IdP identity (NO trust in client for username/email)
  const purchase = new Purchase({
    userSub: req.user.sub,
    username: req.user.username || req.user.email,
    email: req.user.email,
    productName,
    quantity,
    message: cleanMessage,
    purchaseDate: chosen,
    deliveryTime,
    deliveryDistrict,
  });

  await purchase.save();
  return res.status(201).json(purchase);
};

// Only return current user's purchases (access control by token "sub")
export const getMyPurchases = async (req, res) => {
  const list = await Purchase.find({ userSub: req.user.sub }).sort({ createdAt: -1 });
  res.json(list);
};

// Admin-only view (optional)
export const getAllPurchases = async (_req, res) => {
  const list = await Purchase.find().sort({ createdAt: -1 });
  res.json(list);
};
