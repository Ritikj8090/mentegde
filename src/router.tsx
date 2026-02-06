import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./MainLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import SignUp from "./pages/auth/Sign-up";
import SignIn from "./pages/auth/Sign-in";
import MentorSignUp from "./pages/auth/Mentor-sign-up";
import MentorSignIn from "./pages/auth/Mentor-sign-in";
import UserSignIn from "./pages/auth/User-sign-in";
import UserSignUp from "./pages/auth/User-sign-up";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/Setting";
import Onboarding from "./pages/onboarding/Onboarding";
import MentorProfile from "./pages/MentorProfile";
import MentorProfiles from "./pages/MentorProfile";
import UserProfilePage from "./pages/userProfile";
import InternshipDashboard from "./pages/mentorDashboard/Internship-dash";
import WorkboardPage from "./pages/workboard/WorkboardPage";

import AccessDenied from "./pages/AccessDenied";
import Test from "./pages/Test";
import InternshipPage from "./pages/manageInternship/InternshipPage";
import { PaymentPage } from "./pages/payment/PaymentPage";
import ChatChannelPage from "./pages/chatChannel/ChatChannelPage";
import ChatPage from "./pages/chats/Chatpage";
import Certificatepage from "./pages/certificate/Certificatepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      /* 🌍 PUBLIC ROUTES */
      {
        element: <PublicRoute />,
        children: [
          { index: true, element: <Home /> },
          { path: "sign-in", element: <SignIn /> },
          { path: "sign-up", element: <SignUp /> },
          { path: "sign-in/user", element: <UserSignIn /> },
          { path: "sign-up/user", element: <UserSignUp /> },
          { path: "sign-in/mentor", element: <MentorSignIn /> },
          { path: "sign-up/mentor", element: <MentorSignUp /> },
          { path: "about", element: <About /> },
          { path: "contact", element: <Contact /> },
        ],
      },

      /* 🔒 PROTECTED ROUTES */
      {
        element: <ProtectedRoute />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "internship-overview", element: <InternshipPage /> },
          { path: "onboarding", element: <Onboarding /> },
          { path: "settings", element: <SettingsPage /> },
          { path: "chat", element: <ChatPage /> },

          { path: "user/profile", element: <UserProfilePage /> },
          { path: "mentor/profile", element: <MentorProfiles /> },
          { path: "mentor-profile/:id", element: <MentorProfile /> },

          { path: "workboard/:internshipId", element: <WorkboardPage /> },
          { path: "payment", element: <PaymentPage /> },
          {
            path: "internship-chat/:internshipId",
            element: <ChatChannelPage />,
          },
          { path: "test", element: <Test /> },
        ],
      },

      { path: "certificate/:certificateNumber", element: <Certificatepage /> },
      { path: "access-denied", element: <AccessDenied /> },
    ],
  },

  /* ❌ NOT FOUND */
  { path: "*", element: <>Not Found</> },
]);

export default router;
