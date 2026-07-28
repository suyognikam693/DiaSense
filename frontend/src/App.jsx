import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { LandingPage } from "./components/LandingPage";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { ProfilePage } from "./components/ProfilePage";
import { DietPlannerPage } from "./components/DietPlannerPage";
import { FoodTracker } from "./components/FoodTracker";
import { RecipeDialog } from "./components/RecipeDialog";
import { AdviceSection } from "./components/AdviceSection";
import { RiskAssessmentForm } from "./components/RiskAssessmentForm";

import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const updateUserData = (healthData, riskScore) => {
    if (user) {
      setUser({
        ...user,
        healthData,
        riskScore,
      });
    }
  };

  // Protect routes that require login
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<LandingPage/>} />

        {/* Login */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard
                user={user}
                onLogout={handleLogout}
                onUpdateUserData={updateUserData}
                setUser={setUser}
              />
            </ProtectedRoute>
          }
        />
        

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage
                user={user}
                onUpdateUserData={updateUserData}
              />
            </ProtectedRoute>
          }
        />

        {/* Diet Planner */}
        <Route
          path="/diet-planner"
          element={
            <ProtectedRoute>
              <DietPlannerPage user={user} />
            </ProtectedRoute>
          }
        />

        {/* Food Tracker */}
        <Route
          path="/food-tracker"
          element={
            <ProtectedRoute>
              <FoodTracker user={user} />
            </ProtectedRoute>
          }
        />

        {/* Recipes */}
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipeDialog />
            </ProtectedRoute>
          }
        />

        {/* Advice */}
        <Route
          path="/advice"
          element={
            <ProtectedRoute>
              <AdviceSection
                riskScore={user?.riskScore}
                userData={user?.healthData}
              />
            </ProtectedRoute>
          }
        />

        {/* Risk Assessment */}
        <Route
          path="/risk-assessment"
          element={
            <ProtectedRoute>
              <RiskAssessmentForm
                user={user}
                onUpdateUserData={updateUserData}
              />
            </ProtectedRoute>
          }
        />

        {/* Unknown Routes */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}