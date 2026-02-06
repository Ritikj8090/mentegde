import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { tasksDefaultValues, tasksSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createTasks, getAllDomainIntern } from "@/utils/internship";
import { Interns, Task } from "@/index";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { UPLOAD_PHOTOS_URL } from "@/components/config/CommonBaseUrl";
import React, { useState } from "react";
import {
  Plus,
  Trash2,
  HelpCircle,
  Code,
  MessageSquare,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldArray } from "react-hook-form";

interface AddConceptsProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internshipId: string;
  milestoneId: string;
  setTasksData: React.Dispatch<React.SetStateAction<Task[]>>;
}

const taskTypeConfig = {
  quiz: {
    icon: HelpCircle,
    label: "Quiz",
    color: "from-purple-500 to-pink-500",
    description: "Multiple choice questions with time limit",
  },
  coding: {
    icon: Code,
    label: "Code Challenge",
    color: "from-cyan-500 to-blue-500",
    description: "Coding problem with test cases",
  },
  text: {
    icon: MessageSquare,
    label: "Text Response",
    color: "from-emerald-500 to-teal-500",
    description: "Written response with word limit",
  },
};

export function AddTasks({
  open,
  setOpen,
  internshipId,
  milestoneId,
  setTasksData,
}: AddConceptsProps) {
  const [timeLimit, setTimeLimit] = useState(60);

  const [allInterns, setAllInterns] = React.useState<Interns[] | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const interns = await getAllDomainIntern(internshipId);
        setAllInterns(interns);
        console.log(interns);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [internshipId]);

  const form = useForm<z.infer<typeof tasksSchema>>({
    resolver: zodResolver(tasksSchema),
    defaultValues: tasksDefaultValues,
  });

  const handleSelectAll = () => {
    if (form.watch("assigned_to_ids").length === allInterns?.length) {
      form.setValue("assigned_to_ids", []);
    } else {
      form.setValue("assigned_to_ids", allInterns?.map((u) => u.id) || []);
    }
  };

  const handleToggleUser = (userId: string) => {
    form.setValue(
      "assigned_to_ids",
      form.getValues("assigned_to_ids").includes(userId)
        ? form.getValues("assigned_to_ids").filter((id) => id !== userId)
        : [...form.getValues("assigned_to_ids"), userId],
    );
  };

  const isAllSelected =
    form.watch("assigned_to_ids").length === allInterns?.length;

  const normalizeTask = (task: Task) => ({
    ...task,

    assignees: task.assigned_to ? [task.assigned_to] : [],

    progress: {
      status: task.status,
      completed_at: task.completed_at ?? null,
      updated_at: null,
    },
    questions: task.questions || [],

    // normalize date → YYYY-MM-DD
    due_date: task.due_date?.split("T")[0] ?? null,
  });
  const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
    const res = await createTasks(milestoneId, values);
    console.log(res);
    if (!res?.task) return;

    const normalizedTask = normalizeTask(res.task);

    setTasksData((prev) => [...prev, normalizedTask]);
    setOpen(false);

  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "quiz",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-200 max-h-[calc(100vh-64px)] overflow-y-scroll">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>
                Create and assign a new task to interns
              </DialogDescription>
            </DialogHeader>
            <div className=" space-y-5">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">
                  Task Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/*, "coding", "text" */}
                  {(["quiz"] as const).map((type) => {
                    const config = taskTypeConfig[type];
                    const Icon = config.icon;
                    const isSelected = form.watch("task_type") === type;

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => form.setValue("task_type", type)}
                        className={cn(
                          "flex flex-col items-start gap-2 p-4 rounded-lg border transition-all",
                          isSelected
                            ? `border-transparent bg-gradient-to-br ${config.color} text-white`
                            : "border text-muted-foreground hover:border-muted-foreground/80",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="text-left">
                          <p className="font-medium text-sm">{config.label}</p>
                          <p className="text-xs opacity-80">
                            {config.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a task title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a task description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className=" grid grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Task Status</FormLabel>

                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value="todo">Todo</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Score</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter a score"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsedValue = parseInt(value);
                            if (!isNaN(parsedValue)) {
                              field.onChange(parsedValue);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                {/* Time Limit (for Quiz) */}
                {form.watch("task_type") === "quiz" && (
                  <div className="space-y-3">
                    <label className=" text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time Limit (minutes)
                    </label>
                    <Input
                      type="number"
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(Number(e.target.value))}
                      min="1"
                      className=""
                    />
                  </div>
                )}

                {/* Task Type Specific Fields */}
                {form.watch("task_type") === "quiz" && (
                  <div className="space-y-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        Quiz Questions ({fields.length})
                      </h3>
                      <Button
                        size="sm"
                        type="button"
                        onClick={() =>
                          append({
                            question_text: "",
                            options: ["", "", "", ""],
                            correct_option: "0",
                          })
                        }
                        className="bg-emerald-600 hover:bg-emerald-600/80 text-white gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Question
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((q, qIndex) => (
                        <div key={q.id} className="p-4 rounded-lg border">
                          <div className="flex items-start justify-between mb-3">
                            <label className="text-sm font-medium">
                              Question {qIndex + 1}
                            </label>
                            {(form.watch("quiz") || []).length > 1 && (
                              <button
                                type="button"
                                onClick={() => remove(qIndex)}
                                className="text-muted-foreground cursor-pointer hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          <Input
                            {...form.register(`quiz.${qIndex}.question_text`)}
                            placeholder="Enter question text"
                            className="mb-3"
                          />

                          <div className="space-y-2 mb-3">
                            <label className="text-xs font-medium text-muted-foreground">
                              Options
                            </label>
                            {[0, 1, 2, 3].map((oIndex) => (
                              <div
                                key={oIndex}
                                className="flex items-center gap-2"
                              >
                                {/* Radio */}
                                <input
                                  type="radio"
                                  {...form.register(
                                    `quiz.${qIndex}.correct_option`,
                                  )}
                                  value={oIndex}
                                />

                                {/* Option Input */}
                                <Input
                                  {...form.register(
                                    `quiz.${qIndex}.options.${oIndex}`,
                                  )}
                                  placeholder={`Option ${oIndex + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {form.watch("task_type") === "coding" && (
                  <div className="space-y-4 p-4 rounded-lg border ">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Code Challenge
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`coding.language`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Code Language</FormLabel>

                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent>
                                <SelectItem value="javascript">
                                  JavaScript
                                </SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                                <SelectItem value="java">Java</SelectItem>
                                <SelectItem value="cpp">C++</SelectItem>
                                <SelectItem value="typescript">
                                  TypeScript
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                      control={form.control}
                      name="coding.question_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a question" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Starter Code
                        </label>
                        <Textarea
                          value={form.watch("coding.starter_code")}
                          onChange={(e) =>
                            form.setValue("coding.starter_code", e.target.value)
                          }
                          placeholder="Provide starter code template for interns"
                          className="min-h-24 font-mono text-sm placeholder:text-muted-foreground"
                        />
                      </div>

                      {["test_cases", "expected_output"].map((type) => {
                        const typeCase =
                          type === "test_cases"
                            ? "coding.test_cases"
                            : "coding.expected_output";
                        return (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium capitalize">
                                {type.split("_").join(" ")} (
                                {form.watch(typeCase).length})
                              </label>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  form.setValue(typeCase, [
                                    ...form.watch(typeCase),
                                    "",
                                  ])
                                }
                                className="bg-emerald-600 hover:bg-emerald-600/80 text-white gap-2"
                                variant="outline"
                              >
                                <Plus className="h-4 w-4" />
                                Add
                              </Button>
                            </div>

                            <div className="space-y-2 ">
                              {form.watch(typeCase).map((testCase, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 relative"
                                >
                                  <Textarea
                                    value={testCase}
                                    onChange={(e) => {
                                      const updatedTestCases = [
                                        ...form.watch(typeCase),
                                      ];
                                      updatedTestCases[index] = e.target.value;
                                      form.setValue(typeCase, updatedTestCases);
                                    }}
                                    placeholder={`Test case ${index + 1}`}
                                    className="min-h-16 font-mono text-sm "
                                  />
                                  {form.watch(typeCase).length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedTestCases = [
                                          ...form.watch(typeCase),
                                        ];
                                        updatedTestCases.splice(index, 1);
                                        form.setValue(
                                          typeCase,
                                          updatedTestCases,
                                        );
                                      }}
                                      className="text-muted-foreground absolute top-0 right-0 hover:text-red-400 transition-colors px-3 py-2"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {form.watch("task_type") === "text" && (
                  <div className="space-y-4 p-4 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium  flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Text Response Settings
                      </h3>
                    </div>

                    <FormField
                      control={form.control}
                      name="text.question_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a question" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="text.word_limit_min"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Min Words</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter minimum words"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="text.word_limit_max"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Words</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter maximum words"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">
                          Guidelines (
                          {(form.watch("text.guidelines") || []).length})
                        </label>
                        <Button
                          size="sm"
                          type="button"
                          onClick={() => {
                            form.setValue("text.guidelines", [
                              ...form.watch("text.guidelines"),
                              "",
                            ]);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-600/80 text-white gap-2"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4" />
                          Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {form
                          .watch("text.guidelines")
                          .map((guideline, index) => (
                            <div key={index} className="flex gap-2 relative">
                              <Input
                                value={guideline}
                                onChange={(e) => {
                                  const updatedGuidelines = [
                                    ...form.watch("text.guidelines"),
                                  ];
                                  updatedGuidelines[index] = e.target.value;
                                  form.setValue(
                                    "text.guidelines",
                                    updatedGuidelines,
                                  );
                                }}
                                placeholder={`Guideline ${index + 1}`}
                                className=""
                              />
                              {form.watch("text.guidelines").length > 1 && (
                                <button
                                  onClick={() => {
                                    const updatedGuidelines = [
                                      ...form.watch("text.guidelines"),
                                    ];
                                    updatedGuidelines.splice(index, 1);
                                    form.setValue(
                                      "text.guidelines",
                                      updatedGuidelines,
                                    );
                                  }}
                                  className="text-zinc-500 absolute top-0 right-0 hover:text-red-400 transition-colors px-3 py-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Assign Users</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-xs h-8"
                  >
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {allInterns?.map((user) => {
                    const isSelected = form
                      .watch("assigned_to_ids")
                      .includes(user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleToggleUser(user.id)}
                        className={cn(
                          "relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-muted-foreground/50 hover:bg-muted/50",
                        )}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}

                        {/* Avatar */}
                        <img
                          src={user.avatar || "/user.png"}
                          alt={user.full_name}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                        />

                        {/* User Info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {user.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            User
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {form.getValues("assigned_to_ids").length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {form.getValues("assigned_to_ids").length} user
                    {form.getValues("assigned_to_ids").length !== 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className=" grid grid-cols-3">
              <Button type="submit" className=" w-full col-span-2">
                Add Task
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// export function AddTasks({
//   open,
//   setOpen,
//   internshipId,
//   milestoneId,
//   setTasksData,
// }: AddConceptsProps) {
//   const [allInterns, setAllInterns] = React.useState<Interns[] | null>(null);

//   React.useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const interns = await getAllDomainIntern(internshipId);
//         setAllInterns(interns);
//         console.log(interns);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchData();
//   }, [internshipId]);

//   const form = useForm<z.infer<typeof tasksSchema>>({
//     resolver: zodResolver(tasksSchema),
//     defaultValues: tasksDefaultValues,
//   });

//   const handleSelectAll = () => {
//     if (form.watch("assigned_to_ids").length === allInterns?.length) {
//       form.setValue("assigned_to_ids", []);
//     } else {
//       form.setValue("assigned_to_ids", allInterns?.map((u) => u.id) || []);
//     }
//   };

//   const handleToggleUser = (userId: string) => {
//     form.setValue(
//       "assigned_to_ids",
//       form.getValues("assigned_to_ids").includes(userId)
//         ? form.getValues("assigned_to_ids").filter((id) => id !== userId)
//         : [...form.getValues("assigned_to_ids"), userId]
//     );
//   };

//   const isAllSelected =
//     form.watch("assigned_to_ids").length === allInterns?.length;

//   const normalizeTask = (task: any) => ({
//     ...task,

//     assignees: task.assigned_to ? [task.assigned_to] : [],

//     progress: {
//       status: task.status,
//       completed_at: task.completed_at ?? null,
//       updated_at: null,
//     },

//     // normalize date → YYYY-MM-DD
//     due_date: task.due_date?.split("T")[0] ?? null,
//   });
//   const onSubmit = async (values: z.infer<typeof tasksSchema>) => {
//     const res = await createTasks(milestoneId, values);

//     if (!res?.task) return;

//     const normalizedTask = normalizeTask(res.task);

//     setTasksData((prev) => [...prev, normalizedTask]);
//     setOpen(false);

//     console.log(normalizedTask);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="min-w-150">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <DialogHeader>
//               <DialogTitle>Add Task</DialogTitle>
//               <DialogDescription>
//                 Add a new task to the milestone
//               </DialogDescription>
//             </DialogHeader>
//             <div className=" space-y-5">
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Task Title</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Enter a task title" {...field} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Task Description</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Enter a task description"
//                         {...field}
//                       />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               <div className=" grid grid-cols-2 gap-5">
//                 <FormField
//                   control={form.control}
//                   name="due_date"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col">
//                       <FormLabel>Due Date</FormLabel>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <FormControl>
//                             <Button
//                               variant={"outline"}
//                               className={cn(
//                                 "w-[240px] pl-3 text-left font-normal",
//                                 !field.value && "text-muted-foreground"
//                               )}
//                             >
//                               {field.value ? (
//                                 format(field.value, "PPP")
//                               ) : (
//                                 <span>Pick a date</span>
//                               )}
//                               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                             </Button>
//                           </FormControl>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0" align="start">
//                           <Calendar
//                             mode="single"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             disabled={(date) => date < new Date()}
//                             captionLayout="dropdown"
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="status"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col">
//                       <FormLabel>Task Status</FormLabel>
//                       <FormControl>
//                         <NativeSelect
//                           value={field.value}
//                           onChange={field.onChange}
//                         >
//                           <NativeSelectOption value="">
//                             Select a status
//                           </NativeSelectOption>
//                           <NativeSelectOption value="todo">
//                             Todo
//                           </NativeSelectOption>
//                           <NativeSelectOption value="in_progress">
//                             In Progress
//                           </NativeSelectOption>
//                           <NativeSelectOption value="blocked">
//                             Blocked
//                           </NativeSelectOption>
//                           <NativeSelectOption value="done">
//                             Done
//                           </NativeSelectOption>
//                         </NativeSelect>
//                       </FormControl>
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <Label>Assign Users</Label>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={handleSelectAll}
//                     className="text-xs h-8"
//                   >
//                     {isAllSelected ? "Deselect All" : "Select All"}
//                   </Button>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   {allInterns?.map((user) => {
//                     const isSelected = form
//                       .watch("assigned_to_ids")
//                       .includes(user.id);
//                     return (
//                       <div
//                         key={user.id}
//                         onClick={() => handleToggleUser(user.id)}
//                         className={cn(
//                           "relative flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
//                           isSelected
//                             ? "border-primary bg-primary/5 ring-1 ring-primary"
//                             : "border-border hover:border-muted-foreground/50 hover:bg-muted/50"
//                         )}
//                       >
//                         {/* Selection indicator */}
//                         {isSelected && (
//                           <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
//                             <Check className="h-3 w-3 text-primary-foreground" />
//                           </div>
//                         )}

//                         {/* Avatar */}
//                         <img
//                           src={user.avatar || "/user.png"}
//                           alt={user.full_name}
//                           className="h-10 w-10 rounded-full object-cover shrink-0"
//                         />

//                         {/* User Info */}
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-medium text-foreground truncate">
//                             {user.full_name}
//                           </p>
//                           <p className="text-xs text-muted-foreground truncate">
//                             User
//                           </p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {form.getValues("assigned_to_ids").length > 0 && (
//                   <p className="text-xs text-muted-foreground">
//                     {form.getValues("assigned_to_ids").length} user
//                     {form.getValues("assigned_to_ids").length !== 1
//                       ? "s"
//                       : ""}{" "}
//                     selected
//                   </p>
//                 )}
//               </div>
//             </div>
//             <DialogFooter className=" grid grid-cols-3">
//               <Button type="submit" className=" w-full col-span-2">
//                 Add Task
//               </Button>
//               <DialogClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DialogClose>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
