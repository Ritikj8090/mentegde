import { api } from "@/services/api";

export const getChannelList = async (internshipId: string) => {
  const { data } = await api.get(`/internships/${internshipId}/chat/channels`);
  return data.channels;
};

export const getChannelMessages = async (
  internshipId: string,
  channelId: string,
) => {
  const { data } = await api.get(
    `/internships/${internshipId}/chat/channels/${channelId}/messages`,
    { params: { limit: 50, offset: 0 } },
  );
  return data.messages;
};

export const sendMessage = async (
  internshipId: string,
  channelId: string,
  text?: string,
  files?: File[],
) => {
  const fd = new FormData();
  fd.append("text", text || "");
  files?.forEach((f) => fd.append("chat_files", f));

  const { data } = await api.post(
    `/internships/${internshipId}/chat/channels/${channelId}/messages`,
    fd,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return data.message;
};

export const verifyUser = async () => {
  const response = await api.get("/verify");
  return response.data;
};