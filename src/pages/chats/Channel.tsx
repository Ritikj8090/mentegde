import { cn } from "@/lib/utils";
import { getActiveChannelIcons, getChannelColor } from "../chatChannel";
import { ChannelListType, ChatUser } from "@/index";

interface ChannelProps {
  conversations: ChatUser[];
  activeConversation: ChatUser | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<ChatUser | null>>;
}
const ChannelPage = ({
  conversations,
  activeConversation,
  setActiveConversation,
}: ChannelProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
        Channels
      </p>
      {conversations.map((conversation) => {
        const Icon = getActiveChannelIcons(conversation.role || "general");
        const isActive = activeConversation && activeConversation.id === conversation.id;
        return (
          <button
            key={conversation.id}
            onClick={() => setActiveConversation(conversation)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
              isActive
                ? " bg-muted-foreground/20"
                : " text-muted-foreground hover:bg-muted-foreground/10",
            )}
          >
            <div
              className={cn(
                "p-1.5 rounded-md border",
                isActive
                  ? getChannelColor(conversation.role || "general")
                  : " bg-muted-foreground/10 border-muted-foreground/10",
              )}
            >
              {Icon}
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-sm">{conversation.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {conversation.role === "tech"
                  ? "Technical discussions & coding help"
                  : conversation.role === "management"
                    ? "Project updates & coordination"
                    : "General chat & announcements"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChannelPage;
