import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLiveMentors,
  updateLiveStatus,
} from "@/components/store/slices/mentorSlice";
import { RootState } from "@/components/store/store";
import { WS_URL } from "@/components/config/CommonBaseUrl";

interface LiveMentor {
  user_id: string;
  username?: string;
  email?: string;
  [key: string]: any;
}
export function useLiveMentorsSocket() {
  const { websocketToken, isAuthenticated, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const wsRef = useRef<WebSocket | null>(null);

  const authReady = !!websocketToken && isAuthenticated && !isLoading;

  useEffect(() => {
    if (!authReady) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_URL}?token=${websocketToken}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ Connected to live mentor socket");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "mentorLiveStatus") {
        const { userId, isLive } = message.data || {};
        if (userId && userId !== "undefined") {
          dispatch(updateLiveStatus(message.data));
        }
      } else if (message.type === "liveMentors") {
        const filtered = (message.data || []).filter(
          (m: LiveMentor) => m?.user_id && m?.user_id !== "undefined"
        );
        dispatch(setLiveMentors(filtered));
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error (mentors)", err);
    };

    ws.onclose = () => {
      console.warn("🔌 Live mentor socket disconnected, retrying...");
      setTimeout(() => {
        if (authReady) {
          const retryWs = new WebSocket(`${WS_URL}?token=${websocketToken}`);
          wsRef.current = retryWs;
        }
      }, 3000);
    };

    return () => {
      ws.close();
    };
  }, [authReady]);
}
