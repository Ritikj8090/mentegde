import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Channel } from ".";
import {
  getChannelList,
  getChannelMessages,
  sendMessage,
} from "@/utils/internshipChannel";
import ChannelPage from "./Channel";
import {
  ChannelListType,
  Internship,
  MessageListType,
  OnlineStatus,
} from "@/index";
import { WS_URL } from "@/components/config/CommonBaseUrl";
import { getWebsocketToken } from "@/utils/auth";
import ChannelHeader from "./ChannelHeader";
import SearchBar from "./SearchBar";
import RegularMessages from "./RegularMessages";
import ChannelInput from "./ChannelInput";
import MemberSidebar from "./MemberSidebar";
import { getAllDomainIntern, getAllDomainMentor, getInternship } from "@/utils/internship";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/store";
import Loading from "@/components/Loading";

const ChatChannelPage = () => {
  const internshipId = window.location.pathname.split("/")[2];
  const [channelList, setChannelList] = useState<ChannelListType[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [activeChannelList, setActiveChannelList] =
    useState<ChannelListType | null>(null);
  const [messageList, setMessageList] = useState<MessageListType[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMembers, setShowMembers] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [allInterns, setAllInterns] = useState<OnlineStatus[]>([]);
  const [internshipDetail, setInternshipDetail] = useState<Internship>();
  const [notifications, setNotifications] = useState<Record<Channel, boolean>>({
    tech: true,
    management: true,
    general: true,
  });

  const activeChannelRef = useRef(activeChannelList);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);

  const currentUserDomain = allInterns.find(
    (intern) => intern.id === user?.id,
  )?.domain;

  useEffect(() => {
    activeChannelRef.current = activeChannelList;
  }, [activeChannelList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const emitOnlineStatus = (socket: WebSocket, online: boolean) => {
    if (socket.readyState === WebSocket.OPEN && user?.id) {
      const statusMessage = {
        type: "userStatus",
        payload: {
          userId: user.id,
          internshipId: internshipId,
          online: online,
        },
      };
      socket.send(JSON.stringify(statusMessage));
      console.log(`📡 Emitted status: ${online ? "online" : "offline"}`);
    }
  };



  useEffect(() => {
    if (!internshipId) return;

    let cancelled = false;

    const fetchInternshipDetail = async() => {
      const response = await getInternship(internshipId);
      setInternshipDetail(response);
    }

    const fetchChannelList = async () => {
      try {
        setLoading(true);

        // Fetch all in parallel
        const [channels, interns, mentors] = await Promise.all([
          getChannelList(internshipId),
          getAllDomainIntern(internshipId),
          getAllDomainMentor(internshipId),
        ]);

        if (cancelled) return;

        setChannelList(channels);

        // Merge interns + mentors immutably
        const allUsers: OnlineStatus[] = [
          ...interns.map((intern: any) => ({
            id: intern.id,
            full_name: intern.full_name,
            avatar: intern.avatar,
            status: "offline",
            role: "user",
            domain: intern.domain_name,
          })),
          ...mentors.map((mentor: any) => ({
            id: mentor.id,
            full_name: mentor.full_name,
            avatar: mentor.avatar,
            status: "offline",
            role: "mentor",
            domain: "other",
          })),
        ];

        setAllInterns(allUsers);

        // Auto select first channel
        if (channels?.length > 0) {
          setActiveChannelList(channels[0]);

          const messages = await getChannelMessages(
            internshipId,
            channels[0].id,
          );

          if (!cancelled) {
            setMessageList(messages);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching channels:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInternshipDetail();
    fetchChannelList();

    return () => {
      cancelled = true;
    };
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
    if (!internshipId || !user?.id) return;

    let socket: WebSocket | null = null;
    let cancelled = false;
    let reconnectTimer: any = null;

    const connect = async () => {
      try {
        const token = await getWebsocketToken();
        if (cancelled) return;

        socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(token)}`);
        wsRef.current = socket; // ✅ ADD THIS LINE - Store socket in ref
        socket.onopen = () => {
          console.log("✅ WebSocket connected");
          setConnected(true);

          // ✅ Emit online status when connected
          emitOnlineStatus(socket!, true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // CHANNEL MESSAGE
            if (data.type === "internshipChannelMessage") {
              const { channelId, message } = data.payload;
              const active = activeChannelRef.current;

              if (active?.id === channelId) {
                setMessageList((prev) => [...prev, message]);
              }
            }

            // ✅ ADD THIS - Handle initial online users list
            if (data.type === "initialOnlineUsers") {
              const { userIds } = data.payload;

              console.log("📋 Received initial online users:", userIds);

              setAllInterns((prev) =>
                prev.map((u) => ({
                  ...u,
                  status: userIds.includes(u.id) ? "online" : "offline",
                })),
              );
            }

            // USER STATUS
            if (data.type === "userStatus") {
              const { userId, online } = data.payload;

              setAllInterns((prev) =>
                prev.map((u) =>
                  u.id === userId
                    ? { ...u, status: online ? "online" : "offline" }
                    : u,
                ),
              );
            }
          } catch (err) {
            console.error("❌ WS parse error", err);
          }
        };

        socket.onerror = (err) => {
          console.error("❌ WebSocket error", err);
        };

        socket.onclose = () => {
          console.log("⚠️ WebSocket disconnected");
          setConnected(false);

          // Auto reconnect after 3s
          if (!cancelled) {
            reconnectTimer = setTimeout(connect, 3000);
          }
        };

        setWs(socket);
      } catch (err) {
        console.error("❌ WS connect failed", err);
      }
    };

    connect();

    // ✅ Cleanup: emit offline before unmounting
    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);

      if (socket && socket.readyState === WebSocket.OPEN) {
        emitOnlineStatus(socket, false);

        setTimeout(() => {
          socket!.close();
        }, 100);
      }

      setWs(null);
      wsRef.current = null;
    };
  }, [internshipId, user?.id]);

  // Handle page visibility (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (wsRef.current && user?.id) {
        const isOnline = !document.hidden;
        emitOnlineStatus(wsRef.current, isOnline);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user?.id, internshipId]);

  // Handle beforeunload (closing tab/browser)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (wsRef.current && user?.id) {
        emitOnlineStatus(wsRef.current, false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user?.id, internshipId]);

  const handleSendMessage = async (newMessage: string, selectedFiles: File[]) => {
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

  const filteredMembers =
    activeChannelList?.domain_name === "tech"
      ? allInterns.filter(
          (intern) => intern.domain === "tech" || intern.domain === "other",
        )
      : activeChannelList?.domain_name === "management"
        ? allInterns.filter(
            (intern) =>
              intern.domain === "management" || intern.domain === "other",
          )
        : allInterns;


  if(loading) return <Loading />

  return (
    <TooltipProvider>
      <div className="max-h-[calc(100vh-64px)] flex container mx-auto">
        {/* Channels Sidebar */}
        <div className="w-72 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Internship Chat</h2>
            <p className="text-xs mt-1">{internshipDetail?.internship_title}</p>
          </div>

          {/* Channels */}
          <ChannelPage
            channels={channelList}
            activeChannel={activeChannelList}
            setActiveChannel={setActiveChannelList}
          />
        </div>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 border-l">
          {activeChannelList ? (
            <>
              <ChannelHeader
                activeChannelList={activeChannelList}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
                notifications={notifications}
                setNotifications={setNotifications}
                showMembers={showMembers}
                setShowMembers={setShowMembers}
              />
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showSearch={showSearch}
                setShowSearch={setShowSearch}
              />

              <div className="flex-1 flex overflow-hidden">
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4 h-full">
                    <RegularMessages messageList={filteredMessages} />
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <MemberSidebar
                  filteredMembers={filteredMembers}
                  showMembers={showMembers}
                />
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
            activeChannelData={activeChannelList}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            inputRef={inputRef}
            handleSendMessage={handleSendMessage}
            openInput={
              currentUserDomain === activeChannelList?.channel_type ||
              activeChannelList?.channel_type === "general" || user?.role === "mentor"
            }
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChatChannelPage;
