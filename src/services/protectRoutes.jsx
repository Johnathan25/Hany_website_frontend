import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api";

async function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp <= currentTime) {
      // const res = await api.post("/users/refresh-token");
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      return false;

    }

    return true;
  } catch {
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
  if (!isValid) return <Navigate to="/تسجيل_الدخول" replace />;

  return children;
}

export default ProtectedRoute;