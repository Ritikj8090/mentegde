import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, ListTodo, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CodingQuestion, QuizQuestion, Task, TextQuestion } from "@/index";
import { StatusBadge, TaskTypeBadge } from ".";
import TaskQuizQuestion from "./TaskQuizQuestion";
import TaskCodingQuestion from "./TaskCodingQuestion";
import TaskTextQuestion from "./TaskTextQuestion";
import { AddTasks } from "../workboard/task/AddTaks";
import { format } from "date-fns";

interface TaskProps {
  tasks: Task[];
  internshipId: string;
  milestoneId: string;
  role: string;
}

export function TasksSection({
  tasks,
  internshipId,
  milestoneId,
  role,
}: TaskProps) {
  const [expanded, setExpanded] = useState(true);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [showAddTasks, setShowAddTasks] = useState(false);
  const [tasksData, setTasksData] = useState<Task[]>(tasks);

  useEffect(() => {
    setTasksData(tasks);
  }, [tasks]);
  const completedCount = tasksData.filter(
    (t) =>
      t.progress.status === "completed" || t.progress.status === "submitted",
  ).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border overflow-hidden"
      >
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <ListTodo className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Tasks</h3>
              {role === "user" && (
                <p className="text-sm text-muted-foreground">
                  {completedCount} / {tasks.length} completed
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border text-muted-foreground ">
              {tasks.length} items
            </Badge>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                expanded && "rotate-180",
              )}
            />
          </div>
        </button>

        {/* Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {tasksData.length > 0 ? (
                <div className="border-t ">
                  {tasksData.map((task) => (
                    <TaskTab
                      key={task.id}
                      task={task}
                      activeTask={activeTask}
                      setActiveTask={setActiveTask}
                      role={role}
                    />
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center border-t">
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {showAddTasks && (
        <AddTasks
          open={showAddTasks}
          setOpen={setShowAddTasks}
          internshipId={internshipId}
          milestoneId={milestoneId}
          setTasksData={setTasksData}
        />
      )}
    </>
  );
}

const TaskTab = ({
  task,
  activeTask,
  setActiveTask,
  role,
}: {
  task: Task;
  activeTask: string | null;
  setActiveTask: React.Dispatch<React.SetStateAction<string | null>>;
  role: string;
}) => {
  const renderTaskContent = (task: Task) => {
    const quizQuestions = task.questions.filter(
      (q): q is QuizQuestion => q.task_type === "quiz",
    );

    const codingQuestions = task.questions.filter(
      (q): q is CodingQuestion => q.task_type === "coding",
    );

    const textQuestions = task.questions.filter(
      (q): q is TextQuestion => q.task_type === "text",
    );

    return (
      <div className="space-y-6">
        {quizQuestions.length > 0 && (
          <TaskQuizQuestion filterQuizQuestions={quizQuestions} role={role} />
        )}

        {codingQuestions.length > 0 && (
          <TaskCodingQuestion
            filterCodingQuestions={codingQuestions}
            role={role}
          />
        )}

        {textQuestions.length > 0 && (
          <TaskTextQuestion filterTextQuestions={textQuestions} role={role} />
        )}
      </div>
    );
  };

  return (
    <div key={task.id} className="border-b last:border-0">
      {/* Task Header */}
      <button
        onClick={() => setActiveTask(activeTask === task.id ? null : task.id)}
        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
      >
        {role === "user" && (
          <Checkbox checked={task.progress.status === "done"} />
        )}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium capitalize">{task.title}</h4>
            <TaskTypeBadge type={task.questions[0].task_type} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 capitalize">
            {task.description}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Due: {format(task.due_date, "dd/MM/yyyy")}</span>
            <span className="text-emerald-400">
              {role === "user" &&
                task.submission.score !== null &&
                ` ${task.submission.score} / `}
              {task.score} Points
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge
            status={
              role === "mentor" ? task.status : (task.progress.status as string)
            }
          />
          <ChevronRight
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              activeTask === task.id && "rotate-90",
            )}
          />
        </div>
      </button>

      {/* Task Content */}
      <AnimatePresence>
        {activeTask === task.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className=" border-t "
          >
            {task.progress.status === "done" ? (
              <div className="p-4">
                <p className="text-sm text-muted-foreground">
                  You have completed this task at{" "}
                  {format(
                    task.progress.completed_at as string,
                    "hh:mm aa dd/MM/yyyy",
                  )}
                  .
                </p>
              </div>
            ) : (
              <div className="p-4 pl-12">{renderTaskContent(task)}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
