// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import OAuthSuccess from "./pages/OAuthSuccess";
import Logout from "./pages/logout";
// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";

function App() {
  return (

     // Provides global cart state (so all components can access cart data without props)
    <CartProvider>


      <PayPalScriptProvider
        options={{
          "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID || "test",
          currency: "USD",
          intent: "capture",
        }}
      >
         {/* Router handles navigation without reloading the page */}
        <Router>
          <Header />

          {/* Main container for page content with Tailwind classes for styling */}
          <main className="min-h-screen container mx-auto px-4 py-6">

            {/* Define all application routes */}
            <Routes>
              {/* Public routes (accessible without login)*/}
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductPage />} />

              {/* Shopping flow */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/logout" element={<Logout />} />

              {/* Admin - Protected Routes */}
              <Route 
                path="/admin" 
                element={

                  // ProtectedRoute ensures only admins can access
                  <ProtectedRoute requireAdmin={true}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/products" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Products />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminOrders />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Users />
                  </ProtectedRoute>
                } 
              />

              {/* TODO: Add NotFound page for invalid routes */}
            </Routes>
          </main>

          <Footer />
        </Router>
      </PayPalScriptProvider>
    </CartProvider>
  );
}

export default App;// Export App so index.js can render it
