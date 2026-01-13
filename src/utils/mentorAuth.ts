import { api } from "@/services/api";

export const mentorSignup = async (full_name: string, email: string, password: string) => {
    const response = await api.post("/auth/mentor-signup", { full_name, email, password });
    return response.data;
};

export const mentorLogin = async (email: string, password: string) => {
  const response = await api.post("/auth/mentor-login", { email, password });
  return {
    user: response.data.data,
    token: response.data.token,
    websocketToken: response.data.websocketToken,
  };
};

export const findMentor = async (payload: { email?: string; id?: string, full_name?: string }) => {
  const response = await api.post("/auth/find-mentor", {...payload});
  return response.data; // Adjust if wrapped in a `data` field
}

export const findMentors = async (payload: { email?: string; id?: string, full_name?: string }) => {
  const response = await api.post("/auth/find-mentors", {...payload});
  return response.data; // Adjust if wrapped in a `data` field
}