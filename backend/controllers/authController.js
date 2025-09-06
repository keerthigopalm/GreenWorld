// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ fixed path

const signJwt = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      userID: user.userID,
      fullName: user.fullName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    console.log("Registration request body:", req.body);
    
    const {
      fullName,
      email,
      password,
      phoneNumber,
      street,
      city,
      state,
      postalCode,
      country,
      role, // optional (default customer)
      profilePicture,
    } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "fullName, email, password are required" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);

    // Build address object from individual fields
    const address = {
      street: street || "",
      city: city || "",
      state: state || "",
      postalCode: postalCode || "",
      country: country || ""
    };

    // Create user
    const user = await User.create({
      fullName,
      email,
      password: hash,
      phoneNumber: phoneNumber || "",
      address,
      role: role === "admin" ? "admin" : "customer",
      profilePicture: profilePicture || "",
      oauthProvider: null,
    });

    console.log("User created successfully:", user.email);

    const token = signJwt(user);
    return res.status(201).json({
      token,
      user: {
        userID: user.userID,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    console.error("Registration error:", e);
    return res.status(500).json({ message: "Registration failed: " + e.message });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Avoid user enumeration (OWASP A07)
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signJwt(user);
    return res.json({
      token,
      user: {
        userID: user.userID,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: user.role,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    return res.status(500).json({ message: "Login failed" });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  return res.json({ user: req.user });
};
