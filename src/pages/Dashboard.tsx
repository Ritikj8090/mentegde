import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../components/store";
import UserDashboardPage from "./userDashboard/useDashboardPage";
import MentorDashboardPage from "./mentorDashboard/mentorDashboardPage";

export interface Mentor {
  id: string;
  user_id: string;
  username: string;
  email: string;
  role: "user" | "mentor";
  avatar?: string;
  bio?: string;
  expertise?: string | string[];
  title?: string;
  hourlyRate?: number;
  rating?: number;
  isLive?: boolean;
}

const Dashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="container mx-auto py-4 max-h-screen">
      <h1 className=" text-3xl font-bold mb-4">Dashboard</h1>
      {auth.user?.role === "user" ? (
        <UserDashboardPage />
      ) : (
        <MentorDashboardPage />
      )}
    </div>
  );
};

export default Dashboard;
