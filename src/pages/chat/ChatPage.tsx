import { useState, useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage, ChatUser, Conversation } from "@/index";
import { ConversationList } from "./ChatList";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { getConversationList, getMessages, sendMessage } from "@/utils/chat";
import { RootState } from "@/components/store/store";
import { useSelector } from "react-redux";
import { UPLOAD_PHOTOS_URL, WS_URL } from "@/components/config/CommonBaseUrl";
import { getWebsocketToken } from "@/utils/auth";
import { FilePreview } from "@/constant/HelperFunctions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageBubble } from "./MessageBubble";

export function ChatPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const wsRef = useRef<WebSocket | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showMobileList, setShowMobileList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<ChatUser[]>([]);

  // WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    let socket: WebSocket | null = null;
    let cancelled = false;
    let reconnectTimer: any = null;

    const connect = async () => {
      try {
        const token = await getWebsocketToken();
        if (cancelled) return;

        socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
        wsRef.current = socket;

        socket.onopen = () => {
          console.log("✅ WebSocket connected");
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "newPrivateMessage") {
              const { conversationId, message } = data.payload;

              console.log("📨 Received message:", data.payload);

              // Add message to current conversation
              if (
                selectedConversation &&
                conversationId === selectedConversation.conversation_id
              ) {
                setMessages((prev) => [...prev, message]);
              }

              // Update conversation list with latest message
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.conversation_id === conversationId
                    ? {
                        ...conv,
                        last_message:
                          message.message ||
                          `${message.files?.length || 0} file(s)`,
                        last_message_at: message.created_at,
                      }
                    : conv,
                ),
              );
            }
          } catch (error) {
            console.error("❌ WebSocket message error:", error);
          }
        };

        socket.onerror = (err) => {
          console.error("❌ WebSocket error:", err);
        };

        socket.onclose = () => {
          console.log("⚠️ WebSocket disconnected");

          // Auto reconnect after 3s
          if (!cancelled) {
            reconnectTimer = setTimeout(connect, 3000);
          }
        };
      } catch (error) {
        console.error("❌ WebSocket connection error:", error);
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (socket) socket.close();
      wsRef.current = null;
    };
  }, [user?.id, selectedConversation]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      const res: Conversation[] = await getConversationList();

      const con: ChatUser[] = res.map((c) => {
        if (c.user1_id === user?.id) {
          return {
            conversation_id: c.conversation_id,
            id: c.user2_id,
            role: c.user2_role,
            name: c.user2_name,
            avatar: c.user2_avatar,
            last_message: c.last_message,
            last_message_at: c.last_message_at,
          };
        }

        return {
          conversation_id: c.conversation_id,
          id: c.user1_id,
          role: c.user1_role,
          name: c.user1_name,
          avatar: c.user1_avatar,
          last_message: c.last_message,
          last_message_at: c.last_message_at,
        };
      });

      setConversations(con);
    };

    if (user?.id) fetchConversations();
  }, [user?.id]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        const res = await getMessages(selectedConversation.conversation_id);
        console.log(res);
        setMessages(res);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string, files: File[]) => {
    if (!selectedConversation) {
      return;
    }

    try {
      const res = await sendMessage(
        selectedConversation.conversation_id,
        content,
        files,
      );

      // Add sent message to UI immediately
      setMessages((prev) => [...prev, res.message]);

      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversation_id === selectedConversation.conversation_id
            ? {
                ...conv,
                last_message:
                  res.message.message ||
                  `${res.message.files?.length || 0} file(s)`,
                last_message_at: res.message.created_at,
              }
            : conv,
        ),
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleBack = () => {
    setShowMobileList(true);
    setSelectedConversation(null);
  };
  console.log(messages);
  return (
    <div className="flex bg-background w-full max-h-screen">
      {/* Conversation List - Hidden on mobile when chat is open */}
      <div
        className={cn(
          "w-full md:w-70 lg:w-80 shrink-0 border-r",
          !showMobileList && "hidden md:block",
        )}
      >
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      {/* Chat Area */}
      <div
        className={cn(
          "flex flex-1 flex-col w-full",
          showMobileList && "hidden md:flex",
        )}
      >
        {selectedConversation ? (
          <>
            <ChatHeader
              selectedConversation={selectedConversation}
              onBack={handleBack}
            />

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-13rem)] p-4 space-y-4">
              <MessageBubble messageList={messages} />
              <div ref={messagesEndRef} />
            </div>

            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-4">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Select a conversation
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Choose a conversation from the list to start chatting with your
              mentor or student.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
