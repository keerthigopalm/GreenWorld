// src/pages/Home.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";


function Home() {

  // State to store list of products fetched from backend
  const [products, setProducts] = useState([]);

  // State to track loading spinner until products are fetched
  const [loading, setLoading] = useState(true);

  // State to keep track of which caption is currently displayed
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(0);

  // Get addToCart function from Cart context so products can be added to the cart
  const { addToCart } = useCart(); // ✅ use addToCart from context

  // Dynamic captions array to show in a rotating banner
  const captions = [
    "🌱 Happy hearts, happy plants, bringing joy to every home and glance.",
    "🌸 Grow happy, live happy — let your home bloom with nature's charm.",
    "🌿 From happy roots to happy shoots, our garden collection fills your home with cheer.",
    "🌼 Happy greenery, happy vibes — create a garden paradise right inside.",
    "🌻 Happy blooms, happy rooms — make every corner of your home a natural delight.",
    "🌱 Bring home happy leaves, happy flowers, and endless joy every hour.",
    "🌸 Happy plants, happy hearts — turn your home into a lush, thriving art."
  ];


  // Fetch products from backend API when component first mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {

        // Call backend API to get products
        const res = await axios.get("http://localhost:5000/api/products");
        
        // Store products in state
        setProducts(res.data);
      } catch (err) {

        // Log error if API fails
        console.error("Error fetching products:", err);
      } finally {
        // Stop showing loader whether success or error
        setLoading(false);
      }
    };
    fetchProducts();  // Trigger fetch
  }, []);   // Empty dependency → runs only once when page loads

  // Effect to cycle through captions automatically every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCaptionIndex((prevIndex) => 
        (prevIndex + 1) % captions.length
      );
    }, 4000); 

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [captions.length]);

  // Show loading spinner while products are being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🌱 Home Garden Collection</h1>
      
      {/* Dynamic Caption Section */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 shadow-sm border border-green-100">
          <p 
            key={currentCaptionIndex}  // Key changes when caption changes → triggers re-render
            className="text-lg md:text-xl text-green-800 font-medium transition-all duration-500 ease-in-out transform"
            style={{
              animation: 'fadeInUp 0.5s ease-in-out'  // Smooth fade-in animation
            }}
          >
            {captions[currentCaptionIndex]}
          </p>
        </div>
      </div>

      {/* If no products found, show message */}
      {products.length === 0 ? (
        <p className="text-gray-600 text-center">No plants available.</p>
      ) : (
        //  If no products found, show message
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;   // Export Home so it can be used in routes (App.js)
