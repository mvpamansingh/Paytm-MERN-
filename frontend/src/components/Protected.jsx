import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check if the user is authenticated
  const token = localStorage.getItem("token");
  
  if (!token) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signup" />;
  }
  
  return children;
}

export { ProtectedRoute };