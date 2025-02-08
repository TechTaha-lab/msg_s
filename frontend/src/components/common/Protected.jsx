import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("userInfo")) || null;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage", error);
  }

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
