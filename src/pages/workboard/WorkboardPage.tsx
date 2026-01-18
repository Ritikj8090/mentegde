import { useEffect, useState } from "react";
import { MilestonesCarousel } from "./MilestonesCarousel";
import MilestonesMain from "./MilestonesMain";
import {
  getCurrentMentorWorkboard,
  getInternWorkboard,
} from "@/utils/internship";
import { Workboard } from "@/index";
import Loading from "@/components/Loading";
import { RootState } from "@/components/store/store";
import { useSelector } from "react-redux";
import { File, FileText, ImageIcon } from "lucide-react";

interface FileAttachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "document" | "other";
  url: string;
  preview?: string;
}

export const getFileIcon = (type: FileAttachment["type"]) => {
  switch (type) {
    case "image":
      return <ImageIcon className="h-4 w-4 text-blue-400" />;
    case "pdf":
      return <FileText className="h-4 w-4 text-red-400" />;
    case "document":
      return <FileText className="h-4 w-4 text-blue-400" />;
    default:
      return <File className="h-4 w-4 text-muted-foreground" />;
  }
};

const WorkboardPage = () => {
  const internshipId = window.location.pathname.split("/")[2];
  const [workboardData, setWorkboardData] = useState<Workboard | null>(null);
  const [activeMilestone, setActiveMilestone] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchWorkboardData = async () => {
      try {
        const res =
          user?.role === "user"
            ? await getInternWorkboard(internshipId)
            : await getCurrentMentorWorkboard(internshipId);

        console.log(res);

        if (res?.milestones?.length > 0) {
          setActiveMilestone(res.milestones[0].id);
        }

        setWorkboardData(res);
      } catch (error) {
        console.error("Failed to fetch workboard:", error);
      }
    };

    fetchWorkboardData();
  }, [internshipId]);

  if (!workboardData) return <Loading />;

  return (
    <div className=" container mx-auto h-full py-4">
      <div className="mb-4">
        <h1 className=" text-3xl font-bold ">Workboard</h1>
        <p className="text-muted-foreground">
          Each phase has its own steps, assignments and tasks.
        </p>
      </div>
      <div className="mb-8 rounded-full overflow-hidden">
        <MilestonesCarousel
          milestones={workboardData.milestones}
          activeMilestone={activeMilestone}
          setActiveMilestone={setActiveMilestone}
          workboardId={workboardData?.id || ""}
          role={user?.role || ""}
        />
      </div>
      {workboardData.milestones.length > 0 ? (
        <MilestonesMain
          milestoneData={
            workboardData.milestones.find(
              (milestone) => milestone.id === activeMilestone
            ) || null
          }
          internshipId={internshipId}
          domain_name={workboardData.domain_name}
          role={user?.role || ""}
        />
      ) : (
        <div className=" flex items-center justify-center w-full h-full">
          {user?.role === "user" && (
            <p className="text-muted-foreground">
              No milestones found, Connect with your mentor.
            </p>
          )}
          {user?.role === "mentor" && (
            <p className="text-muted-foreground">
              No milestones found, Create a milestone by clicking the above button.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkboardPage;
