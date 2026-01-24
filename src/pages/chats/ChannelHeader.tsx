import { getActiveChannelIcons, getChannelColor } from "../chatChannel";
import { cn } from "@/lib/utils";
import {  ChatUser } from "@/index";

interface ChannelHeaderProps {
  activeConversation: ChatUser;
}

const ChannelHeader = ({
  activeConversation,
}: ChannelHeaderProps) => {
  return (
    <div className="h-14 px-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "p-1.5 rounded-md border",
            getChannelColor(activeConversation.role || "general"),
          )}
        >
          {getActiveChannelIcons(activeConversation.role || "general")}
        </div>
        <div>
          <h3 className="font-semibold">{activeConversation.name}</h3>
          <p className="text-xs  text-muted-foreground">
            {activeConversation.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;
