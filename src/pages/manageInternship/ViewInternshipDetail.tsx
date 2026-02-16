import { UPLOAD_PHOTOS_URL } from "@/components/config/CommonBaseUrl";
import { RootState } from "@/components/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Internship } from "@/index";
import { cn } from "@/lib/utils";
import { getAllDomainIntern } from "@/utils/internship";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  Users,
  Wrench,
  Tag,
  GraduationCap,
  User,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { useSelector } from "react-redux";

interface InternshipDetailsModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  internship: Internship;
}

const getDifficultyColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "intermediate":
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "advanced":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "published":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "draft":
      return "bg-muted text-muted-foreground border-border";
    case "archived":
      return "bg-red-500/15 text-red-400 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export interface InternsProfile {
  id: string;
  full_name: string;
  email: string;
  avatar: string;
  domain_name: "tech" | "management";
  created_at: string; // ISO date string
  joined_at: string; // ISO date string
}

export function ViewInternshipDetail({
  open,
  setOpen,
  internship,
}: InternshipDetailsModalProps) {
  if (!internship) return null;

  const domainKeys = Object.keys(internship.domains) as (
    | "tech"
    | "management"
  )[];

  const user = useSelector((state: RootState) => state.auth.user);

  const [activeInternTab, setActiveInternTab] = useState("all");
  const [joinedInterns, setJoinedInterns] = useState<InternsProfile[]>([]);

  useEffect(() => {
    const fetchInternshipInterns = async () => {
      const res = await getAllDomainIntern(internship.id);
      setJoinedInterns(res);
    };
    fetchInternshipInterns();
  }, [internship.id, internship.host_domain]);

  const filteredInterns =
    activeInternTab === "all"
      ? joinedInterns
      : joinedInterns.filter(
          (intern) => intern.domain_name === activeInternTab,
        );

  const techInternsCount = joinedInterns.filter(
    (i) => i.domain_name === "tech",
  ).length;
  const mgmtInternsCount = joinedInterns.filter(
    (i) => i.domain_name === "management",
  ).length;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-hidden flex flex-col px-0 pb-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <DialogTitle className="md:text-xl font-semibold">
                {internship.internship_title}
              </DialogTitle>
              <p className="md:text-sm text-xs text-muted-foreground line-clamp-2">
                {internship.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "hidden md:inline capitalize",
                getStatusColor(internship.status),
              )}
            >
              {internship.status}
            </Badge>
          </div>

          {/* Price and Meta */}
          <div className="flex items-center gap-4 pt-3">
            <div className=" flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5 text-primary">
                <FaRupeeSign className="h-4 w-4" />
                <span className="font-semibold">{internship.price}</span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "md:hidden inline capitalize",
                  getStatusColor(internship.status),
                )}
              >
                {internship.status}
              </Badge>
            </div>
            {internship.approval_required && user?.role === "mentor" && (
              <Badge
                variant="outline"
                className="bg-amber-500/15 text-amber-400 border-amber-500/30"
              >
                Approval Required
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-6">
          {/* Host & Co-host Section */}
          <div className="space-y-3">
            <h3 className="font-bold">TEAM</h3>
            <div className="flex flex-col md:grid grid-cols-2 gap-3">
              {/* Host */}
              {internship.host.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-white font-medium shrink-0">
                    {h.avatar ? (
                      <img
                        src={h.avatar || "/user.png"}
                        alt={h.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      h.full_name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {h.full_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {h.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">
                        {h.domain}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Co-host */}
              {internship.co_host.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-medium shrink-0">
                    {c.avatar ? (
                      <img
                        src={c.avatar || "/user.png"}
                        alt={c.full_name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      c.full_name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {c.full_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {c.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">
                        {c.domain}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {joinedInterns.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-muted-foreground text-sm uppercase tracking-wide flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  Joined Interns
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  >
                    {joinedInterns.length}
                  </Badge>
                </h3>
              </div>

              {/* Intern Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveInternTab("all")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                    activeInternTab === "all" && "bg-primary/40"
                  }`}
                >
                  All ({joinedInterns.length})
                </button>
                <button
                  onClick={() => setActiveInternTab("tech")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                    activeInternTab === "tech" && "bg-primary/40"
                  }`}
                >
                  Tech ({techInternsCount})
                </button>
                <button
                  onClick={() => setActiveInternTab("management")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                    activeInternTab === "management" && "bg-primary/40"
                  }`}
                >
                  Management ({mgmtInternsCount})
                </button>
              </div>

              {/* Interns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-1">
                {filteredInterns.map((intern, index) => (
                  <div
                    key={intern.id}
                    className="group flex items-center gap-3 p-3 rounded-xl border transition-all"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <Avatar
                        className={`h-9 w-9 ring-2 ${
                          intern.domain_name === "tech"
                            ? "ring-cyan-500/40"
                            : "ring-violet-500/40"
                        }`}
                      >
                        <AvatarImage
                          src={intern.avatar || "/placeholder.svg"}
                          alt={intern.full_name}
                        />
                        <AvatarFallback
                          className={`text-white font-medium text-sm ${
                            intern.domain_name === "tech"
                              ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                              : "bg-gradient-to-br from-violet-400 to-purple-500"
                          }`}
                        >
                          {intern.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {intern.full_name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1.5 py-0 capitalize ${
                            intern.domain_name === "tech"
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                              : "bg-violet-500/10 text-violet-400 border-violet-500/30"
                          }`}
                        >
                          {intern.domain_name}
                        </Badge>
                      </div>
                    </div>
                    <Sparkles className="h-3.5 w-3.5 text-zinc-600 group-hover:text-amber-400 transition-colors" />
                  </div>
                ))}
              </div>

              {filteredInterns.length === 0 && (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No interns in this category yet
                </div>
              )}
            </div>
          )}

          {/* Domain Tabs */}
          <Tabs defaultValue={domainKeys[0]} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-11">
              {domainKeys.map((key) => (
                <TabsTrigger key={key} value={key} className="capitalize h-9">
                  {key === "tech" ? "Tech Domain" : "Management Domain"}
                </TabsTrigger>
              ))}
            </TabsList>

            {domainKeys.map((key) => {
              const domain = internship.domains[key];
              if (!domain) return null;

              return (
                <TabsContent key={key} value={key} className="mt-4 space-y-5">
                  {/* Domain Description */}
                  <p className="text-sm text-muted-foreground">
                    {domain.domain_description}
                  </p>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Weekly Hours
                      </p>
                      <p className="font-semibold">{domain.weekly_hours}h</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold">{domain.duration}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        Seats Left
                      </p>
                      <p className="font-semibold">
                        {domain.seats_left}/{domain.max_seats}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
                      <GraduationCap className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Level</p>
                      <Badge
                        variant="outline"
                        className={`mt-1 ${getDifficultyColor(
                          domain.difficulty_level,
                        )}`}
                      >
                        {domain.difficulty_level}
                      </Badge>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Start Date
                      </p>
                      <p className="text-sm font-medium">
                        {format(domain.start_date, "dd MMMM yyyy")}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        End Date
                      </p>
                      <p className="text-sm font-medium">
                        {format(domain.end_date, "dd MMMM yyyy")}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Apply By
                      </p>
                      <p className="text-sm font-medium">
                        {format(domain.application_deadline, "dd MMMM yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Skills Required
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {domain.skills_required.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tools Used */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      Tools Used
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {domain.tools_used.map((tool) => (
                        <Badge key={tool} variant="secondary">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {domain.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="bg-muted/50"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Marketplace Category:{" "}
                      <span className="text-foreground font-medium">
                        {domain.marketplace_category}
                      </span>
                    </p>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
