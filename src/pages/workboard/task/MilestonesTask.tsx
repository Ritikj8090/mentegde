import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronRight,
  ListTodo,
  Pen,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { AddTasks } from "./AddTaks";
import { Task } from "@/index";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { EditTasks } from "./EditTasks";
import { updateTaskProgress } from "@/utils/internship";

interface WorkboardSectionProps {
  tasks: Task[];
  internshipId: string;
  milestoneId: string;
  domain_name: string;
  role: string;
}

const MilestonesTask = ({
  tasks,
  internshipId,
  domain_name,
  milestoneId,
  role,
}: WorkboardSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddTasks, setShowAddTasks] = useState(false);
  const [tasksData, setTasksData] = useState<Task[]>(tasks);

  useEffect(() => {
    setTasksData(tasks);
  }, [tasks]);

  const completedCount = tasksData.filter(
    (task) => task.progress.status === "completed"
  ).length;

  return (
    <>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {/* Section Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-blue-500/10")}>
              <ListTodo className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold text-foreground">
                Tasks
              </span>
              {role === "user" && (
                <span className="text-xs text-muted-foreground">
                  {completedCount} / {tasksData.length} completed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {tasksData.length} items
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
            {tasksData.length > 0 ? (
              <div className="divide-y divide-border">
                {tasksData.map((task) => (
                  <AccordionTask
                    key={task.id}
                    tasksData={task}
                    setTasksData={setTasksData}
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
                onClick={() => setShowAddTasks(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a Task
              </button>
            )}
          </div>
        )}
      </div>
      {showAddTasks && (
        <AddTasks
          open={showAddTasks}
          setOpen={setShowAddTasks}
          internshipId={internshipId}
          domain_name={domain_name}
          milestoneId={milestoneId}
          setTasksData={setTasksData}
        />
      )}
    </>
  );
};

export default MilestonesTask;

const AccordionTask = ({
  tasksData,
  setTasksData,
  internshipId,
  domain_name,
  role,
}: {
  tasksData: Task;
  setTasksData: React.Dispatch<React.SetStateAction<Task[]>>;
  role: string;
  internshipId: string;
  domain_name: string;
}) => {
  const [editTask, setEditTask] = useState(false);

  const handleStatusChange = async (
    event: React.MouseEvent,
    taskId: string,
    nextStatus: "todo" | "done"
  ) => {
    event.preventDefault();
    event.stopPropagation();

    // 🔥 Optimistic UI update
    setTasksData((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              progress: {
                ...task.progress,
                status: nextStatus,
              },
            }
          : task
      )
    );

    try {
      const res = await updateTaskProgress(taskId, nextStatus);

      // ✅ Sync with backend response
      setTasksData((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                progress: {
                  ...task.progress,
                  status: res.progress.status,
                },
              }
            : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full px-5"
        defaultValue={tasksData.id}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className=" hover:no-underline capitalize justify-between w-full">
            <div className=" flex items-center gap-2">
              {role === "user" && (
                <Checkbox
                  checked={tasksData.progress.status === "done"}
                  onClick={(event) =>
                    handleStatusChange(
                      event,
                      tasksData.id,
                      tasksData.progress.status === "done" ? "todo" : "done"
                    )
                  }
                />
              )}
              {tasksData.title}{" "}
              {role === "mentor" && (
                <div className=" flex gap-2 items-center">
                  <Pen size={13} onClick={() => setEditTask(true)} />
                </div>
              )}
            </div>
            <div className=" flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs",
                  tasksData.progress.status === "completed"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : tasksData.progress.status === "pending"
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {role === "user"
                  ? tasksData.progress.status === "completed"
                    ? "Completed"
                    : "Pending"
                  : tasksData.status}
              </Badge>
              <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
            </div>
          </AccordionTrigger>

          <AccordionContent className=" space-y-2 text-muted-foreground">
            <div className=" space-y-1">
              <h1>Description</h1>
              <p className=" capitalize">{tasksData.description}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {editTask && (
        <EditTasks
          open={editTask}
          setOpen={setEditTask}
          internshipId={internshipId}
          domain_name={domain_name}
          tasksData={tasksData}
          setTasksData={setTasksData}
        />
      )}
    </>
  );
};
