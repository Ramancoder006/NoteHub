import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import BrowseNotes from "./pages/BrowseNotes";
import UploadNotes from "./pages/UploadNotes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/notes"
          element={<BrowseNotes />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* PROTECTED UPLOAD ROUTE */}

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadNotes />
            </ProtectedRoute>
          }
        />

        {/* PROTECTED DASHBOARD ROUTE */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* UNKNOWN URL */}

        <Route
          path="*"
          element={
            <div
              style={{
                textAlign: "center",
                padding: "80px",
              }}
            >
              <h1>404</h1>
              <p>Page not found.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;