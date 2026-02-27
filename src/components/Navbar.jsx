import {
  Link,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  User,
  Activity,
  Camera,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2"
        >
          <Activity className="text-primary" />
          YogaPose AI
        </Link>

        <div className="flex items-center gap-6">
          {user ?
            <>
              <Link
                to="/dashboard"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <User size={18} /> Dashboard
              </Link>
              <Link
                to="/pose-selection"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Camera size={18} /> Start Session
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 flex items-center gap-2 transition-colors"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          : <>
              <Link
                to="/login"
                className="hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
              >
                Register
              </Link>
            </>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
