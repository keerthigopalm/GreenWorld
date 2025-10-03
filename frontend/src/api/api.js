// Import axios library for making HTTP requests
import axios from "axios";

// Create a reusable axios instance with a base URL (backend API root)
const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend server address
});

// Add JWT token automatically
// Interceptor → runs before every request made with this API instance
API.interceptors.request.use((req) => {

  // Get JWT token from localStorage (if user is logged in)
  const token = localStorage.getItem("jwtToken");

  // If token exists, attach it to request headers as Authorization Bearer token
  if (token) req.headers.Authorization = `Bearer ${token}`;
  
  // Return the modified request so it can be sent
  return req;
});

// Export the configured axios instance so other files can import and use it
export default API;





//Creates an Axios instance with a fixed base URL
//Automatically attaches JWT token to every request (if available)