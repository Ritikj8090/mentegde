import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../components/store";
import UserDashboardPage from "./userDashboard/useDashboardPage";
import MentorDashboardPage from "./mentorDashboard/mentorDashboardPage";

const Dashboard: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return (
    <div className="container mx-auto py-4 max-h-screen">
      <h1 className=" md:text-3xl text-xl font-bold mb-4">Dashboard</h1>
      {auth.user?.role === "user" ? (
        <UserDashboardPage />
      ) : (
        <MentorDashboardPage />
      )}
    </div>
  );
};

export default Dashboard;
