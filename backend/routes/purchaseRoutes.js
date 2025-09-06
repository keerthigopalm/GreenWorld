import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/oidcAuth.js";
import { createPurchase, getMyPurchases, getAllPurchases, validatePurchase } from "../controllers/purchaseController.js";

const router = express.Router();

router.post("/", requireAuth, validatePurchase, createPurchase);
router.get("/mine", requireAuth, getMyPurchases);
router.get("/", requireAuth, requireAdmin, getAllPurchases); // optional admin

export default router;
