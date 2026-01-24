import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import { ChatUser } from "@/index";
import { UPLOAD_PHOTOS_URL } from "@/components/config/CommonBaseUrl";

interface ConversationListProps {
  conversations: ChatUser[];
  selectedConversation: ChatUser | null;
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ChatUser | null>
  >;
}

export function ConversationList({
  conversations,
  selectedConversation,
  setSelectedConversation,
}: ConversationListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  return (
    <div className="flex h-full flex-col border-r border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Messages</h1>
        <Button variant="ghost" size="icon">
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => {
          const initials = conversation.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50",
                selectedConversation?.id === conversation.id && "bg-secondary",
              )}
            >
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarImage
                  src={UPLOAD_PHOTOS_URL + conversation.avatar || "/placeholder.svg"}
                  alt={conversation.name}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">
                    {conversation.name}
                  </span>

                  {conversation.last_message_at && (
                    <span className="text-xs text-muted-foreground ml-2">
                      {format(
                        new Date(conversation.last_message_at),
                        "HH:mm a",
                      )}
                    </span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground truncate">
                  {conversation.last_message ?? "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              No conversations found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
