import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded Pages
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Members = lazy(() => import("./pages/Members"));
const MemberProfile = lazy(() => import("./pages/MemberProfile"));
const FamilyTreePage = lazy(() => import("./pages/FamilyTreePage"));
const NewbornRequests = lazy(() => import("./pages/NewbornRequests"));
const ClanHistory = lazy(() => import("./pages/ClanHistory"));
const MediaArchive = lazy(() => import("./pages/MediaArchive"));
const Events = lazy(() => import("./pages/Events"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/members"
            element={
              <PrivateRoute>
                <Members />
              </PrivateRoute>
            }
          />
          <Route
            path="/members/:id"
            element={
              <PrivateRoute>
                <MemberProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/family-tree"
            element={
              <PrivateRoute>
                <FamilyTreePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/newborn-requests"
            element={
              <PrivateRoute roles={["Super Admin", "Clan Admin", "Editor"]}>
                <NewbornRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <ClanHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/media"
            element={
              <PrivateRoute>
                <MediaArchive />
              </PrivateRoute>
            }
          />
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <Events />
              </PrivateRoute>
            }
          />

          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

