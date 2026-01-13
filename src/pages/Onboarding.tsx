import { use, useEffect } from "react";
import MentorOnboarding from "./onboarding/Mentor";
import StudentOnboarding from "./onboarding/Student";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.gender) {
      navigate("/dashboard");
    }
  },[]);

  console.log("Current user in Onboarding:", user);

  return (
    <div className="min-h-screen w-full">
      {user?.role === "mentor" ? <MentorOnboarding user={user} /> : <StudentOnboarding user={user} />}
    </div>
  );
}
