import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddMilestones } from "./AddMilestones";
import { Milestone } from "@/index";

interface PhaseCarouselProps {
  milestones: Milestone[];
  activeMilestone: string;
  setActiveMilestone: (phaseId: string) => void;
  workboardId: string;
  role: string;
}

export function MilestonesCarousel({
  milestones,
  activeMilestone,
  setActiveMilestone,
  workboardId,
  role,
}: PhaseCarouselProps) {
  const [openAddMilestoneModal, setOpenAddMilestoneModal] = useState(false);
  return (
    <>
      <div className="relative w-full">
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {milestones.map((milestone) => (
            <button
              key={milestone.id}
              onClick={() => setActiveMilestone(milestone.id)}
              className={cn(
                "flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 min-w-fit",
                activeMilestone === milestone.id
                  ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-violet-500/25"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {/* Number badge */}
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                  activeMilestone === milestone.id
                    ? "bg-white/20 text-white"
                    : "bg-background text-foreground"
                )}
              >
                {milestone.order_index}
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
                      : "text-muted-foreground"
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
                "flex items-center gap-3 rounded-full px-5 py-3 transition-all duration-300 min-w-fit bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {/* Number badge */}
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold bg-background text-foreground"
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
          workboardId={workboardId}
          open={openAddMilestoneModal}
          setOpen={setOpenAddMilestoneModal}
        />
      )}
    </>
  );
}
