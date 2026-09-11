import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";

async function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("ProtectedRoute: No token found in localStorage");
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp <= currentTime) {
      console.warn("ProtectedRoute: Token has expired at", new Date(decoded.exp * 1000));
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      return false;
    }

    return true;
  } catch (err) {
    console.error("ProtectedRoute: jwtDecode error (invalid token structure)", err);
    return false;
  }
}

function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const valid = await isTokenValid();
      setIsValid(valid);
    };
    checkToken();
  }, []);

  if (isValid === null) return <div>Checking authentication...</div>;
  if (!isValid) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;