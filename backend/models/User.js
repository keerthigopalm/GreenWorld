import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    default: uuidv4, // generates a unique UUID
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String // hashed before saving
  },
  phoneNumber: {
    type: String
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String // URL of uploaded image
  },
  oauthProvider: {
    type: String // e.g., "google", optional
  }
});



export default mongoose.model("User", userSchema);
