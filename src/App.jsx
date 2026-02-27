import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout, { ProtectedRoute } from "./Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PoseSelection from "./pages/PoseSelection";
import CameraPage from "./pages/CameraPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
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
              <Route
                path="/"
                element={
                  <Navigate to="/dashboard" />
                }
              />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
