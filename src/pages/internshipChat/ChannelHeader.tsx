import React from "react";
import { getActiveChannelIcons, getChannelColor } from ".";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Search, Users } from "lucide-react";
import { ChannelListType } from "@/index";

interface ChannelHeaderProps {
  activeChannelList: ChannelListType;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: Record<string, boolean>;
  setNotifications: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  showMembers: boolean;
  setShowMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChannelHeader = ({
  activeChannelList,
  showSearch,
  setShowSearch,
  notifications,
  setNotifications,
  showMembers,
  setShowMembers,
}: ChannelHeaderProps) => {
  return (
    <div className="h-14 px-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-1.5 rounded-md border",
            getChannelColor(activeChannelList.domain_name || "general"),
          )}
        >
          {getActiveChannelIcons(activeChannelList.domain_name || "general")}
        </div>
        <div>
          <h3 className="font-semibold">{activeChannelList.name}</h3>
          <p className="text-xs  text-muted-foreground">
            {activeChannelList.domain_name}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search in channel</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary"
              onClick={() =>
                setNotifications((prev) => ({
                  ...prev,
                  [activeChannelList.id]: !prev[activeChannelList.id],
                }))
              }
            >
              {notifications[activeChannelList.id] ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {notifications[activeChannelList.id]
              ? "Mute channel"
              : "Unmute channel"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                showMembers
                  ? "text-primary bg-primary/30 hover:bg-primary/30 hover:text-primary "
                  : "text-muted-foreground hover:text-primary",
              )}
              onClick={() => setShowMembers(!showMembers)}
            >
              <Users className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle members</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ChannelHeader;
