import { api } from "@/services/api";

export const getConversationList = async () => {
  const response = await api.get("/chat/conversations");
  return response.data.conversations;
};

export const getMessages = async (conversationId: string) => {
  const response = await api.get(`chat/conversations/${conversationId}/messages?limit=50&offset=0`);
  return response.data.messages;
};

export const sendMessage = async (
  conversationId: string,
  text?: string,
  files?: File[],
) => {
  const fd = new FormData();
  fd.append("text", text || "");
  files?.forEach((file) => fd.append("chat_files", file)); // can append multiple

  const response = await api.post(
    `/chat/conversations/${conversationId}/messages`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};
