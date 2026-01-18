// src/components/store/slices/mentorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import authService from "@/components/features/auth/authService";

export interface Mentor {
  id: string;
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

interface MentorState {
  liveMentors: Mentor[];
  loading: boolean;
  error: string | null;
}

const initialState: MentorState = {
  liveMentors: [],
  loading: false,
  error: null,
};

export const fetchLiveMentors = createAsyncThunk<
  Mentor[],
  void,
  { rejectValue: string }
>("mentors/fetchLiveMentors", async (_, { rejectWithValue }) => {
  try {
    return await authService.fetchLiveMentors();
  } catch (error: any) {
    if (error.response?.status === 401) {
      return rejectWithValue("Unauthorized");
    }
    return rejectWithValue(error.message || "Failed to fetch live mentors");
  }
});

const mentorSlice = createSlice({
  name: "mentors",
  initialState,
  reducers: {
    setLiveMentors: (state, action: PayloadAction<Mentor[]>) => {
      state.liveMentors = action.payload;
    },
    updateLiveStatus: (
      state,
      action: PayloadAction<{ userId: string; isLive: boolean }>
    ) => {
      const { userId, isLive } = action.payload;
      const index = state.liveMentors.findIndex((m) => m.user_id === userId);

      if (index !== -1) {
        if (!isLive) state.liveMentors.splice(index, 1); // Remove if offline
        else state.liveMentors[index].isLive = true; // Update if online
      } else if (isLive) {
        state.liveMentors.push({
          id: userId,
          user_id: userId,
          username: "Unknown",
          email: "",
          role: "mentor",
          isLive: true,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveMentors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveMentors.fulfilled, (state, action) => {
        state.liveMentors = action.payload;
        state.loading = false;
      })
      .addCase(fetchLiveMentors.rejected, (state, action) => {
        // 👇 Ignore 401 Unauthorized errors (common on login page or expired session)
        if (action.payload?.includes("401")) {
          state.error = null;
          state.loading = false;
          return;
        }

        // ✅ Log other errors
        state.error = action.payload || "Error fetching live mentors";
        state.loading = false;
      });
  },
});

export const { setLiveMentors, updateLiveStatus } = mentorSlice.actions;
export default mentorSlice.reducer;
