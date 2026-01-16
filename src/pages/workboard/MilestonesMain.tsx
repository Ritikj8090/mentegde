import MilestonesConcept from "./MilestonesConcept";
import MilestonesTask from "./MilestonesTask";
import MilestonesAssingment from "./MilestonesAssingment";
import { Milestone } from "@/index";

interface MilestonesMainProps {
  milestoneData: Milestone | null;
  internshipId: string;
  domain_name: string;
  role: string;
}

const MilestonesMain = ({
  milestoneData,
  internshipId,
  domain_name,
  role,
}: MilestonesMainProps) => {
  return (
    <div className=" space-y-5">
      <MilestonesConcept
        concepts={milestoneData?.concepts || []}
        milestoneId={milestoneData?.id || ""}
        role={role}
      />
      <MilestonesTask
        tasks={milestoneData?.tasks || []}
        internshipId={internshipId || ""}
        domain_name={domain_name}
        milestoneId={milestoneData?.id || ""}
        role={role}
      />
      <MilestonesAssingment
        assignments={milestoneData?.assignments || []}
        internshipId={internshipId || ""}
        domain_name={domain_name}
        milestoneId={milestoneData?.id || ""}
        role={role}
      />
    </div>
  );
};

export default MilestonesMain;
