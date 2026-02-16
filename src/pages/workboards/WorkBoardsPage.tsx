import { useEffect } from "react";
import { useState } from "react";
import Loading from "@/components/Loading";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import {
  OngoingInternshipsForIntern,
  Workboard as WorkboardType,
} from "@/index";
import {
  getCurrentMentorWorkboard,
  getInternWorkboard,
  getOngoingInternshipsForInternById,
} from "@/utils/internship";
import ProgressBar from "./ProgressBar";
import Phases from "./Phases";
import { ConceptsSection } from "./ConceptSection";
import { TasksSection } from "./TaskSection";
import { AssignmentsSection } from "./AssignmentSection";

export function Workboard() {
  const internshipId = window.location.pathname.split("/")[2];
  const [workboardData, setWorkboardData] = useState<WorkboardType | null>(
    null,
  );
  const [activeMilestone, setActiveMilestone] = useState("");
  const [progressData, setProgressData] =
    useState<OngoingInternshipsForIntern>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchWorkboardData = async () => {
      try {
        const res =
          user?.role === "user"
            ? await getInternWorkboard(
                internshipId,
              )
            : await getCurrentMentorWorkboard(
                internshipId,
              );

        const progress = await getOngoingInternshipsForInternById(
          internshipId,
        );
        console.log(res);

        if (res?.milestones?.length > 0) {
          setActiveMilestone(res.milestones[0].id);
        }
        setProgressData(progress[0]);
        setWorkboardData(res);
      } catch (error) {
        console.error("Failed to fetch workboard:", error);
      }
    };

    fetchWorkboardData();
  }, [internshipId]);

  if (!workboardData) return <Loading />;

  return (
    <div className="min-h-screen container mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">Workboard</h1>
            <p className="text-muted-foreground">
              Each phase has its own steps, assignments and tasks.
            </p>
          </div>

          {/* Progress Overview */}
          {user?.role === "user" && progressData && <ProgressBar totalProgress={progressData?.progress_percent} />}

          {/* Phase Tabs */}
          <Phases
            milestones={workboardData.milestones}
            activeMilestone={activeMilestone}
            setActiveMilestone={setActiveMilestone}
            workboardId={workboardData?.id || ""}
            role={user?.role || ""}
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          <ConceptsSection
            concepts={
              workboardData.milestones.find(
                (milestone) => milestone.id === activeMilestone,
              )?.concepts || []
            }
            milestoneId={activeMilestone}
            role={user?.role || "user"}
          />
          <TasksSection
            tasks={
              workboardData.milestones.find(
                (milestone) => milestone.id === activeMilestone,
              )?.tasks || []
            }
            internshipId={internshipId}
            milestoneId={activeMilestone}
            role={user?.role || "user"}
          />
          <AssignmentsSection
            assignments={
              workboardData.milestones.find(
                (milestone) => milestone.id === activeMilestone,
              )?.assignments || []
            }
            internshipId={internshipId || ""}
            domain_name={workboardData.domain_name}
            milestoneId={activeMilestone}
            role={user?.role || "user"}
          />
        </div>
      </div>
    </div>
  );
}

export default Workboard;
