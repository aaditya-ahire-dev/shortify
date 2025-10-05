import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupPage from "./pages/signupPage";
// import Navbar from './components/Navbar'
import LoginPage from "./pages/loginPage";
import AppLayout from "./pages/AppLayout";
import HomePage from "./pages/HomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSignUpPage from "./pages/AdminSignUpPage";
import AdminHomePage from "./pages/AdminHomePage";
import {
  ProtectedRoute,
  AdminProtectedRoute,
} from "./components/ProtectedRoutes";
function App() {
  const router = createBrowserRouter([
    // --- Standalone Authentication Routes ---
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    // Admin Login is now a standalone, unprotected route
    {
      path: "/admin/login",
      element: <AdminLoginPage />,
    },
    {
      path: "/admin/signup",
      element: <AdminSignUpPage />,
    },
    // --- Main User-Facing Routes ---
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/",
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <HomePage />,
            },
          ],
        },
      ],
    },
    // admin Protected routes
    {
      path: "/admin",
      element: <AdminProtectedRoute />,
      children: [
        {
          path: "/admin/dashboard",
          element: <AppLayout />,
          children: [
            {
             index: true,
              element: <AdminHomePage />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
