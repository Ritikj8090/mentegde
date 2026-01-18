import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronRight,
  ClipboardCheck,
  Pen,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { AddAssignments } from "./AddAssignments";
import { Assignment } from "@/index";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { EditAssignments } from "./EditAssignment";

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
  const [assignmentsData, setAssignmentsData] = useState<Assignment[]>([]);
  const [showAddAssignments, setShowAddAssignments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = assignmentsData.filter(
    (assignment) => assignment
  ).length;

  useEffect(() => {
    setAssignmentsData(assignments);
  }, [assignments]);

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
                  {completedCount} / {assignmentsData.length} completed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {assignmentsData.length} items
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
            {assignmentsData.length > 0 ? (
              <div className="divide-y divide-border">
                {assignmentsData.map((assignment) => (
                  <AccordionAssignment
                    key={assignment.id}
                    assignmentsData={assignment}
                    setAssignmentsData={setAssignmentsData}
                    internshipId={internshipId}
                    domain_name={domain_name}
                    role={role}
                  />
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
          setAssignmentsData={setAssignmentsData}
        />
      )}
    </>
  );
};

export default MilestonesAssingment;

const AccordionAssignment = ({
  assignmentsData,
  setAssignmentsData,
  internshipId,
  domain_name,
  role,
}: {
  assignmentsData: Assignment;
  setAssignmentsData: React.Dispatch<React.SetStateAction<Assignment[]>>;
  role: string;
  internshipId: string;
  domain_name: string;
}) => {
  const [editAssignment, setEditAssignment] = useState(false);

  const handleStatusChange = async (
    event: React.MouseEvent,
    taskId: string,
    nextStatus: "todo" | "done"
  ) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full px-5"
        defaultValue={assignmentsData.id}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className=" hover:no-underline capitalize justify-between w-full">
            <div className=" flex items-center gap-2">
              {/* {role === "user" && (
                <Checkbox
                  checked={assignmentsData.progress.status === "done"}
                  onClick={(event) =>
                    handleStatusChange(
                      event,
                      assignmentsData.id,
                      assignmentsData.progress.status === "done" ? "todo" : "done"
                    )
                  }
                />
              )} */}
              {assignmentsData.title}{" "}
              {role === "mentor" && (
                <div className=" flex gap-2 items-center">
                  <Pen size={13} onClick={() => setEditAssignment(true)} />
                </div>
              )}
            </div>
            <div className=" flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  assignmentsData.progress.status === "completed"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : assignmentsData.progress.status === "pending"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {role === "user"
                  ? assignmentsData.progress.status === "completed"
                    ? "Completed"
                    : "Pending"
                  : assignmentsData.status}
              </Badge>
              <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
            </div>
          </AccordionTrigger>

          <AccordionContent className=" space-y-2 text-muted-foreground">
            <div className=" space-y-1">
              <h1>Description</h1>
              <p className=" capitalize">{assignmentsData.description}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {editAssignment && (
        <EditAssignments
          open={editAssignment}
          setOpen={setEditAssignment}
          internshipId={internshipId}
          domain_name={domain_name}
          assignmentsData={assignmentsData}
          setAssignmentsData={setAssignmentsData}
        />
      )}
    </>
  );
};
