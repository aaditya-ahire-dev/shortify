import { Navigate , Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("user")
  console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet/> ;
};

export const AdminProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("Admin");

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet/>  ;
};
