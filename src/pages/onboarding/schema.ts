import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
  gpa: z
    .string()
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 4;
    }, "GPA must be between 0.00 and 4.00")
    .refine(
      (val) => /^\d(\.\d{1,2})?$/.test(val),
      "GPA can have at most 2 decimal places",
    ),
});

export const EducationSchema = z.object({
  educations: z.array(EducationalBackgroundSchema),
});

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

export const PersonalSchemaDefaultValue: z.infer<typeof PersonalSchema> = {
  full_name: "Aditya Tiwari",
  email: "AyKqI@example.com",
  gender: "male",
  date_of_birth: new Date(),
  avatar: "https://unsplash.com/s/photos/profile",
  phone_number: "1234567890",
  bio: "I'm a software developer",
  hear_about: "google",
  current_status: "employed",
  current_city: "Pune",
  current_state: "Maharashtra",
};

export const EducationSchemaDefaultValue: z.infer<typeof EducationSchema> = {
  educations: [
    {
      highest_degree: "Master's Degree",
      institution: "IIT Bombay",
      field_of_study: "Computer Science",
      graduation_year: "2023",
      gpa: "4.0",
    },
  ],
};

export const ExperienceSchemaDefaultValue: z.infer<typeof ExperienceSchema> = {
  experience: [
    {
      location: "Pune",
      company: "Google",
      experience: "Entry Level (0-2 years)",
      title: "Software Engineer",
      industry: "Tech",
    },
  ],
};

export const PreferencesSchemaDefaultValue: z.infer<typeof PreferencesSchema> =
  {
    skills: ["React", "Node.js", "Python"],
    languages: ["English", "Hindi"],
    certificates: [
      {
        name: "Certificate 1",
        provider: "Provider 1",
        link: "https://example.com/certificate1.pdf",
        start_date: new Date(),
        end_date: new Date(),
      },
    ],
    interests: ["Coding", "Reading", "Traveling"],
    resume_link: "https://example.com/resume.pdf",
    portfolio_link: "https://example.com/portfolio",
    linkedin_link: "https://www.linkedin.com/in/aditya-tiwari/",
    github_link: "https://github.com/aditya-tiwari",
  };
