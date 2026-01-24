import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStatusColor } from ".";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: "mentor" | "intern" | "admin";
  status: "online" | "away" | "offline";
  domain?: "tech" | "management";
}

interface ChannelUserProps {
  currentUser: User;
}

const ChannelUser = ({ currentUser }: ChannelUserProps) => {
  return (
    <div className="p-3 border-t border-zinc-800">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50">
        <div className="relative">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm">
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900",
              getStatusColor(currentUser.status),
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {currentUser.name}
          </p>
          <p className="text-xs text-zinc-500 capitalize">{currentUser.role}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-white"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-zinc-900 border-zinc-800"
          >
            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
              Set Status
            </DropdownMenuItem>
            <DropdownMenuItem className="text-zinc-300 focus:bg-zinc-800 focus:text-white">
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="text-red-400 focus:bg-zinc-800 focus:text-red-400">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChannelUser;
