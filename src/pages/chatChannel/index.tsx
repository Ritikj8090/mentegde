import { Briefcase, Cpu, Globe, Heart, Laugh, ThumbsUp } from "lucide-react";

export type Channel = "tech" | "management" | "general";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: "mentor" | "intern" | "admin";
  status: "online" | "away" | "offline";
  domain?: "tech" | "management";
}

declare interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  reacted: boolean;
}

export interface Message {
  id: string;
  user: User;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
  attachments?: {
    type: "image" | "file" | "code";
    name: string;
    url?: string;
    preview?: string;
  }[];
  replyTo?: {
    user: string;
    content: string;
  };
  isPinned?: boolean;
  isEdited?: boolean;
  readBy?: string[];
}

export const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
};

export const getStatusColor = (status: User["status"]) => {
  switch (status) {
    case "online":
      return "bg-emerald-500";
    case "away":
      return "bg-amber-500";
    default:
      return "bg-zinc-500";
  }
};

export const getUserAvatarColor = (role: "mentor" | "user") => {
  switch (role) {
    case "mentor":
      return "bg-gradient-to-br from-cyan-500 to-blue-600";
    case "user":
      return "bg-gradient-to-br from-amber-500 to-orange-600";
    default:
      return "bg-gradient-to-br from-violet-500 to-purple-600";
  }
};

export const getRoleColor = (role: "mentor" | "user") => {
  switch (role) {
    case "mentor":
      return "text-cyan-400";
    case "user":
      return "text-amber-400";
    default:
      return "text-zinc-400";
  }
};

export const getChannelColor = (color: string) => {
  switch (color) {
    case "general":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    case "tech":
      return "bg-violet-500/20 text-violet-400 border-violet-500/30";
    case "management":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    default:
      return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
  }
};

export const emojiMap: Record<string, string> = {
  thumbsup: "👍",
  heart: "❤️",
  laugh: "😂",
  tada: "🎉",
  fire: "🔥",
  wave: "👋",
  check: "✅",
  eyes: "👀",
  coffee: "☕",
  "100": "💯",
  raised_hand: "✋",
};

export const quickEmojis = [
  { key: "thumbsup", icon: ThumbsUp },
  { key: "heart", icon: Heart },
  { key: "laugh", icon: Laugh },
];

export const channels: {
  id: Channel;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}[] = [
  {
    id: "tech",
    name: "Tech",
    icon: Cpu,
    description: "Technical discussions & coding help",
    color: "cyan",
  },
  {
    id: "management",
    name: "Management",
    icon: Briefcase,
    description: "Project updates & coordination",
    color: "violet",
  },
  {
    id: "general",
    name: "General",
    icon: Globe,
    description: "General chat & announcements",
    color: "emerald",
  },
];

export const users: User[] = [
  {
    id: "u1",
    name: "Sarah Johnson",
    role: "mentor",
    status: "online",
    domain: "tech",
  },
  {
    id: "u2",
    name: "Mike Chen",
    role: "mentor",
    status: "online",
    domain: "management",
  },
  {
    id: "u3",
    name: "Alex Rivera",
    role: "intern",
    status: "online",
    domain: "tech",
  },
  {
    id: "u4",
    name: "Priya Sharma",
    role: "intern",
    status: "away",
    domain: "tech",
  },
  {
    id: "u5",
    name: "James Wilson",
    role: "intern",
    status: "online",
    domain: "management",
  },
  {
    id: "u6",
    name: "Emily Zhang",
    role: "intern",
    status: "offline",
    domain: "tech",
  },
  {
    id: "u7",
    name: "Omar Hassan",
    role: "intern",
    status: "online",
    domain: "management",
  },
  { id: "u8", name: "Sofia Martinez", role: "admin", status: "online" },
];

export const currentUser = users[2];

export const initialMessages: Record<Channel, Message[]> = {
  tech: [
    {
      id: "t1",
      user: users[0],
      content:
        "Welcome to the tech channel! Feel free to ask any coding questions here.",
      timestamp: new Date(Date.now() - 86400000 * 2),
      reactions: [
        {
          emoji: "wave",
          count: 5,
          users: ["Alex", "Priya", "Emily"],
          reacted: true,
        },
      ],
      isPinned: true,
    },
    {
      id: "t2",
      user: users[3],
      content:
        "Has anyone worked with the new React Server Components? I'm having trouble understanding when to use them.",
      timestamp: new Date(Date.now() - 3600000 * 5),
      reactions: [],
    },
    {
      id: "t3",
      user: users[0],
      content:
        "Great question! Server Components are best for data fetching and static content. Use Client Components for interactivity.",
      timestamp: new Date(Date.now() - 3600000 * 4),
      reactions: [
        {
          emoji: "thumbsup",
          count: 3,
          users: ["Priya", "Alex"],
          reacted: false,
        },
      ],
      replyTo: {
        user: "Priya Sharma",
        content: "Has anyone worked with the new React Server Components?",
      },
    },
    {
      id: "t4",
      user: users[2],
      content:
        "I just pushed my first PR! Can someone review it when they get a chance?",
      timestamp: new Date(Date.now() - 3600000 * 2),
      reactions: [
        {
          emoji: "tada",
          count: 4,
          users: ["Sarah", "Priya", "Emily"],
          reacted: false,
        },
        { emoji: "fire", count: 2, users: ["Sarah"], reacted: false },
      ],
      attachments: [
        {
          type: "code",
          name: "feature-auth.tsx",
          preview: "// Authentication feature implementation",
        },
      ],
    },
    {
      id: "t5",
      user: users[5],
      content: "Congrats Alex! I'll take a look at it this afternoon.",
      timestamp: new Date(Date.now() - 3600000),
      reactions: [],
      replyTo: { user: "Alex Rivera", content: "I just pushed my first PR!" },
    },
  ],
  management: [
    {
      id: "m1",
      user: users[1],
      content:
        "Team standup reminder: Every Monday and Thursday at 10 AM IST. Please be on time!",
      timestamp: new Date(Date.now() - 86400000 * 3),
      reactions: [
        { emoji: "check", count: 6, users: ["James", "Omar"], reacted: true },
      ],
      isPinned: true,
    },
    {
      id: "m2",
      user: users[4],
      content:
        "I've updated the project timeline in Notion. Please review and add your tasks.",
      timestamp: new Date(Date.now() - 3600000 * 8),
      reactions: [{ emoji: "eyes", count: 2, users: ["Mike"], reacted: false }],
      attachments: [{ type: "file", name: "Project_Timeline_v2.pdf" }],
    },
    {
      id: "m3",
      user: users[6],
      content:
        "Quick question about the sprint planning - should we include the bug fixes in this sprint or create a separate backlog?",
      timestamp: new Date(Date.now() - 3600000 * 3),
      reactions: [],
    },
    {
      id: "m4",
      user: users[1],
      content:
        "Let's create a separate backlog for bug fixes and prioritize them based on severity. We can discuss this in detail during tomorrow's standup.",
      timestamp: new Date(Date.now() - 3600000 * 2),
      reactions: [
        {
          emoji: "thumbsup",
          count: 2,
          users: ["Omar", "James"],
          reacted: true,
        },
      ],
      replyTo: {
        user: "Omar Hassan",
        content: "Quick question about the sprint planning...",
      },
    },
  ],
  general: [
    {
      id: "g1",
      user: users[7],
      content:
        "Welcome everyone to the Full Stack Development Internship! This is the general channel for announcements and casual conversations.",
      timestamp: new Date(Date.now() - 86400000 * 7),
      reactions: [
        { emoji: "wave", count: 8, users: ["Everyone"], reacted: true },
      ],
      isPinned: true,
    },
    {
      id: "g2",
      user: users[0],
      content:
        "Don't forget - we have a virtual coffee chat this Friday at 4 PM. It's a great opportunity to get to know each other better!",
      timestamp: new Date(Date.now() - 86400000),
      reactions: [
        { emoji: "coffee", count: 5, users: ["Alex", "Priya"], reacted: true },
        { emoji: "heart", count: 3, users: ["James"], reacted: false },
      ],
      attachments: [
        {
          type: "image",
          name: "coffee-chat-invite.png",
          url: "/placeholder.svg?height=200&width=300",
        },
      ],
    },
    {
      id: "g3",
      user: users[3],
      content: "That sounds fun! Will there be any icebreaker activities?",
      timestamp: new Date(Date.now() - 3600000 * 20),
      reactions: [],
    },
    {
      id: "g4",
      user: users[4],
      content: "I can prepare some trivia questions if everyone's interested!",
      timestamp: new Date(Date.now() - 3600000 * 18),
      reactions: [
        {
          emoji: "100",
          count: 4,
          users: ["Priya", "Alex", "Sarah"],
          reacted: true,
        },
      ],
    },
    {
      id: "g5",
      user: users[2],
      content:
        "Count me in for the trivia! Also, is anyone else struggling with the time zone differences for meetings?",
      timestamp: new Date(Date.now() - 3600000 * 6),
      reactions: [
        {
          emoji: "raised_hand",
          count: 3,
          users: ["Omar", "Emily"],
          reacted: false,
        },
      ],
    },
  ],
};

export const getActiveChannelIcons = (activeChannelIcon: string) => {
  switch (activeChannelIcon) {
    case "tech":
      return <Cpu className="w-4 h-4" />;
    case "management":
      return <Briefcase className="w-4 h-4" />;
    case "general":
      return <Globe className="w-4 h-4" />;
  }
};
