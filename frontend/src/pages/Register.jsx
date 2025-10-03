import React, { useState } from "react";
import axios from "axios";

const Register = () => {                // Define Register component
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    role: "customer",
    profilePicture: null,
  });

   // Store success/error message from backend
  const [message, setMessage] = useState("");

  // Input validation (OWASP A03:2021 Injection, A05:2021 Security Misconfig)
  const validateInput = () => {
    if (!formData.fullName.trim()) return "Full name required";     // check empty name
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Invalid email format";      // check valid email 
    if (formData.password.length < 8) return "Password must be 8+ characters";      // password length
    if (formData.phoneNumber && !/^\d{9,10}$/.test(formData.phoneNumber)) {
      return "Phone number must be digits only (9–10 length)";         // check phone validity
    }
    return null;      // no errors
  };

   // Handle input change for both text and file inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });    // if file uploaded
    } else {
      setFormData({ ...formData, [name]: value });    // if text entered
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();   // prevent default browser form submit (page reload)

    // Prevent XSS & Injection before sending
    const error = validateInput();
    if (error) {
      setMessage(error);   // show validation message
      return;
    }

    try {
      // Send JSON data instead of FormData
      const data = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        role: formData.role
      };

      // Send POST request to backend for registration with JSON headers
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/register`,   // backend API endpoint
        data,
        {
          headers: {
            "Content-Type": "application/json",  // sending JSON
          },
          withCredentials: true,    // allow cookies/auth headers
        }
      );

       // If backend returns a token → store it in localStorage
      if (res.data.token) {
        // Store token in localStorage
        localStorage.setItem("jwtToken", res.data.token);
        setMessage("Registration successful! Redirecting...");
        // Redirect to home page after successful registration(2 second)
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage("Registration successful!");
      }
    } catch (err) {
      console.error("Registration error:", err);

       // Show backend error or fallback message
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.map(e => e.msg).join(", ") ||
                          "Error during registration";
      setMessage(errorMessage);
    }
  };

   // JSX UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
       {/* Registration form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-green-700">Register</h2>

        {/* Input fields */}
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password (min 8 chars)"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <h3 className="font-semibold mt-2">Address</h3>
        <input
          type="text"
          name="street"
          placeholder="Street"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          onChange={handleChange}
          className="border p-2 w-full mb-2"
        />

        <label className="block mb-2">Profile Picture</label>
        <input
          type="file"
          name="profilePicture"
          accept="image/*"
          onChange={handleChange}
          className="mb-4"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Register
        </button>

        {/* Show error/success messages */}
        {message && (
          <p className="mt-3 text-sm text-red-500 font-semibold">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Register;    // Export Register component
