import { z } from "zod";

export const internshipSchema = z.object({
  internship_title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),

  approval_required: z.boolean(),
  host_domain: z.enum(["tech", "management"]),

  co_host_name: z.string().optional(),
  co_host_id: z.string().optional(),

  tech: z
    .object({
      domain_name: z.string().min(3),
      domain_description: z.string().min(10),
      skills_required: z.array(z.string()),
      tools_used: z.array(z.string()),
      tags: z.array(z.string()),
      start_date: z.date(),
      end_date: z.date(),
      application_deadline: z.date(),
      weekly_hours: z.number(),
      duration: z.string(),
      difficulty_level: z.enum(["beginner", "intermediate", "advanced"]),
      marketplace_category: z.string(),
      max_seats: z.number().min(1),
      certificate_provided: z.boolean(),
    })
    .optional(),

  management: z
    .object({
      domain_name: z.string().min(3),
      domain_description: z.string().min(10),
      skills_required: z.array(z.string()),
      tools_used: z.array(z.string()),
      tags: z.array(z.string()),
      start_date: z.date(),
      end_date: z.date(),
      application_deadline: z.date(),
      weekly_hours: z.number(),
      duration: z.string(),
      difficulty_level: z.enum(["beginner", "intermediate", "advanced"]),
      marketplace_category: z.string(),
      max_seats: z.number().min(1),
      certificate_provided: z.boolean(),
    })
    .optional(),
});

export const domainSchema = z.object({
  domain_name: z.string().min(3),
  domain_description: z.string().min(10),
  skills_required: z.array(z.string()),
  tools_used: z.array(z.string()),
  tags: z.array(z.string()),
  start_date: z.date(),
  end_date: z.date(),
  application_deadline: z.date(),
  weekly_hours: z.number(),
  duration: z.string(),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]),
  marketplace_category: z.string(),
  max_seats: z.number().min(1),
  certificate_provided: z.boolean(),
});

export const defaultValues: z.infer<typeof internshipSchema> = {
  internship_title: "",
  description: "",
  price: 0,

  approval_required: false,
  host_domain: "tech",

  co_host_name: "",

  tech: {
    domain_name: "tech",
    domain_description: "",
    skills_required: [],
    tools_used: [],
    tags: [],
    start_date: new Date(),
    end_date: new Date(),
    application_deadline: new Date(),
    weekly_hours: 0,
    duration: "",
    difficulty_level: "beginner",
    marketplace_category: "",
    max_seats: 0,
    certificate_provided: false,
  },
  management: {
    domain_name: "management",
    domain_description: "",
    skills_required: [],
    tools_used: [],
    tags: [],
    start_date: new Date(),
    end_date: new Date(),
    application_deadline: new Date(),
    weekly_hours: 0,
    duration: "",
    difficulty_level: "beginner",
    marketplace_category: "",
    max_seats: 0,
    certificate_provided: false,
  },
};
