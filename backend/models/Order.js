import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    default: uuidv4,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // Make it optional for testing
  },
  items: [
    {
      productID: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Card", "PayPal"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  stripePaymentIntentID: {
    type: String // store Stripe paymentIntent ID for card payments
  },
  paypalOrderID: {
    type: String // store PayPal order ID
  },
  paypalCaptureID: {
    type: String // store PayPal capture ID
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  shippingInfo: {
    deliveryDate: { type: String },
    deliveryTime: { type: String }
  }
});

export default mongoose.model("Order", orderSchema);
