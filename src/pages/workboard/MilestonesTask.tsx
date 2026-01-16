import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  ListTodo,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AddTasks } from "./AddTaks";
import { Task } from "@/index";

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
  const completedCount = tasks.filter(
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
                  {completedCount} / {tasks.length} completed
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs">
              {tasks.length} items
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
            {tasks.length > 0 ? (
              <div className="divide-y divide-border">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex capitalize justify-between items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <p>{task.title}</p>

                    <Badge variant="secondary" className="text-xs">
                      {role === "user" ? task.progress.status : task.status}
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
        />
      )}
    </>
  );
};

export default MilestonesTask;
