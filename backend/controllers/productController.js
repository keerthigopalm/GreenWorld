import Product from "../models/Product.js";
import { v4 as uuidv4 } from "uuid";

// Add new product (Admin)
export const addProduct = async (req, res) => {
  const { name, description, category, price, stock, image } = req.body;

  try {
    const product = new Product({
      productID: uuidv4(),
      name,
      description,
      category,
      price,
      stock,
      image
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product by productID
export const getProductByID = async (req, res) => {
  try {
    const product = await Product.findOne({ productID: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ productID: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ productID: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
