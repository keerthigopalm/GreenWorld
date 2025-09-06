import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createPayPalOrder,
  capturePayPalPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

// PayPal routes
router.post("/paypal/create", protect, createPayPalOrder);
router.post("/paypal/capture", protect, capturePayPalPayment);

export default router;
