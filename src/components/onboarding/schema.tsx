import { z } from "zod";

export const PersonalSchema = z.object({
  full_name: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female", "other", ""]),
  date_of_birth: z
    .date()
    .refine((date) => date <= new Date(), "Date of birth must be in the past"),
  avatar: z.string().optional(),
  phone_number: z.string().min(1, "Phone number is required"),
  bio: z.string().min(1, "Bio is required"),
  hear_about: z.string().min(1, "Heard about us is required"),
  current_status: z.string().min(1, "Current status is required"),
  current_city: z.string().min(1, "City is required"),
  current_state: z.string().min(1, "State is required"),
});

export const EducationalBackgroundSchema = z.object({
  highest_degree: z.string().min(1, "Highest degree is required"),
  institution: z.string().min(1, "Institution name is required"),
  field_of_study: z.string().min(1, "Field of study is required"),
  graduation_year: z.string().min(1, "Graduation year is required"),
  gpa: z.string().optional(),
});

export const EducationSchema = z.object({
  educations: z.array(EducationalBackgroundSchema),
})

export const ProfessionalExperienceSchema = z.object({
  location: z.string().min(1, "Current location is required"),
  company: z.string().min(1, "Company name is required"),
  experience: z.string().min(1, "Experience level is required"),
  title: z.string().min(1, "Current job title is required"),
  industry: z.string().min(1, "Industry is required"),
});

export const ExperienceSchema = z.object({
  experience: z.array(ProfessionalExperienceSchema).optional(),
});

export const CertificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  provider: z.string().min(1, "Provider is required"),
  link: z.string().url("Enter a valid URL"),
  start_date: z.date(),
  end_date: z.date(),
});

export const PreferencesSchema = z.object({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  certificates: z.array(CertificateSchema).optional(),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
  resume_link: z.string().url("Enter a valid resume URL"),
  portfolio_link: z.string().optional(),
  linkedin_link: z.string().url("Enter a valid LinkedIn URL"),
  github_link: z.string().url("Enter a valid GitHub URL"),
});
