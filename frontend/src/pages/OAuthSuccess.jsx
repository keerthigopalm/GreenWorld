// src/pages/OAuthSuccess.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      // SPA token approach
      localStorage.setItem("token", token);
      alert("✅ OAuth Login Successful! Token stored locally.");
      navigate("/", { replace: true });
    } else {
      // Assume backend set httpOnly cookie
      alert("✅ OAuth Login Successful via secure cookie!");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Logging you in...</h1>
      <p>Please wait while we sign you in.</p>
    </div>
  );
}
