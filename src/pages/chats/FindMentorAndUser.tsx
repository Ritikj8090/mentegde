import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChatUser, tokenUser } from "@/index";
import { findMentorAndUser } from "@/utils/auth";
import { createConversation } from "@/utils/chat";
import { Search } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface FindMentorAndUserProps {
  conversations: ChatUser[];
  setConversations: React.Dispatch<React.SetStateAction<ChatUser[]>>;
  setActiveConversation: React.Dispatch<React.SetStateAction<ChatUser | null>>;
}

const FindMentorAndUser = ({
  conversations,
  setConversations,
  setActiveConversation,
}: FindMentorAndUserProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [results, setResults] = React.useState<tokenUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSearchTerm("");
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await findMentorAndUser(searchTerm);
        const newRes = res.filter(
          (user) => !conversations.some((conv) => conv.id === user.id),
        );
        setResults(newRes);
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleOnClick = async (user: tokenUser) => {
    const res = await createConversation(user.id, user.role);

    if (res) {
      const newConv = {
        conversation_id: res.conversation_id,
        id: user.id,
        role: user.role,
        name: user.full_name,
        avatar: user.avatar || "",
        last_message: "",
        last_message_at: "",
      };

      setActiveConversation(newConv);
      setConversations((prev) => [...prev, newConv]);
    }
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Search by name..."
        className="pl-6 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Search
        className="absolute left-1 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={17}
      />
      {searchTerm && (
        <Card ref={ref} className="absolute left-0 right-0 mt-2 max-h-[300px] overflow-y-auto py-0">
          <CardContent className="p-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center p-2">
                Searching...
              </p>
            ) : results.length > 0 ? (
              results.map((user, index) => (
                <Card
                  key={index}
                  className="p-0 mb-2 cursor-pointer hover:bg-muted"
                  onClick={() => handleOnClick(user)}
                >
                  <CardContent className="flex gap-2 p-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || ""} />
                      <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                        {user.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center p-2">
                No results found.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FindMentorAndUser;
