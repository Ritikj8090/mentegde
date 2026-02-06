import { Badge } from "@/components/ui/badge";
import { Task } from "@/index";
import { cn } from "@/lib/utils";
import {
  Award,
  CheckCircle2,
  Clock,
  Code,
  FileCode,
  FileImage,
  FileText,
  HelpCircle,
  Link2,
  MessageSquare,
  Play,
  Send,
  Video,
} from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { color: string; icon: React.ReactNode; label: string }
  > = {
    pending: {
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <Clock className="h-3 w-3" />,
      label: "Pending",
    },
    todo: {
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <Clock className="h-3 w-3" />,
      label: "To Do",
    },
    draft: {
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <Clock className="h-3 w-3" />,
      label: "Draft",
    },
    "in-progress": {
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      icon: <Play className="h-3 w-3" />,
      label: "In Progress",
    },
    completed: {
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Completed",
    },
    done: {
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Done",
    },
    published: {
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Published",
    },
    submitted: {
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      icon: <Send className="h-3 w-3" />,
      label: "Submitted",
    },
    archived: {
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      icon: <Send className="h-3 w-3" />,
      label: "Archived",
    },
    graded: {
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      icon: <Award className="h-3 w-3" />,
      label: "Graded",
    },
  };

  const { color, icon, label } = config[status] || config.pending;

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", color)}>
      {icon}
      {label}
    </Badge>
  );
}

export function FileIcon({ type }: { type:string }) {
  const t = type.includes("image") ? "image" : "pdf";
  const icons = {
    pdf: <FileText className="h-4 w-4 text-red-400" />,
    video: <Video className="h-4 w-4 text-purple-400" />,
    doc: <FileCode className="h-4 w-4 text-blue-400" />,
    image: <FileImage className="h-4 w-4 text-green-400" />,
    link: <Link2 className="h-4 w-4 text-cyan-400" />,
  };
  return icons[t];
}

export function TaskTypeBadge({ type }: { type: Task['questions'][0]['task_type'] }) {
  const config = {
    quiz: {
      color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      icon: <HelpCircle className="h-3 w-3" />,
      label: "Quiz",
    },
    coding: {
      color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      icon: <Code className="h-3 w-3" />,
      label: "Code",
    },
    text: {
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      icon: <MessageSquare className="h-3 w-3" />,
      label: "Text",
    },
  };

  const { color, icon, label } = config[type];

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", color)}>
      {icon}
      {label}
    </Badge>
  );
}
