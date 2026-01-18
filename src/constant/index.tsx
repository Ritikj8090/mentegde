import {
  User,
  GraduationCap,
  Briefcase,
  Heart,
  FileCheck,
} from "lucide-react";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const LOGO_NAME = 'Instant Mentor'
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const areasOfInterestOptions = [
  { id: "software-development", label: "Software Development" },
  { id: "data-science", label: "Data Science" },
  { id: "product-management", label: "Product Management" },
  { id: "ux-design", label: "UX Design" },
  { id: "marketing", label: "Marketing" },
  { id: "business", label: "Business" },
];

export const availabilityOptions = [
  { id: "weekday-mornings", label: "Weekday Mornings" },
  { id: "weekday-afternoons", label: "Weekday Afternoons" },
  { id: "weekday-evenings", label: "Weekday Evenings" },
  { id: "weekend-mornings", label: "Weekend Mornings" },
  { id: "weekend-afternoons", label: "Weekend Afternoons" },
  { id: "weekend-evenings", label: "Weekend Evenings" },
];

export const expertiseOptions = [
  { id: "software-development", label: "Software Development" },
  { id: "data-science", label: "Data Science" },
  { id: "product-management", label: "Product Management" },
  { id: "ux-design", label: "UX Design" },
  { id: "marketing", label: "Marketing" },
  { id: "business", label: "Business" },
];

export const languageOptions = [
  { id: "english", label: "English" },
  { id: "spanish", label: "Spanish" },
  { id: "french", label: "French" },
  { id: "german", label: "German" },
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
];

export const menteeLevelOptions = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const durations = [
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hours" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

export const participantLimits = [
  { value: "1", label: "1 student (1:1)" },
  { value: "5", label: "Up to 5 students" },
  { value: "10", label: "Up to 10 students" },
  { value: "15", label: "Up to 15 students" },
  { value: "20", label: "Up to 20 students" },
];

export const skillLevels = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const topics = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "data-science", label: "Data Science" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "devops", label: "DevOps" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "blockchain", label: "Blockchain" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "product-management", label: "Product Management" },
];

export const defaultAvatars = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9439775.jpg-4JVJWOjPksd3DtnBYJXoWHA5lc1DU9.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238645_11475210.jpg-lU8bOe6TLt5Rv51hgjg8NT8PsDBmvN.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/375238208_11475222.jpg-poEIzVHAGiIfMFQ7EiF8PUG1u0Zkzz.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dd.jpg-4MCwPC2Bec6Ume26Yo1kao3CnONxDg.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334178.jpg-Y74tW6XFO68g7N36SE5MSNDNVKLQ08.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5295.jpg-fLw0wGGZp8wuTzU5dnyfjZDwAHN98a.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9720029.jpg-Yf9h2a3kT7rYyCb648iLIeHThq5wEy.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27470341_7294795.jpg-XE0zf7R8tk4rfA1vm4fAHeZ1QoVEOo.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/799.jpg-0tEi4Xvg5YsFoGoQfQc698q4Dygl1S.jpeg",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9334228.jpg-eOsHCkvVrVAwcPHKYSs5sQwVKsqWpC.jpeg",
];

export const steps = [
  {
    id: 1,
    title: "Personal Information",
    description: "Tell us about yourself",
    icon: User,
  },
  {
    id: 2,
    title: "Educational Background",
    description: "Your academic journey",
    icon: GraduationCap,
  },
  {
    id: 3,
    title: "Professional Experience",
    description: "Your work experience",
    icon: Briefcase,
  },
  {
    id: 4,
    title: "Preferences & Interests",
    description: "What interests you most",
    icon: Heart,
  },
  {
    id: 5,
    title: "Review & Submit",
    description: "Confirm your information",
    icon: FileCheck,
  },
];

export const skillOptions = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "TypeScript",
  "Java",
  "C++",
  "SQL",
  "MongoDB",
  "AWS",
];

export const interestOptions = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "UI/UX Design",
  "Cybersecurity",
  "Cloud Computing",
];

export const degreeOptions = [
  "High School",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Other",
];

export const experienceLevelOptions = [
  "Entry Level (0-2 years)",
  "Mid Level (3-5 years)",
  "Senior Level (6-10 years)",
  "Lead/Principal (10+ years)",
  "Student/Recent Graduate",
];