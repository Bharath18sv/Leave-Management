import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import useAuthStore from "./stores/authStore";

// Layout Components
import Navbar from "./components/Navbar";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import ApplyLeave from "./pages/employee/ApplyLeave";
import MyRequests from "./pages/employee/MyRequests";
import Profile from "./pages/employee/Profile";

// Manager Pages
import ManagerDashboard from "./pages/manager/Dashboard";
import PendingRequests from "./pages/manager/PendingRequests";
import AllRequests from "./pages/manager/AllRequests";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {isAuthenticated && <Navbar />}
        <div className={isAuthenticated ? "pt-16" : ""}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected employee routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/apply-leave"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <ApplyLeave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/my-requests"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute allowedRoles={["employee"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Protected manager routes */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/pending-requests"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <PendingRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/all-requests"
              element={
                <ProtectedRoute allowedRoles={["manager"]}>
                  <AllRequests />
                </ProtectedRoute>
              }
            />

            {/* Redirect based on role */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  user?.role === "employee" ? (
                    <Navigate to="/employee/dashboard" replace />
                  ) : (
                    <Navigate to="/manager/dashboard" replace />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
