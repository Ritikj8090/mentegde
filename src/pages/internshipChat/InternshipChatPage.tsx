import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import SearchPage from "./Search";
import ChannelHeader from "./ChannelHeader";
import ChannelUser from "./ChannelUser";
import MemberSidebar from "./MemberSidebar";
import ChannelInput from "./ChannelInput";
import PinnedMessages from "./PinnedMessages";
import SearchBar from "./SearchBar";
import RegularMessages from "./RegularMessages";
import {
  Channel,
  channels,
  currentUser,
  initialMessages,
  Message,
  users,
} from ".";
import {
  getChannelList,
  getChannelMessages,
  sendMessage,
} from "@/utils/internshipChannel";
import ChannelPage from "./Channel";
import { ChannelListType, MessageListType } from "@/index";
import { WS_URL } from "@/components/config/CommonBaseUrl";
import { getWebsocketToken } from "@/utils/auth";

export function InternshipChat() {
  const internshipId = window.location.pathname.split("/")[2];
  const [channelList, setChannelList] = useState<ChannelListType[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeChannelList, setActiveChannelList] = useState<ChannelListType>({
    id: "",
    channel_type: "general",
    name: "",
    domain_name: "tech",
    created_at: "",
  });
  const [messageList, setMessageList] = useState<MessageListType[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const activeChannelRef = useRef(activeChannelList);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    activeChannelRef.current = activeChannelList;
  }, [activeChannelList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const fetchChannelList = async () => {
      try {
        setLoading(true);
        const channels = await getChannelList(internshipId);
        setChannelList(channels);

        if (channels && channels.length > 0) {
          setActiveChannelList(channels[0]);
          const messages = await getChannelMessages(
            internshipId,
            channels[0].id,
          );
          setMessageList(messages);

          // Clear unread count for first channel
          setUnreadCounts((prev) => ({ ...prev, [channels[0].id]: 0 }));
        }
      } catch (error) {
        console.error("Error fetching channels:", error);
      } finally {
        setLoading(false);
      }
    };

    if (internshipId) {
      fetchChannelList();
    }
  }, [internshipId]);

  // Fetch messages when active channel changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChannelList) return;

      try {
        setLoading(true);
        const messages = await getChannelMessages(
          internshipId,
          activeChannelList.id,
        );
        setMessageList(messages);

        // Clear unread count for active channel
        setUnreadCounts((prev) => ({ ...prev, [activeChannelList.id]: 0 }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeChannelList) {
      fetchMessages();
    }
  }, [activeChannelList, internshipId]);

  useEffect(() => {
    if (!internshipId) return;

    let socket: WebSocket | null = null;
    let cancelled = false;

    const connect = async () => {
      try {
        const webSocketToken = await getWebsocketToken();
        if (cancelled) return;

        socket = new WebSocket(
          `${WS_URL}?token=${encodeURIComponent(webSocketToken)}`,
        );
        socket.onopen = () => {
          console.log("WebSocket connected");
          setConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === "internshipChannelMessage") {
              const { channelId, message } = data.payload;

              // ✅ use ref so it always checks latest channel
              const active = activeChannelRef.current;

              if (active && channelId === active.id) {
                setMessageList((prev) => [...prev, message]);
              }
            }
          } catch (err) {
            console.error("WebSocket message parse error:", err);
          }
        };

        socket.onerror = (err) => {
          console.error("WebSocket error:", err);
          setConnected(false);
        };

        socket.onclose = () => {
          console.log("WebSocket disconnected");
          setConnected(false);
        };

        setWs(socket);
      } catch (err) {
        console.error("WebSocket connect failed:", err);
        setConnected(false);
      }
    };

    connect();

    return () => {
      cancelled = true;
      if (socket && socket.readyState !== WebSocket.CLOSED) {
        socket.close();
      }
      setWs(null);
    };
  }, [internshipId]); // ✅ only reconnect when internshipId changes

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    if (!activeChannelList) return;

    try {
      setSending(true);
      await sendMessage(
        internshipId,
        activeChannelList.id,
        newMessage,
        selectedFiles,
      );
      setNewMessage("");
      setSelectedFiles([]);
      inputRef.current?.focus();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Filter messages by search query
  const filteredMessages = searchQuery
    ? messageList.filter(
        (msg) =>
          msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender_name?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : messageList;

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const [activeChannel, setActiveChannel] = useState<Channel>("general");
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showMembers, setShowMembers] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState<Record<Channel, boolean>>({
    tech: true,
    management: true,
    general: true,
  });
  const [unreadCounts, setUnreadCounts] = useState<Record<Channel, number>>({
    tech: 2,
    management: 1,
    general: 0,
  });

  const activeChannelData = channels.find((c) => c.id === activeChannel)!;

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) => ({
      ...prev,
      [activeChannel]: prev[activeChannel].map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.reacted) {
            return {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count - 1,
                        reacted: false,
                        users: r.users.filter((u) => u !== currentUser.name),
                      }
                    : r,
                )
                .filter((r) => r.count > 0),
            };
          } else {
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count + 1,
                      reacted: true,
                      users: [...r.users, currentUser.name],
                    }
                  : r,
              ),
            };
          }
        } else {
          return {
            ...msg,
            reactions: [
              ...msg.reactions,
              { emoji, count: 1, users: [currentUser.name], reacted: true },
            ],
          };
        }
      }),
    }));
  };

  const filteredMembers = users.filter((user) => {
    if (activeChannel === "tech")
      return user.domain === "tech" || user.role === "admin";
    if (activeChannel === "management")
      return user.domain === "management" || user.role === "admin";
    return true;
  });

  const onlineCount = filteredMembers.filter(
    (u) => u.status === "online",
  ).length;

  return (
    <TooltipProvider>
      <div className="h-screen flex container mx-auto">
        {/* Channels Sidebar */}
        <div className="w-72 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Internship Chat</h2>
            <p className="text-xs mt-1">Full Stack Development</p>
          </div>

          {/* Channels */}
          <ChannelPage
            channels={channelList}
            activeChannel={activeChannelList}
            setActiveChannel={setActiveChannelList}
            unreadCounts={unreadCounts}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Channel Header */}
          <ChannelHeader
            activeChannelList={activeChannelList}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            notifications={notifications}
            setNotifications={setNotifications}
            showMembers={showMembers}
            setShowMembers={setShowMembers}
          />

          {/* Search Bar (Conditional) */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} showSearch={showSearch} setShowSearch={setShowSearch} />

          <div className="flex-1 flex overflow-hidden">
            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Pinned Messages */}
                {/* <PinnedMessages
                  activeChannelList={activeChannelList}
                  messages={messages}
                  currentUser={currentUser}
                  handleReaction={handleReaction}
                  setReplyingTo={setReplyingTo}
                  messagesEndRef={messagesEndRef}
                /> */}

                {/* Regular Messages */}
                <RegularMessages
                  messageList={filteredMessages}
                  setMessageList={setMessageList}
                  activeChannel={activeChannelList}
                  handleReaction={handleReaction}
                  setReplyingTo={setReplyingTo}
                />
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Members Sidebar */}
            <MemberSidebar
              filteredMembers={filteredMembers}
              onlineCount={onlineCount}
              showMembers={showMembers}
            />
          </div>

          {/* Message Input */}
          <ChannelInput
            activeChannelData={activeChannelData}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            inputRef={inputRef}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
