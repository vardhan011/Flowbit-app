import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import SupportTickets from "./pages/SupportTickets";
import CreateTicket from "./pages/CreateTicket";
import ViewTickets from "./pages/ViewTickets";
import MyTickets from "./pages/MyTickets";

// Simple component for Access Denied message
const AccessDenied = () => (
  <div className="p-4 bg-white rounded shadow text-red-600 font-bold">
    Only Admins can access this page.
  </div>
);

// Helper to get user info from JWT token
const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (err) {
    console.error("Failed to parse token:", err);
    return null;
  }
};

// Auth Guard component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

// Main dashboard layout
const DashboardLayout = ({ screens, user }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar screens={screens} user={user} />
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          {/* Support Tickets */}
          <Route
            path="/support"
            element={
              user?.role === "Admin" ? (
                <SupportTickets />
              ) : (
                <AccessDenied />
              )
            }
          />

          {/* Create Ticket */}
          <Route
            path="/tickets/create"
            element={
              user?.role === "Admin" ? (
                <CreateTicket />
              ) : (
                <AccessDenied />
              )
            }
          />

          {/* Other dynamic screens */}
          {screens.map((screen, index) => (
            <Route
              key={index}
              path={screen.url}
              element={
                <div className="p-4 bg-white rounded shadow">
                  {screen.url === "/tickets" && <ViewTickets />}
                  {screen.url === "/mytickets" && <MyTickets />}
                  {!["/support", "/tickets", "/mytickets"].includes(screen.url) && (
                    <>
                      <h2 className="text-2xl font-bold text-gray-700">{screen.name}</h2>
                      <p>This is a placeholder for {screen.url}</p>
                    </>
                  )}
                </div>
              }
            />
          ))}

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="text-center text-red-500 font-bold text-xl">
                Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// App component
const App = () => {
  const [screens, setScreens] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/test`)
      .then((res) => res.json())
      .then((data) => console.log("✅ Backend API response:", data))
      .catch((err) => console.error("❌ API error:", err));
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const userInfo = getUserFromToken();
    setUser(userInfo);

    fetch("http://localhost:5000/api/me/screens", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setScreens(data.screens || []);
      })
      .catch((err) => console.error("Failed to fetch screens", err));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout screens={screens} user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
