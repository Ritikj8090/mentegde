import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./MainLayout";
import NotFound from "./pages/NotFound";
import UserLanding from "./pages/UserLanding";
import Naukri from "./pages/naukri";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SignUp from "./pages/auth/Sign-up";
import SignIn from "./pages/auth/Sign-in";
import LogIn from "./pages/auth2/Sign-in";
import MentorSignUp from "./pages/auth/Mentor-sign-up";
import MentorScreen from "./pages/MentorScreen";
import MentorProfile from "./pages/MentorProfile";
import TopMentors from "./pages/TopMentors";
import MentorDashboard from "./pages/MentorDashboard";
import SettingsPage from "./pages/Setting";
import Dashboard from "./pages/Dashboard";
import MentorSignIn from "./pages/auth/Mentor-sign-in";
import Chat from "./pages/Chat";
import Onboarding from "./pages/Onboarding";
import CreateSession from "./pages/CreateSession";
// import Test from "./pages/Test";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AccessDenied from "./pages/AccessDenied";
import LiveSession from "./pages/LiveSession";
import Test from "./pages/Test";
import UserDashboardPage from "./pages/UserDashboard";
import MentorLanding from "./pages/mentor";

import MentorProfiles from "./pages/MentorProfile";
import InternDashboard from "./pages/InternDashboard";
import ProductWorkbook from "./pages/ProductWorkboard";
import MentorDashboardTwo from "./pages/MentorDashboardTwo";
import CreateInternship from "./pages/mentorDashboard/InternshipOverview";
import InternshipDashboard from "./pages/mentorDashboard/Internship-dash";
import UserSignIn from "./pages/auth/User-sign-in";
import UserSignUp from "./pages/auth/User-sign-up";
import UserProfilePage from "./pages/userProfile";
import InternshipPage from "./pages/manageInternship/InternshipPage";
import WorkboardPage from "./pages/workboard/WorkboardPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/internship-dashboard", element: <InternshipDashboard /> },

      { path: "/user/dashboard", element: <InternDashboard /> },
      { path: "/mentor/profile", element: <MentorProfiles /> },
      { path: "/productworkboard", element: <ProductWorkbook /> },

      { path: "/create", element: <CreateInternship /> },

      { path: "/mentor-dash", element: <MentorDashboardTwo /> },
      {
        index: true,
        element: (
          <PublicRoute>
            <Home />
          </PublicRoute>
        ),
      },
      {
        path: "sign-in",
        element: (
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        ),
      },
      {
        path: "sign-up",
        element: (
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        ),
      },
      {
        path: "sign-in/user",
        element: (
          <PublicRoute>
            <UserSignIn />
          </PublicRoute>
        ),
      },
      {
        path: "sign-up/user",
        element: (
          <PublicRoute>
            <UserSignUp />
          </PublicRoute>
        ),
      },
      {
        path: "sign-up/mentor",
        element: (
          <PublicRoute>
            <MentorSignUp />
          </PublicRoute>
        ),
      },
      {
        path: "sign-in/mentor",
        element: (
          <PublicRoute>
            <MentorSignIn />
          </PublicRoute>
        ),
      },
      { path: "test", element: <Test /> },
      // Shared Routes

      {
        path: "*",
        element: <ProtectedRoute />, // No roles specified means both roles can access
        children: [
          { path: "onboarding", element: <Onboarding /> },
          { path: "user/profile", element: <UserProfilePage /> },
          { path: "mentor/profile", element: <MentorProfiles /> },
          { path: "workboard/:internshipId", element: <WorkboardPage /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "mentor-profile/:id", element: <MentorProfile /> },
          { path: "mentor/:id", element: <MentorScreen /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "live-session", element: <LiveSession /> },
          { path: "about", element: <About /> },
          { path: "contact", element: <Contact /> },
          { path: "chat", element: <Chat /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "top-mentors", element: <TopMentors /> },
        ],
      },

      //User routes
      // Protected Routes (Require Authentication)
      {
        path: "*",
        element: <ProtectedRoute allowedRoles={["user"]} />,
        children: [
          { path: "user/dashboard", element: <UserDashboardPage /> },
          { path: "top-mentors", element: <TopMentors /> },
          { path: "live-session", element: <LiveSession /> },
        ],
      },

      // 🧑‍🏫 Mentor-only routes
      {
        path: "*",
        element: <ProtectedRoute allowedRoles={["mentor"]} />,
        children: [
          { path: "mentor/dashboard", element: <MentorDashboard /> },
          { path: "mentor-profile", element: <MentorProfile /> },
          { path: "mentor/:id", element: <MentorScreen /> },
          { path: "create-session", element: <CreateSession /> },
          { path: "internship-overview", element: <InternshipPage /> },
        ],
      },
      { path: "access-denied", element: <AccessDenied /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
