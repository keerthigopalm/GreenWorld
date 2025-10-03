import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Export Login component (default export so it can be used in App routes)
export default function Login() {

  const [email, setEmail] = useState("");                    // State to store email input value
  const [password, setPassword] = useState("");              // State to store password input value
  const [showPassword, setShowPassword] = useState(false);    // State to toggle between showing password as text or dots 

  const navigate = useNavigate();             // Hook for programmatic navigation (redirect after login)

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();          // Prevent default form refresh behavior
    try {

      // Send login request to backend API with email & password
      const res = await api.post("/auth/login", { email, password });

      // ✅ Save token in localStorage to persist user authentication
      localStorage.setItem("jwtToken", res.data.token);

      alert("Login success!");

      // Trigger a custom event to notify header of login
      window.dispatchEvent(new Event('storage'));
      navigate("/"); // ✅ redirect to home after login
    } catch (err) {
      console.error(err);

      // Show friendly error message if login fails
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      alert(errorMessage);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      {/* Page title */}
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {/* Login form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="email"
          placeholder="Email"
          className="p-2 border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input with show/hide toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 border w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
           {/* Button to toggle password visibility */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
               // Eye-slash icon → password visible
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              // Eye icon → password hidden
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

         {/* Submit button for login */}
        <button className="bg-green-700 text-white py-2 rounded hover:bg-green-800">
          Login
        </button>
      </form>

       {/* Google OAuth login button */}
      <a
        className="inline-flex items-center px-4 py-2 rounded bg-red-600 text-white font-medium mt-4"
        href={`${API_BASE}/auth/google`}
      >
        Continue with Google
      </a>
    </div>
  );
}
