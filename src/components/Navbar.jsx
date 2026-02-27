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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const NavLinks = ({ mobile = false }) => (
    <div
      className={
        mobile ?
          "flex flex-col gap-6 p-8"
        : "flex items-center gap-8"
      }
    >
      {user ?
        <>
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium hover:text-primary transition-all flex items-center gap-2"
          >
            <User size={16} /> Dashboard
          </Link>
          <Link
            to="/pose-selection"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium hover:text-primary transition-all flex items-center gap-2"
          >
            <Camera size={16} /> Start Session
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-400/80 hover:text-red-400 flex items-center gap-2 transition-all text-left"
          >
            <LogOut size={16} /> Logout
          </button>
        </>
      : <>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="text-sm font-medium hover:text-primary transition-all"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className="btn-primary py-2 px-6 rounded-xl text-sm"
          >
            Join Now
          </Link>
        </>
      }
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="mx-6 my-4">
        <div className="glass-card rounded-2xl md:rounded-3xl border-white/5 bg-dark-soft/40 backdrop-blur-2xl">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-white flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Activity
                  size={22}
                  className="animate-pulse"
                />
              </div>
              <span className="hidden sm:inline">
                YogaPose AI
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <NavLinks />
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ?
                <X size={20} />
              : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden border-t border-white/5"
              >
                <NavLinks mobile />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
