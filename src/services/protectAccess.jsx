
import { jwtDecode } from "jwt-decode";  
import { Navigate } from "react-router-dom";

function isAccess(roles) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return roles.includes(decoded.role);
  } catch {
    return false;
  }
}

function ProtectedAccess({ children ,role}) {
  const tokenValid = isAccess(role);
  if (!tokenValid) return <Navigate to="/login" />;
  return children;
}

export default ProtectedAccess;

