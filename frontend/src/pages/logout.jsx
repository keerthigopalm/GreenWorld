import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user token/session
    localStorage.removeItem("token");  // change to "userInfo" or "authToken" if that's your key
    localStorage.removeItem("user");   // optional, if you stored user details

    // If you have a backend logout endpoint, you can call it here:
    // await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-lg font-semibold">Logging you out...</h2>
    </div>
  );
}
