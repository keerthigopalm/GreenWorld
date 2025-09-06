import express from "express";
import {
  createOrder,
  capturePayPalPayment,   
  getUserOrders,
  getAllOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ---------------------------------------------------
// Create new order (COD or PayPal)
// ---------------------------------------------------
// protect middleware ensures the user is logged in
router.post("/", protect, createOrder);

// ---------------------------------------------------
// Capture PayPal payment
// expects orderId as a param -> /api/orders/:orderId/capture
// ---------------------------------------------------
router.put("/:orderId/capture", protect, capturePayPalPayment);
// ---------------------------------------------------
// Get logged-in user's orders
// ---------------------------------------------------
router.get("/myorders", protect, getUserOrders);

// ---------------------------------------------------
// Admin: get all orders
// ---------------------------------------------------
router.get("/", protect, admin, getAllOrders);

export default router;
