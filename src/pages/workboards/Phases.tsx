import { Milestone } from "@/index";
import { cn } from "@/lib/utils";
import { Edit, Plus } from "lucide-react";
import { use, useEffect, useState } from "react";
import { AddMilestones } from "../workboard/AddMilestones";
import EditMilestones from "../workboard/EditMilestones";

interface PhasesProps {
  milestones: Milestone[];
  activeMilestone: string;
  setActiveMilestone: (phaseId: string) => void;
  workboardId: string;
  role: string;
}
const Phases = ({
  milestones,
  activeMilestone,
  setActiveMilestone,
  workboardId,
  role,
}: PhasesProps) => {
  const [milestoneData, setMilestoneData] = useState<Milestone[]>([]);
  const [openAddMilestoneModal, setOpenAddMilestoneModal] = useState(false);
  const [openEditMilestoneModal, setOpenEditMilestoneModal] =
    useState<Milestone | null>(null);

  useEffect(() => {
    setMilestoneData(milestones);
  }, [milestones]);
  return (
    <>
      <div className="relative w-full">
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {milestoneData.map((milestone) => (
            <button
              key={milestone.id}
              onClick={() => setActiveMilestone(milestone.id)}
              className={cn(
                "flex group items-center gap-3 rounded-full px-4 py-2 transition-all duration-300 min-w-fit",
                activeMilestone === milestone.id
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-violet-500/25"
                  : "bg-muted hover:bg-muted/80 text-foreground",
              )}
            >
              {/* Number badge */}
              <span
                className={cn(
                  "flex h-7 w-7 items-center relative justify-center rounded-full text-sm font-semibold",
                  activeMilestone === milestone.id
                    ? "bg-white/20 text-white"
                    : "bg-background text-foreground",
                )}
              >
                {role === "mentor" ? (
                  <>
                    <Edit
                      className="h-4 w-4 absolute inset-0 m-auto hidden group-hover:block cursor-pointer"
                      onClick={() => setOpenEditMilestoneModal(milestone)}
                    />
                    <p className="group-hover:hidden">
                      {milestone.order_index}
                    </p>
                  </>
                ) : (
                  <p>{milestone.order_index}</p>
                )}
              </span>

              {/* Phase info */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium whitespace-nowrap capitalize">
                  {milestone.title}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    activeMilestone === milestone.id
                      ? "text-white/70"
                      : "text-muted-foreground",
                  )}
                >
                  {/* {milestone.completed} / {milestone.total} done */}
                </span>
              </div>
            </button>
          ))}
          {role === "mentor" && (
            <button
              onClick={() => setOpenAddMilestoneModal(true)}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-300 min-w-fit bg-muted hover:bg-muted/80 text-foreground",
              )}
            >
              {/* Number badge */}
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold bg-background text-foreground",
                )}
              >
                <Plus className="h-4 w-4" />
              </span>

              {/* Phase info */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium whitespace-nowrap">
                  Create Milestone
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
      {openAddMilestoneModal && (
        <AddMilestones
          milestoneDataLength={milestoneData.length}
          setMilestoneData={setMilestoneData}
          workboardId={workboardId}
          open={openAddMilestoneModal}
          setOpen={setOpenAddMilestoneModal}
        />
      )}
      {openEditMilestoneModal && (
        <EditMilestones
          setMilestoneData={setMilestoneData}
          workboardId={workboardId}
          open={openEditMilestoneModal}
          setOpen={setOpenEditMilestoneModal}
        />
      )}
    </>
  );
};

export default Phases;
