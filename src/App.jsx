import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";
import Layout, { ProtectedRoute } from "./Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PoseSelection from "./pages/PoseSelection";
import CameraPage from "./pages/CameraPage";
import { AnimatePresence } from "framer-motion";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route
          path="/"
          element={
            user ?
              <Navigate to="/dashboard" />
            : <Landing />
          }
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/pose-selection"
              element={<PoseSelection />}
            />
            <Route
              path="/camera/:poseId"
              element={<CameraPage />}
            />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
