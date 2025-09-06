import express from "express";
import {
  addProduct,
  getProducts,
  getProductByID,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductByID);

// Admin routes
router.post("/", protect, admin, addProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
