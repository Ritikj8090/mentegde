import { api } from "@/services/api";

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file); // MUST match upload.single("avatar")

  const response = await api.post("/auth/upload/avatar", formData, {
    withCredentials: true, // cookies
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateUserORMentorInfo = async ({ avatarUrl }: { avatarUrl?: string }) => {
  const response = await api.put(
    "/auth/profile",
    { avatar: avatarUrl },
    { withCredentials: true },
  );

  return response.data;
};
