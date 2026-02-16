declare interface tokenUser {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "mentor";
  gender: string;
  avatar?: string; // Optional field for profile picture
}

export interface Education {
  institution: string;
  field_of_study: string;
  highest_degree: string;
  graduation_year: string; // YYYY
  gpa: string; // stored as string (e.g. "4.0")
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

export interface FrontEndUserProfile {
  id: string;
  full_name: string;
  email: string;
  role: "user" | "mentor" | "admin";
  gender: "male" | "female" | "others";
  date_of_birth: string; // ISO date string
  avatar: string;
  phone_number: string;
  bio: string;
  current_city: string;
  current_state: string;
  current_status: "fresher" | "employed" | "self-employed" | "other";
  resume_link: string;
  portfolio_link: string;
  linkedin_link: string;
  github_link: string;
  hear_about: string;

  educations: Education[];
  experience: Experience[];
  skills: string[];
  languages: string[];
  certificates: Certificate[];
  interests: string[];

  created_at: string; // ISO date string
  updated_at: string; // ISO date string
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

export type OnlineStatus = {
  id: string;
  full_name: string;
  avatar: string;
  status: "online" | "away" | "offline";
  role: "user" | "mentor";
  domain: "tech" | "management" | "other";
  last_seen?: Date;
};

export type Interns = {
  id: string;
  full_name: string;
  email: string;
  avatar: string | null;

  domain_name: string;

  created_at: string; // ISO timestamp
  joined_at: string; // ISO timestamp
};

export type DomainDetailsProps = {
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
  difficulty_level: "beginner" | "intermediate" | "advanced";
  marketplace_category: string;
  max_seats: number;
};

interface DomainDetails extends DomainDetailsProps {
  id: string;
  join_count: number;
  seats_left: number;
  certificate_provided: boolean;
}

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
  due_date: string; // YYYY-MM-DD
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
  status: "draft" | "published" | "archived";
  order_index: number;

  progress: Progress;

  created_at: string;
  updated_at: string;
};

interface QuizAnswer {
  question_id: string;
  selected_option: number;
}

interface QuizSubmission {
  id: string;
  task_id: string;
  intern_id: string;
  task_type: "quiz";
  text_answer: string | null;
  selected_option: number | null;
  answers: QuizAnswer[];
  code_answer: string | null;
  output: string | null;
  score: number;
  status: "submitted" | "draft" | "evaluated";
  submitted_at: string; // ISO datetime
  updated_at: string;   // ISO datetime
}


export type Task = {
  id: string;
  milestone_id: string;

  title: string;
  description: string;
  status: "todo" | "in_progress" | "blocked" | "done";
  score: number;

  assigned_to: string | null;
  assignees: string[];

  progress: Progress;
  questions: Question[];
  submission: QuizSubmission;

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

  progress: AssignmentProgress;
  submission_types: SubmissionType

  submission: AssignmentSubmission;

  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

export type SubmissionStatus = "draft" | "submitted" | "graded" | "rejected" | "late" | "returned" | "not_started";
export type SubmissionType = "link" | "text" | "code" | "file";

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  intern_id: string;

  status: SubmissionStatus;
  submission_type: SubmissionType;

  text_content: string | null;
  code_content: string | null;
  link_url: string | null;

  score: number | null;
  feedback: string | null;

  submitted_at: string; // ISO timestamp
  graded_at: string | null;
  updated_at: string; // ISO timestamp
}

export type AssignmentProgress = {
  id: string | null;
  status: "not_started" | "submitted" | "graded";
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  graded_at: string | null;
  updated_at: string | null;
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
  end_date: string; // ISO date
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
  completed_items: string;
  completion_status: string;
  certificate_number: string;

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

export type ConceptFile = {
  id: string;

  concept_id: string;

  file_name: string;
  file_type: string; // e.g. "image/jpeg"
  file_url: string;

  uploaded_by_mentor_id: string | null;
  uploaded_by_user_id: string | null;

  created_at: string; // ISO timestamp
};

export type AssignmentFile = {
  id: string;

  concept_id: string;

  file_name: string;
  file_type: string; // e.g. "image/jpeg"
  file_url: string;

  uploaded_by_mentor_id: string | null;
  uploaded_by_user_id: string | null;

  created_at: string; // ISO timestamp
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

declare interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

export interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface ChatConversation {
  id: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export type Conversation = {
  conversation_id: string;

  user1_id: string;
  user1_role: "user" | "mentor";
  user1_name: string;
  user1_avatar: string;

  user2_id: string;
  user2_role: "user" | "mentor";
  user2_name: string;
  user2_avatar: string;

  last_message: string | null;
  last_message_at: string | null;

  updated_at: string;
};

type ChatUser = {
  conversation_id: string;
  id: string;
  role: "user" | "mentor";
  name: string;
  avatar: string;
  last_message: string | null;
  last_message_at: string | null;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;

  sender_id: string;
  sender_role: "user" | "mentor";
  sender_name: string;
  sender_avatar: string;

  message: string;
  status: "sent" | "delivered" | "read";

  created_at: string;
  delivered_at: string | null;
  updated_at: string;

  files: ChatFile[];
};

export type ChatFile = {
  id: string
  file_type: 'image' | 'pdf' | 'document' | 'file'
  file_name: string
  file_size: string
  file_url: string
  created_at: Date
};

export interface Coupon {
  id: string;
  code: string;
  percent_off: number; // e.g. 10 = 10% off
  is_active: boolean;
  max_uses: number;
  used_count: number;
  expires_at: string; // ISO date string
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface ChannelListType {
  id: string;
  channel_type: "general" | "tech" | "management";
  name: string;
  domain_name: "tech" | "management" | null;
  created_at: string; // ISO date string
}

export interface MessageListType {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_role: "user" | "mentor";
  sender_name: string;
  sender_avatar: string;
  message: string;
  created_at: string; // ISO date string
  files: ChatFile[];
}

export interface CertificateData {
  internId: string;
  internName: string;
  internshipTitle: string;
  domain_name: "tech" | "management" | string; // extend if needed
  start_date: string; // ISO date string
  end_date: string; // ISO date string
  weekly_hours: number;
  skills_required: string[];
  certificateNumber: string;
  mentor_full_name: string;
}

export type QuestionType = "quiz" | "coding" | "text";

export interface BaseQuestion {
  id: string;
  task_id: string;
  task_type: QuestionType;
  question_text: string;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestion extends BaseQuestion {
  task_type: "quiz";
  options: string[];
  starter_code: null;
  test_cases: null;
  expected_output: null;
}

export interface CodingTestCase {
  input: any[];
  output: any;
}

export interface CodingQuestion extends BaseQuestion {
  task_type: "coding";
  options: null;
  starter_code: string;
  test_cases: string[];
  expected_output: string[];
}

export interface TextQuestion extends BaseQuestion {
  task_type: "text";
  question_text: string;
  guidelines: string[];
  word_limit_min: number;
  word_limit_max: number;
}

export type Question = QuizQuestion | CodingQuestion | TextQuestion;
