import express from "express";

const router = express.Router();

// Webhook endpoint (currently not used, but can be extended for PayPal webhooks)
router.post("/", (req, res) => {
  res.json({ message: "Webhook endpoint ready" });
});

export default router;
