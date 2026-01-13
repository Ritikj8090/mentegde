import * as mediasoupClient from "mediasoup-client";
import { TURN_CONFIG, STUN_CONFIG } from "@/components/config/CommonBaseUrl";

const iceServers = [
  STUN_CONFIG,
  TURN_CONFIG,
];

export async function createSendTransport(
  socket: WebSocket,
  device: mediasoupClient.Device,
  sessionId: string,
  peerId: string
): Promise<mediasoupClient.types.Transport> {
  return new Promise((resolve, reject) => {
    socket.send(
      JSON.stringify({
        type: "createTransport",
        direction: "send",
        peerId,
        sessionId,
      })
    );

    const handleTransportCreated = async (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "transportCreated" && msg.direction === "send") {
        const transport = device.createSendTransport({
          ...msg.data,
          iceServers, // 👈 inject TURN + STUN
        });

        let isConnected = false;

        transport.on("connect", ({ dtlsParameters }, callback, errback) => {
          if (isConnected) return;
          isConnected = true;

          socket.send(
            JSON.stringify({
              type: "connectTransport",
              direction: "send",
              peerId,
              sessionId,
              data: { dtlsParameters },
            })
          );
          callback();
        });

        transport.on("produce", ({ kind, rtpParameters }, callback) => {
          socket.send(
            JSON.stringify({
              type: "produce",
              direction: "send",
              peerId,
              sessionId,
              data: { kind, rtpParameters },
            })
          );

          const onProduced = (event: MessageEvent) => {
            const res = JSON.parse(event.data);
            if (res.type === "produced") {
              socket.removeEventListener("message", onProduced);
              callback({ id: res.id });
            }
          };

          socket.addEventListener("message", onProduced);
        });

        socket.removeEventListener("message", handleTransportCreated);
        resolve(transport);
      }
    };

    socket.addEventListener("message", handleTransportCreated);
  });
}

export async function createRecvTransport(
  socket: WebSocket,
  device: mediasoupClient.Device,
  sessionId: string,
  peerId: string
): Promise<mediasoupClient.types.Transport> {
  return new Promise((resolve, reject) => {
    socket.send(
      JSON.stringify({
        type: "createTransport",
        direction: "recv",
        peerId,
        sessionId,
      })
    );

    const handleTransportCreated = async (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "transportCreated" && msg.direction === "recv") {
        const transport = device.createRecvTransport({
          ...msg.data,
          iceServers, // 👈 inject TURN + STUN
        });

        let isConnected = false;

        transport.on("connect", ({ dtlsParameters }, callback, errback) => {
          if (isConnected) return;
          isConnected = true;

          socket.send(
            JSON.stringify({
              type: "connectTransport",
              direction: "recv",
              peerId,
              sessionId,
              data: { dtlsParameters },
            })
          );
          callback();
        });

        socket.removeEventListener("message", handleTransportCreated);
        resolve(transport);
      }
    };

    socket.addEventListener("message", handleTransportCreated);
  });
}
