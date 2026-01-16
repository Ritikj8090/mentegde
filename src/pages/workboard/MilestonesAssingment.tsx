import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AddAssignments } from "./AddAssignments";
import { Assignment } from "@/index";

interface WorkboardSectionProps {
  onToggleItem?: (itemId: string) => void;
  assignments: Assignment[];
  internshipId: string;
  milestoneId: string;
  domain_name: string;
  role: string;
}

const MilestonesAssingment = ({
  onToggleItem,
  assignments,
  internshipId,
  milestoneId,
  domain_name,
  role,
}: WorkboardSectionProps) => {
  const [showAddAssignments, setShowAddAssignments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = assignments.filter((assignment) => assignment).length;
  return (
    <>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {/* Section Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-emerald-500/10")}>
              <ClipboardCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-foreground">
                Assingments
              </span>
              {role === "user" && (
                <span className="text-xs text-muted-foreground">
                  {completedCount} / {assignments.length} completed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {assignments.length} items
            </Badge>
            {isExpanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* Section Content */}
        {isExpanded && (
          <div className="border-t border-border">
            {assignments.length > 0 ? (
              <div className="divide-y divide-border">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex capitalize justify-between items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => onToggleItem?.(assignment.id)}
                  >
                    <p>{assignment.title}</p>

                    <Badge variant="secondary" className="text-xs">
                      {role === "user" ? assignment.status : assignment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No items yet</p>
              </div>
            )}
            {role === "mentor" && (
              <button
                className="p-3 flex items-center justify-center border-t border-border w-full text-muted-foreground hover:text-foreground hover:bg-muted/30"
                onClick={() => setShowAddAssignments(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a Assignment
              </button>
            )}
          </div>
        )}
      </div>
      {showAddAssignments && (
        <AddAssignments
          open={showAddAssignments}
          setOpen={setShowAddAssignments}
          milestoneId={milestoneId}
          domain_name={domain_name}
          internshipId={internshipId}
        />
      )}
    </>
  );
};

export default MilestonesAssingment;
