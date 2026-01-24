import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusColor, getUserAvatarColor } from ".";
import { OnlineStatus } from "@/index";

interface MemberSidebarProps {
  filteredMembers: OnlineStatus[];
  showMembers: boolean;
}

const MemberSidebar = ({
  filteredMembers,
  showMembers,
}: MemberSidebarProps) => {
  return (
    <AnimatePresence>
      {showMembers && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 240, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-l overflow-hidden"
        >
          <div className="w-60 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium">Members</h4>
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                {filteredMembers.filter((u) => u.status === "online").length}{" "}
                online
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Online */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Online -{" "}
                  {filteredMembers.filter((u) => u.status === "online").length}
                </p>
                <div className="space-y-1">
                  {filteredMembers
                    .filter((u) => u.status === "online")
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer"
                      >
                        <div className="relative">
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src={user.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback
                              className={cn(
                                "text-white text-sm",
                                getUserAvatarColor(user.role),
                              )}
                            >
                              {user.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-zinc-900",
                              getStatusColor(user.status || "online"),
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-300 truncate">
                            {user.full_name}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] px-1 h-4",
                            user.role === "mentor"
                              ? "border-cyan-500/30 text-cyan-400"
                              : "border-amber-500/30 text-amber-400",
                          )}
                        >
                          {user.role === "mentor" ? "Mentor" : "Intern"}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>

              {/* Away */}
              {filteredMembers.filter((u) => u.status === "away").length >
                0 && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Away -{" "}
                    {filteredMembers.filter((u) => u.status === "away").length}
                  </p>
                  <div className="space-y-1">
                    {filteredMembers
                      .filter((u) => u.status === "away")
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer opacity-70"
                        >
                          <div className="relative">
                            <Avatar className="h-7 w-7">
                              <AvatarImage
                                src={user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback
                                className={cn(
                                  "text-white text-sm",
                                  getUserAvatarColor(user.role),
                                )}
                              >
                                {user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-zinc-900",
                                getStatusColor(user.status),
                              )}
                            />
                          </div>
                          <p className="text-sm text-zinc-400 truncate">
                            {user.full_name}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Offline */}
              {filteredMembers.filter((u) => u.status === "offline").length >
                0 && (
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                    Offline -{" "}
                    {
                      filteredMembers.filter((u) => u.status === "offline")
                        .length
                    }
                  </p>
                  <div className="space-y-1">
                    {filteredMembers
                      .filter((u) => u.status === "offline")
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors cursor-pointer opacity-50"
                        >
                          <div className="relative">
                            <Avatar className="h-7 w-7">
                              <AvatarImage
                                src={user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-zinc-600 to-zinc-700 text-white text-xs">
                                {user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-zinc-900",
                                getStatusColor(user.status),
                              )}
                            />
                          </div>
                          <p className="text-sm text-zinc-500 truncate">
                            {user.full_name}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MemberSidebar;
