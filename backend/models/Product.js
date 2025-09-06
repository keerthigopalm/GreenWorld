import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  category: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  image: {
    type: String // URL of product image
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Product", productSchema);
