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

const taskQuizSchema = z.object({
  question_text: z.string().min(2),
  options: z.array(z.string().min(1)).length(4),
  correct_option: z.string(),
});

const taskCodingSchema = z.object({
  question_text: z.string().min(2),
  starter_code: z.string().min(2),
  test_cases: z.array(z.string()).min(1),
  expected_output: z.array(z.string()).min(1),
  language: z.string(),
});

const taskTextSchema = z.object({
  question_text: z.string().min(2),
  guidelines: z.array(z.string()).min(1),
  word_limit_min: z.number(),
  word_limit_max: z.number(),
});

const baseTaskSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  status: z.enum(["todo", "in_progress", "blocked", "done"]),
  assigned_to: z.string().optional(),
  assigned_to_ids: z.array(z.string()).min(1),
  due_date: z.date(),
  score: z.number(),
});

export const tasksSchema = z.intersection(
  baseTaskSchema,
  z.discriminatedUnion("task_type", [
    z.object({
      task_type: z.literal("quiz"),
      quiz: z.array(taskQuizSchema),
    }),

    z.object({
      task_type: z.literal("coding"),
      coding: taskCodingSchema,
    }),

    z.object({
      task_type: z.literal("text"),
      text: taskTextSchema,
    }),
  ]),
);

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
  max_score: z
    .number({
      required_error: "Please enter a maximum score for the assignment.",
    })
    .min(1),
  assigned_to: z.string().optional(),
  assigned_to_ids: z.array(z.string()).min(1, {
    message: "Please select at least one user to assign the assignment to.",
  }),
  assign_all: z.boolean().optional(),
  due_date: z.date({
    required_error: "Please select a due date for the milestone.",
  }),
  submission_types: z.string().min(1, {
    message: "Please select at least one submission type.",
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
  task_type: "quiz",
  score: 0,
  quiz: [
    {
      question_text: "",
      options: ["", "", "", ""],
      correct_option: "0",
    },
  ],
  coding: {
    question_text: "",
    starter_code: "",
    test_cases: [""],
    expected_output: [""],
    language: "",
  },
  text: {
    question_text: "",
    guidelines: [""],
    word_limit_min: 0,
    word_limit_max: 0,
  },
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
  submission_types: "",
};
