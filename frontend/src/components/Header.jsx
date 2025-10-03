import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import api from "../api/api";

export default function Header() {
  const { cart } = useCart(); // Get cart from context
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userLoading, setUserLoading] = useState(false);

  // Check login status and user role
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("jwtToken");
      const loggedIn = !!token;
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        setUserLoading(true);
        try {
          // Fetch user info to check if admin
          const response = await api.get("/auth/me");
          const user = response.data.user;
          setIsAdmin(user.role === "admin");
        } catch (error) {
          console.error("Error fetching user info:", error);
          setIsAdmin(false);
          // If token is invalid, clear it
          localStorage.removeItem("jwtToken");
          setIsLoggedIn(false);
        } finally {
          setUserLoading(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkLoginStatus();
    
    // Listen for storage changes (when login/logout happens in other tabs)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken"); // clear token
    setIsLoggedIn(false); // update state immediately
    setIsAdmin(false); // clear admin status
    navigate("/login"); // redirect to login
  };

  return (
    <header className="bg-green-700 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">🌱 GreenWorld</h1>
      <nav className="flex items-center">
        <Link to="/" className="mr-4 hover:underline">
          Home
        </Link>

        {!isLoggedIn && (
          <>
            <Link to="/login" className="mr-4 hover:underline">
              Login
            </Link>
            <Link to="/register" className="mr-4 hover:underline">
              Register
            </Link>
          </>
        )}

        {isLoggedIn && (
          <>
            <Link to="/orders" className="mr-4 hover:underline">
              My Orders
            </Link>
            
            {/* Admin Dashboard Link - Only visible to admin users */}
            {isAdmin && (
              <Link 
                to="/admin" 
                className="mr-4 bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded transition-colors font-medium"
              >
                🛠️ Dashboard
              </Link>
            )}
            
            
            
            <button
              onClick={handleLogout}
              className="mr-4 bg-red-500 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}

        {/* Cart Link with item count */}
        <Link to="/cart" className="ml-4 text-2xl relative">
          🛒
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
