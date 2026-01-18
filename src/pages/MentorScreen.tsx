import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as mediasoupClient from "mediasoup-client";
import { createRecvTransport } from "@/services/mediasoupClient";
import apis from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { updateLiveStatus } from "@/components/store/slices/mentorSlice";
import { RootState } from "@/components/store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Paperclip, Linkedin, Send, Volume2, VolumeX } from "lucide-react";
import { WS_URL } from "@/components/config/CommonBaseUrl";
import {
  updateRemainingTimer,
  getLiveDuration,
} from "@/constant/HelperFunctions";

interface OneToOneRecord {
  id: string;
  student: string;
  date: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderRole: string;
  senderName: string;
  text: string;
  file?: string;
  timestamp: string;
}

interface MentorDetails {
  id: string;
  user_id: string;
  username: string;
  email: string;
  bio?: string;
  expertise?: string[];
  rating?: number | string;
  title?: string;
  avatar?: string;
}

async function attachMediaStreamSafely(
  videoEl: HTMLVideoElement,
  stream: MediaStream
) {
  return new Promise<void>((resolve, reject) => {
    if (!videoEl) return reject("Video element missing");

    videoEl.srcObject = stream;
    videoEl.muted = true; // ✅ Start muted for autoplay
    videoEl.playsInline = true;

    const tryPlay = async () => {
      try {
        await videoEl.play();
        console.log("📺 Playback succeeded");
        resolve();
      } catch (err) {
        console.warn("⚠️ Autoplay/play failed:", err);
        reject(err);
      }
    };

    if (videoEl.readyState >= 2) {
      tryPlay(); // metadata already loaded
    } else {
      videoEl.onloadedmetadata = tryPlay;
    }
  });
}

export default function MentorScreen() {
  const { id: mentorId } = useParams();
  const navigate = useNavigate();
  const { user, websocketToken } = useSelector(
    (state: RootState) => state.auth
  );
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const recvTransportRef = useRef<mediasoupClient.types.Transport | null>(null);
  const deviceRef = useRef<mediasoupClient.types.Device | null>(null);
  const dispatch = useDispatch();
  const [remainingTime, setRemainingTime] = useState("00:00:00");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientId] = useState(() => crypto.randomUUID());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(true);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = useRef(1000);

  const [oneToOneRecords, setOneToOneRecords] = useState<OneToOneRecord[]>([
    {
      id: "1",
      student: "Alex Johnson",
      date: "2024-04-01T10:00:00",
      status: "scheduled",
    },
    {
      id: "2",
      student: "Maria Garcia",
      date: "2024-03-28T14:00:00",
      status: "completed",
    },
  ]);

  const [mentorDetails, setMentorDetails] = useState<MentorDetails | null>(
    null
  );

  const requestOneToOne = () => {
    const newRecord: OneToOneRecord = {
      id: Date.now().toString(),
      student: "Current Student",
      date: new Date().toISOString(),
      status: "scheduled",
    };
    setOneToOneRecords((prev) => [...prev, newRecord]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim() && !selectedFile) return;

    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: sessionData?.id || "",
      senderId: clientId,
      senderRole: "user",
      senderName: user?.username ?? "User",
      text: inputMessage,
      file: selectedFile?.name,
      timestamp: new Date().toISOString(),
    };

    wsRef.current?.send(
      JSON.stringify({
        type: "chatMessage",
        peerId: clientId,
        sessionId: sessionData?.id,
        payload: newMessage,
      })
    );

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const loadMentor = async () => {
      try {
        const mentors = await apis.getLiveMentors();
        const mentor = mentors.find(
          (m: MentorDetails) => m.user_id === mentorId
        );
        if (mentor) {
          setMentorDetails(mentor);
        } else {
          setError("This mentor is not currently live.");
        }
      } catch (err) {
        console.error("Mentor load error:", err);
        setError("Failed to load mentor.");
      }
    };

    if (mentorId) loadMentor();
  }, [mentorId]);

  const initWebSocket = async (sessionId: string) => {
    if (!websocketToken) {
      setError("Missing WebSocket token");
      return;
    }

    const connectWebSocket = () => {
      console.log(
        `🔌 Attempting WebSocket connection (attempt ${
          reconnectAttempts.current + 1
        }/${maxReconnectAttempts})`
      );
      const ws = new WebSocket(`${WS_URL}?token=${websocketToken}`);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log("✅ Viewer WebSocket connected");
        reconnectAttempts.current = 0;
        reconnectInterval.current = 1000;

        ws.send(
          JSON.stringify({
            type: "joinSession",
            peerId: clientId,
            mentorId,
            sessionId,
            name: user?.username,
          })
        );

        ws.send(
          JSON.stringify({
            type: "getRtpCapabilities",
            peerId: clientId,
            sessionId,
          })
        );
      };

      ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "chatMessage") {
          const incoming = message.payload;
          setMessages((prev) =>
            prev.some((msg) => msg.id === incoming.id)
              ? prev
              : [...prev, incoming]
          );
          return;
        }

        if (message.type === "rtpCapabilities") {
          console.log("🔧 Received RTP capabilities");
          const device = new mediasoupClient.Device();
          await device.load({ routerRtpCapabilities: message.data });
          deviceRef.current = device;

          const recvTransport = await createRecvTransport(
            ws,
            device,
            sessionId,
            clientId
          );
          recvTransportRef.current = recvTransport;

          checkProducerAvailable(sessionId, clientId, device.rtpCapabilities);
        }

        if (message.type === "hasProducer" && message.data.availableKinds) {
          ["video", "audio"].forEach((kind) => {
            if (message.data.availableKinds[kind]) {
              ws.send(
                JSON.stringify({
                  type: "consume",
                  peerId: clientId,
                  sessionId,
                  direction: "recv",
                  data: {
                    kind,
                    rtpCapabilities: deviceRef.current?.rtpCapabilities,
                  },
                })
              );
            }
          });
        }

        if (message.type === "consumed") {
          if (!recvTransportRef.current) return;

          const consumer = await recvTransportRef.current.consume({
            id: message.data.id,
            producerId: message.data.producerId,
            kind: message.data.kind,
            rtpParameters: message.data.rtpParameters,
          });

          let stream = remoteVideoRef.current?.srcObject as MediaStream | null;

          if (!stream) {
            stream = new MediaStream();
          }

          // ✅ Remove previous track of same kind if exists
          const existingTracks = stream
            .getTracks()
            .filter((t) => t.kind === consumer.kind);
          for (const t of existingTracks) {
            stream.removeTrack(t);
          }

          stream.addTrack(consumer.track);

          if (remoteVideoRef.current && stream) {
            try {
              await attachMediaStreamSafely(remoteVideoRef.current, stream);
              console.log("📺 Video safely attached and playing");
            } catch (err) {
              console.error("🚨 Failed to play stream:", err);
            }
          }

          wsRef.current?.send(
            JSON.stringify({ type: "resume", peerId: clientId })
          );
        }

        if (message.type === "error") {
          console.error("⚠️ Server error:", message.message);
          setError(message.message || "Unknown server error");
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        setError("WebSocket connection failed");
      };

      ws.onclose = () => {
        console.log("🔌 Viewer WebSocket disconnected");
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          reconnectInterval.current = Math.min(
            reconnectInterval.current * 2,
            10000
          );
          console.log(`🔌 Reconnecting in ${reconnectInterval.current}ms...`);
          setTimeout(connectWebSocket, reconnectInterval.current);
        } else {
          setError("Failed to connect to the server after multiple attempts.");
        }
      };
    };

    connectWebSocket();
  };

  useEffect(() => {
    if (!mentorId) return;

    const fetchLiveSession = async () => {
      try {
        const response = await apis.fetchLiveSessionByMentorId(mentorId);
        if (response.resultStatus === "S") {
          const session = response.resultContent;
          setSessionData(session);
          await initWebSocket(session.id);
        } else {
          dispatch(updateLiveStatus({ userId: mentorId, isLive: false }));
          throw new Error("Mentor is not live.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Mentor is not currently live.");
      } finally {
        setLoading(false);
      }
    };

    fetchLiveSession();

    return () => {
      wsRef.current?.close();
      recvTransportRef.current?.close?.();
    };
  }, [mentorId]);

  const checkProducerAvailable = (
    sessionId: string,
    peerId: string,
    rtpCapabilities?: mediasoupClient.types.RtpCapabilities
  ) => {
    if (!rtpCapabilities || !wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        type: "hasProducer",
        sessionId,
        peerId,
      })
    );
  };

  useEffect(() => {
    if (!sessionData?.end_time) return;

    updateRemainingTimer(sessionData.end_time, setRemainingTime);

    const interval = setInterval(() => {
      updateRemainingTimer(sessionData.end_time, setRemainingTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData?.end_time]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-center">
        <div>
          <p className="text-lg text-red-500">{error}</p>
          <button
            className="underline text-blue-500 mt-2"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  mentorDetails?.avatar ||
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9439775.jpg-4JVJWOjPksd3DtnBYJXoWHA5lc1DU9.jpeg"
                }
              />
              <AvatarFallback>
                {mentorDetails?.username?.slice(0, 2).toUpperCase() || "NA"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-semibold">
                {mentorDetails?.username}
              </h1>
              <p className="text-sm text-muted-foreground">
                Senior Software Engineer at Tech Corp
              </p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant="ghost"
              onClick={() => navigate(`/mentor-profile/${mentorId}`)}
            >
              View Profile
            </Button>
          </div>
          <Button variant="outline" size="icon">
            <Linkedin className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Video */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize">
                      {sessionData?.title || "Live Session"}
                    </CardTitle>
                    <CardDescription className="capitalize text-sm mt-1">
                      {sessionData?.topic || "No topic"} • Started at{" "}
                      {sessionData?.start_time
                        ? new Date(sessionData.start_time).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "Time N/A"}{" "}
                      • {remainingTime} remaining
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 aspect-video relative overflow-hidden rounded-lg">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className="w-full h-full object-cover"
                  onError={(e) => console.error("🚨 Video element error:", e)}
                  onLoadedMetadata={() =>
                    console.log("📺 Video metadata loaded")
                  }
                  onPlaying={() => console.log("📺 Video playing")}
                />
                <div className="absolute bottom-4 left-4">
                  <Badge variant="secondary" className="bg-black/50 text-white">
                    Live
                  </Badge>
                </div>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white">Loading stream...</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-center py-4">
                <div className="flex gap-4">
                  <Button
                    onClick={() => {
                      const videoEl = remoteVideoRef.current;
                      if (videoEl) {
                        const newMuted = !isMuted;
                        videoEl.muted = newMuted;
                        setIsMuted(newMuted);
                      }
                    }}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            {/* Chat */}
            <Card>
              <CardHeader>
                <CardTitle>Chat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[300px] p-4 border rounded-md">
                  {messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderRole === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.senderRole === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.text && (
                              <p className="text-sm">{message.text}</p>
                            )}
                            {message.file && (
                              <div className="flex items-center gap-2 text-sm mt-2">
                                <Paperclip className="h-4 w-4" />
                                <span>{message.file}</span>
                              </div>
                            )}
                            <span className="text-xs opacity-70 mt-1 block">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-sm text-muted-foreground">
                      No messages yet. Start the conversation!
                    </p>
                  )}
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <label className="cursor-pointer">
                        <Paperclip className="h-4 w-4" />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </Button>
                    <Button
                      onClick={sendMessage}
                      size="icon"
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* One-to-One Requests */}
          <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 h-fit">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>One-to-One Records</CardTitle>
              <Button size="sm" onClick={requestOneToOne}>
                Request
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {oneToOneRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{record.student}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(record.date).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      record.status === "completed"
                        ? "default"
                        : record.status === "scheduled"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {record.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
