declare interface tokenUser {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "mentor";
  gender: string;
  avatar?: string; // Optional field for profile picture
}

export interface Education {
  highest_degree: string;
  institution: string;
  field_of_study: string;
  graduation_year: string; // can be number later
  gpa?: string; // keep string to allow "N/A"
}

export interface Experience {
  company: string;
  location: string;
  experience: string;
  industry: string;
  title: string;
}

export interface Certificate {
  name: string;
  provider: string;
  link: string;
  start_date: Date; // ISO date
  end_date: Date; // optional
}

export interface FrontendUserProfile extends UserProfile {
  id: string;
  role: "user" | "mentor";
  skills: {
    id: string;
    owner_id: string;
    owner_type: "user" | "mentor";
    skill: string;
  }[];
  experiences: {
    id: string;
    owner_id: string;
    owner_type: "user" | "mentor";
    company: string;
    location: string;
    experience: string;
    industry: string;
    title: string;
  }[];
  educations: {
    id: string;
    owner_id: string;
    owner_type: "user" | "mentor";
    highest_degree: string;
    institution: string;
    field_of_study: string;
    graduation_year: string; // can be number later
    gpa?: string; // keep string to allow "N/A"
  }[];
  certificates: {
    id: string;
    owner_id: string;
    owner_type: "user" | "mentor";
    name: string;
    provider: string;
    link: string;
    start_date: Date; // ISO date
    end_date: Date; // optional
  }[];
  interests: {
    id: string;
    owner_id: string;
    owner_type: "user" | "mentor";
    interest: string;
  }[];
  languages: {
    id: string;
    owner_id: string;
    owner_type: "user" | "mentor";
    language: string;
  }[];
  
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  gender: "male" | "female" | "other" | "";
  date_of_birth: Date; // ISO string
  avatar?: string;
  phone_number: string;
  bio: string;

  current_status: string;
  current_city: string;
  current_state: string;

  hear_about: string;

  educations: Education[];
  experience?: Experience[];

  skills: string[];
  languages: string[];
  certificates?: Certificate[];
  interests: string[];

  resume_link: string;
  portfolio_link?: string;
  linkedin_link: string;
  github_link: string;
}

export type DomainDetails = {
  description: string;
  skills_required: string[];
  tools_used: string[];
  tags: string[];
  tasks: string[];
  deliverables: string[];
  milestones: string[];
  weekly_hours: number;
  duration: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  application_deadline: string;
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  marketplace_category: string;
  max_seats: number;
  certificate_provided: boolean;
};

export type Mentor = {
  id: string;
  full_name: string;
  avatar: string | null;
  role: "host" | "co-host";
  domain: "tech" | "management";
};

export type Internship = {
  id: string;
  internship_title: string;
  description: string;
  price: string; // returned as string from Postgres (numeric)
  status: "draft" | "published" | "archived";
  approval_required: boolean;
  created_at: string;

  domains: {
    tech?: DomainDetails;
    management?: DomainDetails;
  };

  my_role: {
    role: "host" | "co-host";
    domain: "tech" | "management";
  };

  host: Mentor[];
  co_host: Mentor[];
};


declare interface JwtUserPayload {
  id: string;
  username: string;
  email: string;
  role: "user" | "mentor";
  iat: number;
  exp: number;
}

declare interface SessionData {
  id: string;
  mentor_id: string;
  title: string;
  description: string;
  topic: string;
  duration: number;
  max_participants: number;
  format: string;
  prerequisites: string | null;
  materials: string | null;
  skill_level: string;
  session_type: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  stream_url: string | null;
}

declare interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderRole: "mentor" | "user";
  senderName: string;
  text?: string;
  file?: string;
  timestamp: string;
}

declare interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  user1_name: string;
  user2_name: string;
  user1_avatar?: string;
  user2_avatar?: string;
  last_message: string;
  last_message_at: string;
  online: boolean;
  F;
}

declare interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}
