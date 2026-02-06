import { cn } from "@/lib/utils";
import { ChatUser } from "@/index";
import { format } from "date-fns";
import FindMentorAndUser from "./FindMentorAndUser";

interface ChannelProps {
  conversations: ChatUser[];
  setConversations: React.Dispatch<React.SetStateAction<ChatUser[]>>;
  activeConversation: ChatUser | null;
  setActiveConversation: React.Dispatch<React.SetStateAction<ChatUser | null>>;
}
const ChannelPage = ({
  conversations,
  setConversations,
  activeConversation,
  setActiveConversation,
}: ChannelProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
        Find a Mentor/User
      </p>
      <FindMentorAndUser
        conversations={conversations}
        setConversations={setConversations}
        setActiveConversation={setActiveConversation}
      />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
        Chats
      </p>
      {conversations.map((conversation) => {
        const isActive =
          activeConversation && activeConversation.id === conversation.id;
        return (
          <button
            key={conversation.id}
            onClick={() => setActiveConversation(conversation)}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all",
              isActive
                ? " bg-muted-foreground/20"
                : " hover:bg-muted-foreground/10",
            )}
          >
            <div className=" flex items-center gap-3">
              <img
                src={conversation.avatar}
                alt=""
                className=" h-8 w-8 rounded-full"
              />
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{conversation.name}</p>
                <p className=" text-sm text-muted-foreground">
                  {conversation.last_message && conversation.last_message}
                </p>
              </div>
            </div>
            <span className=" text-sm text-muted-foreground">
              {conversation.last_message_at &&
                format(new Date(conversation.last_message_at || ""), "HH:mm")}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ChannelPage;
