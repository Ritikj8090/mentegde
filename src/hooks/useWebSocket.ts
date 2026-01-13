import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/components/store";
import apis from "@/services/api";
import {
  updateUserStatus,
  addMessage,
} from "@/components/store/slices/chatSlice";

const WS_URL = import.meta.env.VITE_WS_URL;

export const useWebSocket = (userId?: string) => {
  const { websocketToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>(); // ✅ correctly typed
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const pingInterval = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasMarkedOnline = useRef(false);

  const connect = useCallback(
    (token: string) => {
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      socketRef.current = ws;
      hasMarkedOnline.current = false;

      ws.onopen = () => {
        console.log("✅ WebSocket connected");
        reconnectAttempts.current = 0;

        if (userId && !hasMarkedOnline.current) {
          ws.send(
            JSON.stringify({
              type: "userOnline",
              payload: { userId },
            })
          );
          hasMarkedOnline.current = true;
        }

        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000);
      };

      ws.onclose = async () => {
        console.warn("⚠️ WebSocket closed, retrying...");
        if (pingInterval.current) clearInterval(pingInterval.current);

        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectAttempts.current++;

        reconnectTimeout.current = setTimeout(async () => {
          try {
            const newToken = await apis.refreshWebSocketToken();
            if (newToken) connect(newToken);
          } catch (err) {
            console.error("❌ WebSocket token refresh failed", err);
          }
        }, delay);
      };

      ws.onerror = (err) => {
        console.error("🛑 WebSocket error:", err);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "pong") return;

        if (data.type === "userStatus") {
          dispatch(updateUserStatus(data.payload));
        }

        if (data.type === "newPrivateMessage") {
          const msg = data.payload.message;
          dispatch((dispatch, getState: () => RootState) => {
            const existing = getState().chat.messages.some(
              (m) => m.id === msg.id
            );
            if (!existing) {
              dispatch(
                addMessage({
                  id: msg.id,
                  text: msg.message,
                  senderId: msg.sender_id,
                  timestamp: msg.created_at,
                  read: msg.status === "delivered",
                })
              );
            }
          });
        }
      };
    },
    [userId, dispatch]
  );

  useEffect(() => {
    if (!userId || !websocketToken) return;
    connect(websocketToken);

    const onBeforeUnload = () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({ type: "userOffline", payload: { userId } })
        );
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden" && socketRef.current) {
        socketRef.current.send(
          JSON.stringify({ type: "userOffline", payload: { userId } })
        );
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      socketRef.current?.close();
      if (pingInterval.current) clearInterval(pingInterval.current);
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [userId, websocketToken, connect]);

  const sendMessage = useCallback((msg: any) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  }, []);

  return {
    socket: socketRef.current,
    sendMessage,
    ready: socketRef.current?.readyState === WebSocket.OPEN,
  };
};
