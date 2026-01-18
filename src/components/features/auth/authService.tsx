import axios from "axios";
import { BASE_URL } from "@/components/config/CommonBaseUrl";
import { User } from "./authTypes";

interface Mentor {
  id: string; // This is user_id
  user_id: string;
  username: string;
  email: string;
  role: "user" | "mentor";
  avatar?: string;
  bio?: string;
  expertise?: string | string[];
  title?: string;
  hourlyRate?: number;
  rating?: number;
  isLive?: boolean;
}

interface LiveStatusUpdate {
  isLive: boolean;
}

const authService = {
  /**
   * Fetches all mentors from the backend
   */
  fetchMentors: async (): Promise<Mentor[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/mentors`, {
      withCredentials: true,
    });
    console.log("API response:", response.data); // Add this
    return response.data.map((mentor: any) => ({
      id: mentor.user_id,
      user_id: mentor.user_id,
      username: mentor.username,
      email: mentor.email,
      role: mentor.role || "mentor",
      avatar: mentor.avatar,
      bio: mentor.bio,
      expertise: mentor.expertise,
      title: mentor.title,
      hourlyRate: mentor.hourly_rate,
      rating: mentor.rating,
      isLive: mentor.isLive || false,
    }));
  } catch (error) {
    console.error("Failed to fetch mentors:", error);
    throw new Error("Failed to fetch mentors");
  }
},

fetchLiveMentors: async (): Promise<Mentor[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/mentors/live`, {
      withCredentials: true,
    });
    return response.data.map((mentor: any) => ({
      id: mentor.user_id,
      user_id: mentor.user_id,
      username: mentor.username,
      email: mentor.email,
      role: mentor.role || "mentor",
      avatar: mentor.avatar,
      bio: mentor.bio,
      expertise: mentor.expertise,
      title: mentor.title,
      hourlyRate: mentor.hourly_rate,
      rating: mentor.rating,
      isLive: true,
    }));
  } catch (error) {
    throw new Error("Failed to fetch live mentors");
  }
},

  /**
   * Updates the live status of the current mentor
   */
  updateLiveStatus: async ({ isLive }: { isLive: boolean }): Promise<void> => {
    await axios.post(`${BASE_URL}/updateMentorLiveStatus`, { isLive }, { withCredentials: true });
  },
};

export default authService;