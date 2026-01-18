import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Search,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Mic,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  PhoneOff,
  Menu,
  Maximize2,
  Minimize2,
  MonitorUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/components/store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BASE_URL, WS_URL } from "@/components/config/CommonBaseUrl";
import apis from "@/services/api";
import {
  addMessage,
  setMessages,
  setConversations,
  addConversation,
  setActiveConversation,
  updateUserStatus,
} from "@/components/store/slices/chatSlice";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Chat() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const incomingUserId = params.get("userId");
  const incomingUsername = params.get("username");
  const [messageInput, setMessageInput] = useState("");
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<"video" | "audio" | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const navigate = useNavigate();
  const hasJoinedRef = useRef(false);

  const dispatch = useDispatch();
  const conversations = useSelector(
    (state: RootState) => state.chat.conversations
  );
  const activeConversation = useSelector(
    (state: RootState) => state.chat.activeConversation
  );
  const messages = useSelector((state: RootState) => state.chat.messages);

  // const [ws, setWs] = useState<WebSocket | null>(null);

  const { user, token, websocketToken, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const currentUserId = user?.id;
  const shouldConnect = currentUserId && websocketToken;
  const authReady = currentUserId && websocketToken && !isLoading;
  const conversationReady = activeConversation && authReady;
  const { sendMessage, socket, ready } = useWebSocket(
    authReady ? currentUserId : undefined
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  // console.log("********TOKEN*****", websocketToken);
  // console.log("********USERID*****", currentUserId);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    if (!activeConversation || !currentUserId) return;

    const receiverId =
      currentUserId === activeConversation.user1_id
        ? activeConversation.user2_id
        : activeConversation.user1_id;

    const tempMessage = {
      id: `${Date.now()}-temp`, // temporary ID
      text: messageInput,
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
      read: false,
    };

    dispatch(addMessage(tempMessage)); // ✅ optimistic update
    sendMessage({
      type: "privateMessage",
      payload: {
        conversationId: activeConversation.id,
        senderId: currentUserId,
        receiverId,
        text: messageInput,
      },
    });

    setMessageInput("");
  };

  useEffect(() => {
    if (
      ready &&
      activeConversation?.id &&
      currentUserId &&
      !hasJoinedRef.current
    ) {
      sendMessage({
        type: "joinConversation",
        payload: {
          userId: currentUserId,
          conversationId: activeConversation.id,
        },
      });

      hasJoinedRef.current = true;
    }
  }, [ready, currentUserId, activeConversation?.id]);

  useEffect(() => {
    hasJoinedRef.current = false;
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case "chatHistory":
          if (Array.isArray(message.payload.messages)) {
            const formattedMessages = message.payload.messages.map(
              (m: any) => ({
                id: m.id,
                text: m.message,
                senderId: m.sender_id,
                timestamp: m.created_at,
                read: m.status === "delivered",
              })
            );
            dispatch(setMessages(formattedMessages));

            sendMessage({
              type: "acknowledgeMessages",
              payload: {
                conversationId: message.payload.conversationId,
                messageIds: message.payload.messages.map((m: any) => m.id),
              },
            });
          } else {
            console.error(
              "⚠️ chatHistory payload is not an array",
              message.payload
            );
          }
          break;

        case "newPrivateMessage":
          const msg = message.payload.message;

          const alreadyExists = messages.some((m) => m.id === msg.id);
          if (!alreadyExists) {
            const formatted = {
              id: msg.id,
              text: msg.message,
              senderId: msg.sender_id,
              timestamp: msg.created_at,
              read: msg.status === "delivered",
            };

            dispatch(addMessage(formatted));

            // ✅ Acknowledge delivery
            sendMessage({
              type: "acknowledgeMessages",
              payload: {
                conversationId: activeConversation?.id,
                messageIds: [msg.id],
              },
            });
          } else {
            console.log("🔁 Duplicate message ignored:", msg.id);
          }
          break;

        case "userStatus":
          dispatch(updateUserStatus(message.payload));
          break;

        case "error":
          console.warn("⚠️ WebSocket server error:", message.payload);
          break;

        default:
          console.warn("Unknown WebSocket message:", message);
          break;
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, activeConversation?.id, sendMessage]);

  const handleConversationSelect = (conversation: Conversation) => {
    if (!conversation.id) {
      console.error("Conversation ID is missing!");
      return;
    }

    dispatch(setActiveConversation(conversation));
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = (await apis.getConversations()) as Conversation[];
        const unique: Conversation[] = Array.from(
          new Map(data.map((c) => [c.id, c])).values()
        );
        dispatch(setConversations(unique));
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    if (
      !authReady ||
      isLoading ||
      !incomingUserId ||
      !incomingUsername ||
      !currentUserId ||
      !websocketToken
    ) {
      return;
    }

    // ✅ Call new initiate API instead of sendMessage
    (async () => {
      try {
        const conversation = await apis.initiateConversation(
          currentUserId,
          incomingUserId
        );

        const newConversation: Conversation = {
          ...conversation,
          user1_name: user?.username || "",
          user2_name: incomingUsername,
          user1_avatar: user?.avatar || "/placeholder.svg",
          user2_avatar: "/placeholder.svg",
          last_message: "",
          last_message_at: new Date().toISOString(),
          online: true,
        };

        // Avoid duplicates before adding
        const alreadyExists = conversations.find(
          (c) =>
            (c.user1_id === conversation.user1_id &&
              c.user2_id === conversation.user2_id) ||
            (c.user1_id === conversation.user2_id &&
              c.user2_id === conversation.user1_id)
        );

        if (!alreadyExists) {
          dispatch(addConversation(newConversation));
        }

        if (
          !activeConversation ||
          activeConversation.id !== newConversation.id
        ) {
          dispatch(setActiveConversation(newConversation));
        }

        if (ready) {
          sendMessage({
            type: "joinConversation",
            payload: {
              userId: currentUserId,
              conversationId: newConversation.id,
            },
          });
        }
      } catch (err) {
        console.error("Failed to initiate conversation:", err);
      }
    })();
  }, [
    authReady,
    incomingUserId,
    incomingUsername,
    currentUserId,
    websocketToken,
    ready,
  ]);

  // Scroll to bottom when new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // const handleSendMessage = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!messageInput.trim()) return;

  //   if (!activeConversation) {
  //     console.warn("No active conversation selected.");
  //     return;
  //   }

  //   sendMessage({
  //     type: "privateMessage",
  //     payload: {
  //       senderId: currentUserId,
  //       receiverId:
  //         currentUserId === activeConversation.user1_id
  //           ? activeConversation.user2_id
  //           : activeConversation.user1_id,
  //       text: messageInput,
  //     },
  //   });

  //   setMessageInput("");
  // };

  const startCall = (type: "video" | "audio") => {
    setCallType(type);
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setCallType(null);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const toggleScreenSharing = () => {
    setIsScreenSharing(!isScreenSharing);
    // In a real implementation, you would handle screen sharing through WebRTC
    console.log("Toggle screen sharing");
  };

  // Add fullscreen change event listener
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  return (
    <div className="flex h-full w-full bg-background container mx-auto px-4">
      {/* Mobile sidebar trigger */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-full">
            <ChatSidebar
              conversations={conversations}
              activeConversation={activeConversation}
              setActiveConversation={handleConversationSelect}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block border-x">
        <ChatSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          setActiveConversation={handleConversationSelect}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col border-r">
        {!conversationReady ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            {isLoading
              ? "Loading..."
              : "Select a conversation to start chatting"}
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="h-12 border-b flex items-center justify-between px-3">
              <div className="flex items-center space-x-3">
                {/* Calculate who is the "other" user */}
                {activeConversation && (
                  <>
                    {(() => {
                      const getOtherUser = () => {
                        if (!activeConversation || !currentUserId) return null;

                        const isCurrentUserUser1 =
                          activeConversation.user1_id === currentUserId;

                        return {
                          name:
                            currentUserId === activeConversation.user1_id
                              ? activeConversation.user2_name
                              : activeConversation.user2_name,
                          avatar: isCurrentUserUser1
                            ? activeConversation.user2_avatar ||
                              "/default-avatar.png"
                            : activeConversation.user2_avatar ||
                              "/default-avatar.png",
                          isOnline: activeConversation.online,
                        };
                      };

                      const otherUser = getOtherUser();

                      return (
                        otherUser && (
                          <>
                            <Avatar>
                              <AvatarImage
                                src={otherUser.avatar}
                                alt={otherUser.name}
                              />
                              <AvatarFallback>
                                {otherUser.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h2 className="font-semibold">
                                {otherUser.name}
                              </h2>
                              <p className="text-xs text-muted-foreground">
                                {otherUser.isOnline ? (
                                  <span className="flex items-center">
                                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                                    Online
                                  </span>
                                ) : (
                                  "Offline"
                                )}
                              </p>
                            </div>
                          </>
                        )
                      );
                    })()}
                  </>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startCall("audio")}
                        disabled={isInCall}
                      >
                        <Phone className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voice Call</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startCall("video")}
                        disabled={isInCall}
                      >
                        <Video className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Video Call</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>More Options</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Call UI */}
            {isInCall && (
              <div
                className={cn(
                  "relative bg-muted flex items-center justify-center",
                  isFullScreen ? "fixed inset-0 z-50" : "h-[300px]"
                )}
              >
                {callType === "video" && !isVideoOff && (
                  <div className="absolute inset-0 bg-black">
                    {isScreenSharing ? (
                      // Screen sharing view
                      <div className="absolute inset-0 flex items-center justify-center bg-background">
                        <img
                          src="/placeholder.svg?height=600&width=800"
                          alt="Screen share"
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                          <p className="text-sm font-medium">Screen Sharing</p>
                        </div>
                      </div>
                    ) : (
                      // Normal video call view
                      <img
                        src="/placeholder.svg?height=300&width=800"
                        alt="Video call"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-4 right-4 w-32 h-24 bg-muted rounded-lg overflow-hidden border-2 border-background">
                      <img
                        src="/placeholder.svg?height=96&width=128"
                        alt="Your video"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {(callType === "audio" || isVideoOff) && (
                  <div className="flex flex-col items-center justify-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage
                        src={activeConversation.avatar}
                        alt={activeConversation.user1_name}
                      />
                      <AvatarFallback className="text-4xl">
                        {activeConversation?.user1_name.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-medium mb-2">
                      {activeConversation.user1_name}
                    </h3>
                    <p className="text-muted-foreground">
                      {callType === "audio" ? "Voice call" : "Video call"} in
                      progress...
                    </p>
                  </div>
                )}

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 bg-background/80 backdrop-blur-sm p-2 rounded-full">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5 text-destructive" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>

                  {callType === "video" && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                        onClick={() => setIsVideoOff(!isVideoOff)}
                      >
                        {isVideoOff ? (
                          <CameraOff className="h-5 w-5 text-destructive" />
                        ) : (
                          <Camera className="h-5 w-5" />
                        )}
                      </Button>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-full"
                              onClick={toggleScreenSharing}
                            >
                              <MonitorUp
                                className={cn(
                                  "h-5 w-5",
                                  isScreenSharing && "text-primary"
                                )}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isScreenSharing
                              ? "Stop sharing screen"
                              : "Share screen"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-full"
                              onClick={toggleFullScreen}
                            >
                              {isFullScreen ? (
                                <Minimize2 className="h-5 w-5" />
                              ) : (
                                <Maximize2 className="h-5 w-5" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {isFullScreen ? "Exit full screen" : "Full screen"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </>
                  )}

                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={endCall}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Messages area */}
            <ScrollArea
              className={cn(
                "flex-1 p-4",
                isInCall && !isFullScreen && "h-[calc(100vh-460px)]",
                isInCall && isFullScreen && "h-[calc(100vh-300px)]",
                !isInCall && "h-[calc(100vh-128px)]"
              )}
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    ref={index === messages.length - 1 ? scrollRef : null}
                    className={cn(
                      "flex",
                      message.senderId === currentUserId
                        ? "justify-start"
                        : "justify-end"
                    )}
                  >
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {message.senderId !== currentUserId && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={activeConversation.avatar}
                            alt={activeConversation.user1_name}
                          />
                          <AvatarFallback>
                            {activeConversation?.user1_name.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm",
                            message.senderId === currentUserId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.text}
                        </div>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp
                              ? format(new Date(message.timestamp), "h:mm a")
                              : ""}
                          </span>
                          {message.senderId === currentUserId && (
                            <span className="text-xs text-muted-foreground">
                              {message.read ? "Read" : "Delivered"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="border-t p-4">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2"
              >
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={!messageInput.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface ChatSidebarProps {
  conversations: any[];
  activeConversation: any;
  setActiveConversation: (chat: any) => void;
}

function ChatSidebar({
  conversations,
  activeConversation,
  setActiveConversation,
}: ChatSidebarProps) {
  const { user, token, websocketToken, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const currentUserId = user?.id;
  const navigate = useNavigate(); // ✅ Fix the "navigate not found" error

  // console.log("********TOKEN*****", websocketToken);
  // console.log("********USERID*****", currentUserId);

  if (isLoading || !user || !websocketToken) {
    return <div className="p-4">Loading chat...</div>;
  }

  useEffect(() => {
    if (isLoading) return;

    if (!user || !token || !websocketToken) {
      console.warn("Auth not ready after loading. Skipping.");
      return;
    }

    console.log("✅ Auth ready. Proceed with WebSocket:", {
      userId: user.id,
      websocketToken,
    });
  }, [isLoading, user, token, websocketToken]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold mb-4">Messages</h1>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.map((conversation) => {
            const conversationId =
              conversation.id ||
              `${conversation.user1_id}-${conversation.user2_id}`;

            const isCurrentUserUser1 = conversation.user1_id === currentUserId;
            const otherUserName = isCurrentUserUser1
              ? conversation.user2_name
              : conversation.user1_name;

            const otherUserId = isCurrentUserUser1
              ? conversation.user2_id
              : conversation.user1_id;

            const otherUserAvatar = isCurrentUserUser1
              ? conversation.user2_avatar || "/placeholder.svg"
              : conversation.user1_avatar || "/placeholder.svg";

            return (
              <button
                key={
                  conversation.id ||
                  `${conversation.user1_id}-${conversation.user2_id}`
                }
                className={cn(
                  "w-full flex items-start p-2 gap-3 rounded-lg transition-colors",
                  conversation.id === activeConversation?.id
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                )}
                onClick={() => {
                  setActiveConversation(conversation);
                  navigate(
                    `/chat?userId=${otherUserId}&username=${encodeURIComponent(
                      otherUserName
                    )}`
                  );
                }}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium truncate">
                      {otherUserName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {conversation.last_message_at
                        ? format(
                            new Date(conversation.last_message_at),
                            "h:mm a"
                          )
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message?.slice(0, 50) ||
                      "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
