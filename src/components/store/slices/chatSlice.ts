import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  user1_name: string;
  user2_name: string;
  user1_avatar: string;
  user2_avatar: string;
  last_message: string;
  last_message_at: string;
  online: boolean;
}

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
}

const initialState: ChatState = {
  conversations: [],
  activeConversation: null,
  messages: [],
};

export const updateUserStatus = createAction<{
  userId: string;
  online: boolean;
}>("chat/updateUserStatus");

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (
      state,
      action: PayloadAction<Conversation | null>
    ) => {
      state.activeConversation = action.payload;
      state.messages = [];
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const exists = state.conversations.find(
        (c) =>
          (c.user1_id === action.payload.user1_id &&
            c.user2_id === action.payload.user2_id) ||
          (c.user1_id === action.payload.user2_id &&
            c.user2_id === action.payload.user1_id)
      );
      if (!exists) {
        state.conversations.push(action.payload);
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const exists = state.messages.find((m) => m.id === action.payload.id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserStatus, (state, action) => {
      const { userId, online } = action.payload;
      const convo = state.conversations.find(
        (c) => c.user1_id === userId || c.user2_id === userId
      );
      if (convo) {
        convo.online = online;
      }
    });
  },
});

export const {
  setConversations,
  setActiveConversation,
  addConversation,
  setMessages,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
