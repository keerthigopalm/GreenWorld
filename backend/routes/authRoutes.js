// backend/routes/authRoutes.js
import express from "express";
import passport from "../config/passport.js";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { registerUser, loginUser, me } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

// —— Rate limit auth endpoints (OWASP A10) ——
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
router.use(authLimiter);

// —— Local register/login (simplified validation) ——
router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/me", protect, me);

// —— Google OAuth ——
// Start login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role, userID: req.user.userID, fullName: req.user.fullName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    // Redirect back to frontend with token (OWASP: no token in fragment to keep it simple in your app)
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success?token=${encodeURIComponent(token)}`);
  }
);

// Optional: logout (frontends usually just delete token)
router.post("/logout", (_req, res) => res.status(200).json({ message: "Logged out" }));

export default router;
