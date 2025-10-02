// Script to create an admin user
// Run this with: node create-admin-user.js

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/greenworld");
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@greenworld.com" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const adminUser = new User({
      fullName: "Admin User",
      email: "admin@greenworld.com",
      password: hashedPassword,
      role: "admin",
      phoneNumber: "1234567890",
      address: {
        street: "Admin Street",
        city: "Admin City",
        state: "Admin State",
        postalCode: "12345",
        country: "Admin Country"
      }
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@greenworld.com");
    console.log("Password: admin123");
    console.log("Role: admin");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

createAdminUser();
