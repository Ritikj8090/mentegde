import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Paperclip,
  Users,
  Hash,
  Loader2,
  X,
  FileText,
  Image,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import ChatChannelPage from "./chatChannel/ChatChannelPage";

// API Base URL - Update this to your backend URL
const WS_URL = "wss://localhost:4000/chat"; // WebSocket URL

// Types
interface Channel {
  id: string;
  internship_id: string;
  channel_type: string;
  domain_name?: string;
  created_at: string;
}

interface MessageFile {
  id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  created_at: string;
  sender_name: string;
  sender_avatar?: string;
  files: MessageFile[];
}

// Utility function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Utility function to get file icon
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return <Image className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
};

export default function InternshipChat() {
  const [internshipId, setInternshipId] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get auth token from localStorage or your auth context
  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjOTBiMDUyLTQ1NzUtNDM2Yi04MDljLWFlOWQ5N2E0ZTIyMCIsImZ1bGxfbmFtZSI6IkFkaXR5YSBUaXdhcmkiLCJlbWFpbCI6IlJpdGlrajcxM0BnbWFpbC5jb20iLCJhdmF0YXIiOiJodHRwczovL3Vuc3BsYXNoLmNvbS9zL3Bob3Rvcy9wcm9maWxlIiwicm9sZSI6InVzZXIiLCJnZW5kZXIiOiJtYWxlIiwiaWF0IjoxNzY5MDI4ODU4LCJleHAiOjE3NzE2MjA4NTh9.6mrFPomskH-BamAKqPqTDl0augZgqkHcfI6CuQxVKuM";
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    if (!internshipId) return;

    const token = getAuthToken();
    const socket = new WebSocket(`${WS_URL}?token=${token}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "internshipChannelMessage") {
          const { channelId, message } = data.payload;

          // Only add message if it's for the current channel
          if (selectedChannel && channelId === selectedChannel.id) {
            setMessages((prev) => [...prev, message]);
          }
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [internshipId, selectedChannel]);

  // Fetch channels
  const fetchChannels = async () => {
    if (!internshipId) return;

    setLoading(true);
    try {
      const response = await api.get(
        `/internships/${internshipId}/chat/channels`,
      );
      console.log(response);
      if (!response.status) throw new Error("Failed to fetch channels");

      const data = await response.data;
      setChannels(data.channels);
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a channel
  const fetchMessages = async (channelId: string) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/internships/${internshipId}/chat/channels/${channelId}/messages?limit=100&offset=0`,
      );

      if (!response.status) throw new Error("Failed to fetch messages");

      const data = await response.data;
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!selectedChannel || (!messageText.trim() && selectedFiles.length === 0))
      return;

    setSending(true);
    try {
      const formData = new FormData();
      if (messageText.trim()) {
        formData.append("text", "messageText");
      }

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post(
        `/internships/${internshipId}/chat/channels/${selectedChannel.id}/messages`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (!response.status) throw new Error("Failed to send message");

      // Clear input
      setMessageText("");
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Handle channel selection
  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    fetchMessages(channel.id);
  };

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

  return (
    <ChatChannelPage />
  );
}
