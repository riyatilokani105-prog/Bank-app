import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // If token exists, allow access
  if (token) {
    return children;
  }

  // Only redirect when token is actually missing
  return <Navigate to="/" replace />;
};

export default PrivateRoute;