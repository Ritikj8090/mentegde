import axios from "axios";
import { BASE_URL, WS_URL } from "../components/config/CommonBaseUrl";

interface userDataProps {
  email: string;
  username: string;
  password: string;
}

interface SessionDataProps {
  mentor_id?: string;
  title?: string;
  description?: string;
  topic?: string;
  duration?: number;
  max_participants?: number;
  format?: string;
  prerequisites?: string;
  materials?: string;
  skill_level?: string;
  session_type?: string;
  start_time?: string;
  end_time?: string;
}

interface Mentor {
  id: string;
  user_id: string;
  username: string;
  email: string;
  bio: string;
  expertise: string[];
  rating: number;
  created_at: string;
  isLive?: boolean;
}

// interface FetchSessionProps {
//   session_id?: string;
//   mentor_id?: string;
// }

interface FetchSessionProps {
  token?: string; // Updated to use token instead of session_id/mentor_id directly
}

interface UpdateLiveStatusProps {
  mentorId: string;
  isLive: boolean;
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const wsApi = axios.create({
  baseURL: WS_URL,
  withCredentials: true,
});

const apis = {
  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    console.log(response);
    return {
      user: response.data.user,
      token: response.data.token,
      websocketToken: response.data.websocketToken,
    };
  },

  signup: async (userData: userDataProps) => {
    const response = await api.post("/signup", userData);
    return response.data; // Return { user, token }
  },

  // verifyUser: async () => {
  //   const response = await api.get("/verify");
  //   return {
  //     user: response.data.user,
  //     websocketToken: response.data.websocketToken,
  //     token: "",
  //   };
  // },

  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },

  findUser: async (payload: { email?: string; id?: string }) => {
    const response = await api.post("/find", payload);
    return response.data.data; // Adjust if wrapped in a `data` field
  },

  // getUserDashboard: async () => {
  //   const response = await api.get("/dashboard");
  //   return response.data; // Return { message, user }
  // },

  // getMentorDashboard: async () => {
  //   const response = await api.get("/mentor/dashboard");
  //   return response.data; // Return { message, user }
  // },

  createSession: async (sessionData: SessionDataProps) => {
    const response = await api.post("/create-session", sessionData);
    return response.data.data;
  },

  fetchSession: async ({ token }: FetchSessionProps) => {
    const response = await api.post("/fetch-session", { token });
    return response.data.data;
  },

  // Mentor-related endpoints
  getMentors: async (): Promise<Mentor[]> => {
    const response = await api.get("/mentors"); // remove extra '/api'
    return response.data || [];
  },

  getLiveMentors: async (): Promise<Mentor[]> => {
    const response = await api.get("/mentors/live"); // remove extra '/api'
    return response.data || [];
  },

  updateMentorLiveStatus: async ({
    mentorId,
    isLive,
  }: UpdateLiveStatusProps) => {
    const response = await api.post("/updateMentorLiveStatus", {
      mentorId,
      isLive,
    });
    return response.data;
  },

  onboardUser: async (payload: any) => {
    const response = await api.post("/onboard", payload);
    return response.data;
  },

  checkUsernameAvailability: async (username: string): Promise<boolean> => {
    const response = await api.post("/check-username", { username });
    return response.data.available;
  },

  checkEmailAvailability: async (email: string): Promise<boolean> => {
    const response = await api.post("/check-email", { email });
    return response.data.available;
  },

  // getLiveSessionByMentor: async (mentorId: string) => {
  //   const response = await api.post("/fetch-session-by-mentor", { mentorId });
  //   return response.data?.data;
  // },

  getMentorProfile: async () => {
    const response = await api.post("/mentor/profile", {});
    return response.data;
  },

  fetchLiveSessionByMentorId: async (mentorId: string) => {
    const response = await api.post("/fetch-session-by-mentor", {
      mentor_id: mentorId,
    });
    return response.data; // Contains session info
  },

  endSession: async () => {
    const response = await api.post("/end-session");
    return response.data;
  },

  getParticipantCount: async (sessionId: string) => {
    const response = await api.get(`/session/${sessionId}/participant-count`);
    return response.data; // ← required!
  },

  checkFollowStatus: async (mentorId: string) => {
    const response = await api.get(`/follow/status/${mentorId}`);
    return response.data;
  },

  followMentor: async (mentorId: string) => {
    return await api.post("/follow", { mentorId });
  },

  unfollowMentor: async (mentorId: string) => {
    return await api.post("/unfollow", { mentorId });
  },

  getPendingFollowRequests: async () => {
    const response = await api.get("/follow/pending");
    return response.data.requests;
  },

  acceptFollowRequest: async (userId: string) => {
    return await api.post("/follow/accept", { userId });
  },

  rejectFollowRequest: async (userId: string) => {
    return await api.post("/follow/reject", { userId });
  },

  isFollowingMentor: async (mentorId: string) => {
    const response = await api.get(`/mentor/${mentorId}/is-following`);
    return response.data;
  },

  getConversations: async () => {
    const response = await api.post("/chat/conversations");
    return response.data.resultContent || [];
  },

  getMessages: async (conversationId: string) => {
    const response = await api.post("/chat/messages", { conversationId });
    return response.data.resultContent || [];
  },

  sendMessage: async (
    senderId: string,
    receiverId: string,
    message: string
  ) => {
    const response = await api.post("/chat/send-message", {
      senderId,
      receiverId,
      message,
    });
    return response.data; // returns { conversation, savedMessage }
  },

  initiateConversation: async (senderId: string, receiverId: string) => {
    const response = await api.post("/chat/initiate", { senderId, receiverId });
    return response.data.conversation; // Match backend response
  },

  refreshWebSocketToken: async (): Promise<string> => {
    const response = await api.get("/refresh-ws-token"); // your backend route
    return response.data.websocketToken; // must match backend key
  },
};

export default apis;
