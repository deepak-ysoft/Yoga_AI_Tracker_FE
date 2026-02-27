import {
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

export const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!token) return <Navigate to="/login" />;

  return <Outlet />;
};

const Layout = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-12">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
