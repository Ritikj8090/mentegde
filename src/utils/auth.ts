import { api } from "@/services/api";
import { UserProfile } from "..";

export const userSignup = async (full_name: string, email: string, password: string) => {
    const response = await api.post("/auth/signup", { full_name,email, password });
    return response.data;
};

export const userLogin = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return {
    user: response.data.data,
    token: response.data.token,
    websocketToken: response.data.websocketToken,
  };
};

export const userLogout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const oboardingUser = async (data:any) => {
  const response = await api.put("/auth/oboarding-user", data);
  return response.data;
}

export const verifyUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
}

export const getCurrentUser = async () => {
  const response = await api.post("/auth/current-user");
  return response.data;
}