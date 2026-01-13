import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  MessageSquare,
  Mic,
  MicOff,
  MoreVertical,
  Share,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import { format } from "date-fns";
import { RootState } from "@/components/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import apis from "@/services/api";
import {
  getLiveDuration,
  updateRemainingTimer,
} from "@/constant/HelperFunctions";
import * as mediasoupClient from "mediasoup-client";
import { createSendTransport } from "@/services/mediasoupClient";
import { WS_URL } from "@/components/config/CommonBaseUrl";
import { useSelector } from "react-redux";

interface SignalingMessage {
  type: "join" | "joinSession" | "offer" | "answer" | "candidate";
  peerId?: string;
  targetPeerId?: string;
  sessionId?: string;
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
}

interface SessionData {
  id: string;
  mentor_id: string;
  title: string;
  description?: string;
  topic?: string;
  duration?: number;
  max_participants?: number;
  format?: string;
  prerequisites?: string;
  materials?: string;
  skill_level?: string;
  session_type?: string;
  start_time?: string | null;
  end_time?: string | null;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderRole: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export default function LiveSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const sessionToken = queryParams.get("token");
  const { websocketToken } = useSelector((state: RootState) => state.auth);

  const [remainingTime, setRemainingTime] = useState("");
  // const [sessionLive, setSessionLive] = useState("");
  const videoProducerRef = useRef<mediasoupClient.types.Producer | null>(null);
  const audioProducerRef = useRef<mediasoupClient.types.Producer | null>(null);
  const [sessionData, setSessionData] = useState<SessionData>();
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const deviceRef = useRef<mediasoupClient.types.Device | null>(null);
  const sendTransportRef = useRef<mediasoupClient.types.Transport | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const producedRef = useRef(false);

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionToken) {
        navigate("/mentor/dashboard");
        return;
      }
      try {
        setIsLoading(true);
        const data = await apis.fetchSession({ token: sessionToken });
        if (data.resultStatus === "S") {
          const sessionWithFixedDates = {
            ...data.resultContent,
            start_time: data.resultContent.start_time
              ? new Date(data.resultContent.start_time).toISOString()
              : null,
            end_time: data.resultContent.end_time
              ? new Date(data.resultContent.end_time).toISOString()
              : null,
          };
          console.log("Session data fetched:", sessionWithFixedDates);
          setSessionData(sessionWithFixedDates);
        } else {
          throw new Error(data.resultMessage);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/mentor/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessionData();
  }, [sessionToken, navigate]);

  useEffect(() => {
    if (!sessionData?.id || wsRef.current) return;

    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720, frameRate: 30 },
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch((err) => {
            console.warn("Playback error:", err);
            setVideoError(true);
          });
        }
      } catch (err) {
        console.error("❌ Failed to get media:", err);
        setVideoError(true);
      }
    };

    const startWebSocket = async () => {
      const ws = new WebSocket(`${WS_URL}?token=${websocketToken}`);
      wsRef.current = ws;

      ws.onopen = async () => {
        const id = crypto.randomUUID();
        setClientId(id);

        console.log("✅ Mentor WebSocket connected. Joining session...");

        ws.send(
          JSON.stringify({
            type: "joinSession",
            sessionId: sessionData.id,
            peerId: id,
          })
        );

        ws.send(
          JSON.stringify({
            type: "getRtpCapabilities",
            sessionId: sessionData.id,
            peerId: id,
          })
        );
      };

      ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "chatMessage") {
          setMessages((prev) => [...prev, message.payload]);
        }

        if (message.type === "rtpCapabilities") {
          console.log("🔧 Received RTP capabilities from server");

          const device = new mediasoupClient.Device();
          await device.load({ routerRtpCapabilities: message.data });
          deviceRef.current = device;

          const sendTransport = await createSendTransport(
            ws,
            device,
            sessionData.id,
            clientId!
          );
          sendTransportRef.current = sendTransport;

          if (!producedRef.current && localStreamRef.current) {
            for (const track of localStreamRef.current.getTracks()) {
              if (track.kind === "video") {
                const producer = await sendTransport.produce({ track });
                videoProducerRef.current = producer;
                console.log("✅ Initial video producer created", {
                  producerId: producer.id,
                  trackId: track.id,
                });
              } else if (track.kind === "audio") {
                const producer = await sendTransport.produce({ track });
                audioProducerRef.current = producer;
                console.log("✅ Initial audio producer created", {
                  producerId: producer.id,
                  trackId: track.id,
                });
              }
            }
            producedRef.current = true;
                    

            console.log("📡 Media tracks produced");
          }
        }

        if (message.type === "error") {
          console.error("⚠️ Server error:", message.message);
        }
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
      };

      ws.onclose = () => {
        console.log("🔌 Mentor WebSocket connection closed");
      };
    };

    startMedia().then(startWebSocket);

    return () => {
      wsRef.current?.close();
      sendTransportRef.current?.close?.();
      videoProducerRef.current?.close?.();
      audioProducerRef.current?.close?.();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      producedRef.current = false;
      wsRef.current = null;
    };
  }, [sessionData?.id]);

  useEffect(() => {
    const fetchParticipantCount = async () => {
      if (!sessionData?.id) return;

      try {
        const response = await apis.getParticipantCount(sessionData.id);

        if (response?.resultStatus !== "S") {
          console.warn("Invalid participant count response", response);
          return;
        }

        const participantArray = response.resultContent.participants;

        if (!Array.isArray(participantArray)) {
          console.error(
            "Expected an array of participants, got:",
            participantArray
          );
          setParticipants([]);
          return;
        }

        setParticipants(participantArray);
      } catch (err) {
        console.error("Failed to fetch participant list:", err);
      }
    };

    fetchParticipantCount();
  }, [sessionData?.id]);

  const toggleVideo = async () => {
    const sendTransport = sendTransportRef.current;
    if (!sendTransport || !localStreamRef.current) {
      console.warn("🚨 Video toggle skipped: missing transport or stream.");
      return;
    }

    if (isVideoEnabled) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = false;
        console.log("🎥 Video track disabled", {
          id: track.id,
          enabled: track.enabled,
          readyState: track.readyState,
        });
      });
      if (videoProducerRef.current) {
        videoProducerRef.current.pause();
        console.log("⏸️ Video producer paused");
      }
      setIsVideoEnabled(false);
      return;
    }

    try {
      // Re-enable video track
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = true;
        console.log("🎥 Video track enabled", {
          id: track.id,
          enabled: track.enabled,
          readyState: track.readyState,
          muted: track.muted,
        });
      });

      // Resume video producer
      if (videoProducerRef.current) {
        videoProducerRef.current.resume();
        console.log("▶️ Video producer resumed");
      } else {
        // Fallback: create new video producer
        const track = localStreamRef.current.getVideoTracks()[0];
        const producer = await sendTransport.produce({ track });
        videoProducerRef.current = producer;
        console.log("✅ Created new video producer", {
          producerId: producer.id,
          trackId: track.id,
        });
      }

      // Update video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
        localVideoRef.current.muted = true;
        localVideoRef.current.load();
        await localVideoRef.current.play().catch((err) => {
          console.error("🚨 Video playback error:", err);
          throw err;
        });
        console.log("📺 Video playback triggered");
      }

      setIsVideoEnabled(true);
      setVideoError(false);
    } catch (err) {
      console.error("🚨 Failed to re-enable video:", err);
      setVideoError(true);
      alert("Failed to enable video. Please try again or refresh the page.");
    }
  };

  const toggleAudio = async () => {
    const stream = localStreamRef.current;
    if (!stream || !audioProducerRef.current) {
      console.warn(
        "🚨 Audio toggle skipped: missing stream or audio producer."
      );
      return;
    }

    const newAudioEnabled = !isAudioEnabled;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = newAudioEnabled;
      console.log(
        `🎙️ Audio track ${newAudioEnabled ? "enabled" : "disabled"}`,
        {
          id: track.id,
          enabled: track.enabled,
          readyState: track.readyState,
          muted: track.muted,
        }
      );
    });

    if (newAudioEnabled) {
      audioProducerRef.current.resume();
      console.log("▶️ Audio producer resumed");
    } else {
      audioProducerRef.current.pause();
      console.log("⏸️ Audio producer paused");
    }

    setIsAudioEnabled(newAudioEnabled);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !wsRef.current || !sessionData?.id || !clientId)
      return;

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      sessionId: sessionData.id,
      senderId: clientId,
      senderRole: "mentor",
      senderName: "You (Mentor)",
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    wsRef.current.send(
      JSON.stringify({
        type: "chatMessage",
        sessionId: sessionData.id,
        peerId: clientId,
        payload: msg,
      })
    );

    setNewMessage("");
  };

  const handleEndSession = async () => {
    if (!window.confirm("Are you sure you want to end this session?")) return;

    try {
      const res = await apis.endSession();

      if (res.message === "Session ended successfully") {
        alert("Session ended successfully.");
        navigate("/mentor/dashboard");
      } else {
        alert("Failed to end session: " + res.message);
      }
    } catch (err) {
      console.error("End session error:", err);
      alert("Error ending session.");
    }
  };

  useEffect(() => {
    if (!sessionData?.end_time) return;

    updateRemainingTimer(sessionData.end_time, setRemainingTime);

    const interval = setInterval(() => {
      updateRemainingTimer(sessionData.end_time!, setRemainingTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData?.end_time]);

  if (!sessionData) return null;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <a
          href="/mentor/dashboard"
          className="flex items-center text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </a>

        <div className="flex items-center gap-4">
          {/* <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {sessionLive}
          </Badge> */}

          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participants.length} Participants
          </Badge>

          <Button variant="destructive" size="sm" onClick={handleEndSession}>
            End Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="capitalize">
                    {sessionData.title}
                  </CardTitle>
                  <CardDescription className="mt-1 capitalize">
                    {sessionData.topic || "No topic"} • Started at{" "}
                    {sessionData.start_time &&
                    !isNaN(new Date(sessionData.start_time).getTime())
                      ? format(new Date(sessionData.start_time), "h:mm a")
                      : "N/A"}{" "}
                    • {remainingTime} remaining
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share session link
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Manage participants
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="relative bg-muted aspect-video w-full flex items-center justify-center">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${
                    isVideoEnabled ? "" : "hidden"
                  }`}
                  onLoadedMetadata={() =>
                    console.log("Local video metadata loaded")
                  }
                  onError={(e) => console.error("Video element error:", e)}
                />
                {!isVideoEnabled && (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <VideoOff className="h-16 w-16 mb-2" />
                    <p>Video is turned off</p>
                  </div>
                )}
                {isVideoEnabled && videoError && (
                  <div className="absolute text-red-500">
                    Video failed to load. Please refresh the page.
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-center py-4">
              <div className="flex gap-4">
                <Button
                  variant={isAudioEnabled ? "default" : "outline"}
                  size="icon"
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant={isVideoEnabled ? "default" : "outline"}
                  size="icon"
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Description</h4>
                <p className="text-sm text-muted-foreground capitalize">
                  {sessionData.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Prerequisites</h4>
                  <p className="text-sm text-muted-foreground">
                    {sessionData.prerequisites}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Materials</h4>
                  <p className="text-sm text-muted-foreground">
                    {sessionData.materials}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-1">Skill Level</h4>
                <div className="flex gap-2">
                  {(sessionData.skill_level?.split(", ") || []).map(
                    (level: string) => (
                      <Badge key={level} variant="secondary">
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="chat">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger
                value="participants"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Participants ({participants.length})
              </TabsTrigger>
            </TabsList>

            <Card className="bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border-border/50 mt-2 border-t-0 rounded-t-none">
              <TabsContent value="chat" className="m-0">
                <CardContent className="p-0">
                  <div className="flex flex-col h-[500px]">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className="flex gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src="/placeholder.svg?height=32&width=32"
                                alt={message.senderName}
                              />
                              <AvatarFallback>
                                {message.senderName?.charAt(0) ?? "?"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {message.senderName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(message.timestamp),
                                    "h:mm a"
                                  )}
                                </span>
                              </div>
                              <p className="text-sm mt-1">
                                {message.text || "?"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <Separator />

                    <div className="p-4">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type a message..."
                          className="min-h-[80px] resize-none"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button onClick={handleSendMessage}>Send</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>

              <TabsContent value="participants" className="m-0">
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">
                          All Participants ({participants.length})
                        </h3>
                      </div>

                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={participant.avatar}
                                alt={participant.name}
                              />
                              <AvatarFallback>
                                {participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {participant.role}
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                Message privately
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Make presenter
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Remove from session
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </TabsContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
