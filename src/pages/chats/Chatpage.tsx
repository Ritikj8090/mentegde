import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  sendMessage,
} from "@/utils/internshipChannel";
import {
  ChatMessage,
  ChatUser,
  Conversation,
} from "@/index";
import { WS_URL } from "@/components/config/CommonBaseUrl";
import { getWebsocketToken } from "@/utils/auth";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import Loading from "@/components/Loading";
import { getConversationList, getMessages } from "@/utils/chat";
import ChannelPage from "./Channel";
import ChannelHeader from "./ChannelHeader";
import RegularMessages from "./RegularMessages";
import ChannelInput from "./ChannelInput";
import SearchBar from "./SearchBar";

const ChatPage = () => {
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const [conversations, setConversations] = useState<ChatUser[]>([]);
  const [activeConversation, setActiveConversation] = useState<ChatUser | null>(
    null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const activeConversationRef = useRef(activeConversation);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user?.id) return;

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

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeConversation) {
        const res = await getMessages(activeConversation.conversation_id);
        console.log(res);
        setMessages(res);
      }
    };

    fetchMessages();
  }, [activeConversation]);

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
                activeConversation &&
                conversationId === activeConversation.conversation_id
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
  }, [user?.id, activeConversation]);

  const handleSend = async (content: string, files: File[]) => {
    if (!activeConversation) {
      return;
    }

    try {
      const res = await sendMessage(
        activeConversation.conversation_id,
        content,
        files,
      );

      // Add sent message to UI immediately
      setMessages((prev) => [...prev, res.message]);

      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversation_id === activeConversation.conversation_id
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

  // Filter messages by search query
  const filteredMessages = searchQuery
    ? messages.filter(
        (msg) =>
          msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messages;

  if (loading) return <Loading />;

  return (
    <TooltipProvider>
      <div className="max-h-[calc(100vh-64px)] flex container mx-auto">
        {/* Channels Sidebar */}
        <div className="w-72 flex flex-col">

          {/* Channels */}
          <ChannelPage
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
          />
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-l">
          {activeConversation ? (
            <>
              <ChannelHeader activeConversation={activeConversation} />
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
              />

              <div className="flex-1 flex overflow-hidden">
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4 h-full">
                    <RegularMessages messages={filteredMessages} />
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground">
                Select a channel to start chatting
              </p>
            </div>
          )}
          <ChannelInput
            activeConversation={activeConversation}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            inputRef={inputRef}
            handleSendMessage={handleSend}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatPage;
