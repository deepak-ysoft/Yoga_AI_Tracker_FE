import { useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogIn,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to login",
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen flex items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -z-10" />

        <div className="glass-card p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">
              Welcome Back
            </h2>
            <p className="text-gray-400">
              Login to your yoga journey
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full group"
            >
              <LogIn size={20} />
              Sign In
              <ArrowRight
                size={18}
                className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
              />
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            New here?{" "}
            <Link
              to="/register"
              className="text-primary hover:text-primary-light font-bold transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
