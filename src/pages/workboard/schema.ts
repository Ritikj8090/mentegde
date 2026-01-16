import { z } from "zod";

export const milestonesSchema = z.object({
  title: z.string().min(2, {
    message: "Please enter a title for the milestone.",
  }),
  description: z.string().min(2, {
    message: "Please enter a description for the milestone.",
  }),
  order_index: z.number(),
  status: z.enum(["planned", "active", "archived"], {
    required_error: "Please select a status",
  }),
  start_date: z.date({
    required_error: "Please select a start date for the milestone.",
  }),
  due_date: z.date({
    required_error: "Please select a due date for the milestone.",
  }),
});

export const conceptsSchema = z.object({
  title: z.string().min(2, {
    message: "Please enter a title for the concept.",
  }),
  description: z.string().min(2, {
    message: "Please enter a description for the concept.",
  }),
  order_index: z.number(),
  status: z.enum(["draft", "published", "archived"], {
    required_error: "Please select a status",
  }),
});

export const tasksSchema = z.object({
  title: z.string().min(2, {
    message: "Please enter a title for the concept.",
  }),
  description: z.string().min(2, {
    message: "Please enter a description for the concept.",
  }),
  status: z.enum(["todo", "in_progress", "blocked", "done"], {
    required_error: "Please select a status",
  }),
  assigned_to: z.string().optional(),
  assigned_to_ids: z.array(z.string()).min(1, {
    message: "Please select at least one user.",
  }),
  due_date: z.date({
    required_error: "Please select a due date for the milestone.",
  })
});

export const assignmentsSchema = z.object({
  title: z.string().min(2, {
    message: "Please enter a title for the assignment.",
  }),
  description: z.string().min(2, {
    message: "Please enter a description for the assignment.",
  }),
  status: z.enum(["draft", "published", "closed"], {
    required_error: "Please select a status",
  }),
  max_score: z.number({
    required_error: "Please enter a maximum score for the assignment.",
  }).min(1),
  assigned_to: z.string().optional(),
  assigned_to_ids: z.array(z.string()).min(1, {
    message: "Please select at least one user to assign the assignment to.",
  }),
  assign_all: z.boolean(),
  due_date: z.date({
    required_error: "Please select a due date for the milestone.",
  }),
});

export const milestonesDefaultValues: z.infer<typeof milestonesSchema> = {
  title: "",
  description: "",
  order_index: 0,
  status: "planned",
  start_date: new Date(),
  due_date: new Date(),
};

export const conceptsDefaultValues: z.infer<typeof conceptsSchema> = {
  title: "",
  description: "",
  order_index: 0,
  status: "draft",
};

export const tasksDefaultValues: z.infer<typeof tasksSchema> = {
  title: "",
  description: "",
  status: "todo",
  assigned_to: "",
  assigned_to_ids: [],
  due_date: new Date(),
};

export const assignmentsDefaultValues: z.infer<typeof assignmentsSchema> = {
  title: "",
  description: "",
  status: "draft",
  max_score: 0,
  assigned_to: "",
  assigned_to_ids: [],
  assign_all: false,
  due_date: new Date(),
};
