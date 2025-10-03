import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { CartProvider } from "./context/CartContext";  // ✅ import CartProvider

// Create a root for React rendering inside the HTML DOM element with id="root"
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the React app inside that root
root.render(

  // StrictMode is a React tool that helps find potential problems during development
  <React.StrictMode>

    {/* ✅ Wrap App with CartProvider */}
    <CartProvider>

       {/* Main App component where all routes and UI start */}
      <App />

    </CartProvider>
  </React.StrictMode>
);

// Performance tracking (optional) - measures app performance, logs results, or sends to analytics
reportWebVitals();
