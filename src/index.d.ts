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

export type Interns = {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;

  domain_name: string;

  created_at: string; // ISO timestamp
  joined_at: string;  // ISO timestamp
};


export type DomainDetails = {
  id: string;
  domain_name: string;
  domain_description: string;
  skills_required: string[];
  tools_used: string[];
  tags: string[];
  weekly_hours: number;
  duration: string;
  start_date: Date; // YYYY-MM-DD
  end_date: Date;
  application_deadline: Date;
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";
  marketplace_category: string;
  max_seats: number;
  join_count: number;
  seats_left: number;
  certificate_provided: boolean;
};

export type Mentor = {
  id: string;
  full_name: string;
  avatar: string | null;
  role: "host" | "co-host";
  domain: "tech" | "management";
  invite_status: "pending" | "accepted" | "rejected";
};

export type Internship = {
  id: string;
  internship_title: string;
  description: string;
  price: string; // returned as string from Postgres (numeric)

  host_domain: string;

  co_host_name: string;
  co_host_id: string;

  status: "draft" | "published" | "closed" | "deleted" | "submitted";
  approval_required: boolean;
  created_at: string;

  domains: {
    tech?: DomainDetails;
    management?: DomainDetails;
  };

  my_role: {
    role: "host" | "co-host";
    domain: "tech" | "management";
    invite_status: "pending" | "accepted" | "rejected";
  };

  host: Mentor[];
  co_host: Mentor[];
};

export type Workboard = {
  id: string;
  internship_id: string;
  domain_name: string;
  created_by: string;
  title: string;
  description: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  milestones: Milestone[];
};


export type Milestone = {
  id: string;
  workboard_id: string;

  title: string;
  description: string;
  order_index: number;

  start_date: string; // YYYY-MM-DD
  due_date: string;   // YYYY-MM-DD
  status: "planned" | "active" | "archived";

  concepts: Concept[];
  tasks: Task[];
  assignments: Assignment[];

  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

export type Concept = {
  id: string;
  milestone_id: string;

  title: string;
  description: string;
  status: "draft" | "published";
  order_index: number;

  progress: Progress;

  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  milestone_id: string;

  title: string;
  description: string;
  status: "todo" | "in_progress" | "blocked" | "done";

  assigned_to: string | null;
  assignees: string[];

  progress: Progress;

  created_by: string;

  due_date: string; // YYYY-MM-DD
  completed_at: string | null;

  created_at: string;
  updated_at: string;
};

export type Assignment = {
  id: string;
  milestone_id: string;

  title: string;
  description: string;
  status: "draft" | "published";

  max_score: number;
  due_date: string; // YYYY-MM-DD

  created_by: string;
  assignees: string[];

  created_at: string;
  updated_at: string;
};

export type Progress = {
  status: string | null;
  completed_at: string | null;
  updated_at: string | null;
};

export type OngoingInternshipsForIntern = {
  joined_id: string;
  joined_at: string; // ISO timestamp

  internship_id: string;
  internship_title: string;
  description: string;

  domain_id: string;
  domain_name: string;
  domain_title: string | null;
  domain_description: string;

  marketplace_category: string;
  difficulty_level: "Beginner" | "Intermediate" | "Advanced";

  duration: string; // e.g. "8 Weeks"
  weekly_hours: number;

  start_date: string; // ISO date
  end_date: string;   // ISO date
  application_deadline: string; // ISO date

  status: "draft" | "published" | "archived";
  approval_required: boolean;

  price: string; // backend sends as string
  max_seats: number;
  seats_left: number;
  join_count: number;

  progress_percent: string;

  total_items: string;
  completed_items: string;

  concepts_total: string;
  concepts_completed: string;

  tasks_total: string;
  tasks_assigned: string;
  tasks_completed: string;

  assignments_total: string;
  assignments_assigned: string;
  assignments_submitted: string;
  assignments_graded: string;

  created_at: string; // ISO timestamp

  workboard_id: string;
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
