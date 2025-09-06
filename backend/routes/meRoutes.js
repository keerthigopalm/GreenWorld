import express from "express";
import { requireAuth } from "../middlewares/oidcAuth.js";

const router = express.Router();

router.get("/me", requireAuth, (req, res) => {
  const profile = {
    username: req.user.username,
    name: req.user.name,
    email: req.user.email,
    country: req.user.country,
    sub: req.user.sub,
  };
  res.json(profile);
});

export default router;
