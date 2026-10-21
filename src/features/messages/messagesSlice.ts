import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Conversation, ChatMessage, UserProfile } from '../../types';
import { MOCK_CONVERSATIONS, MOCK_MESSAGES_MAP } from '../../mocks/conversations';

export interface MessagesState {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  searchFilter: string;
}

const initialState: MessagesState = {
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES_MAP,
  activeConversationId: 'conv_1',
  searchFilter: ''
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      if (action.payload) {
        const conv = state.conversations.find(c => c.id === action.payload);
        if (conv) conv.unreadCount = 0;
      }
    },
    sendMessage: (
      state,
      action: PayloadAction<{ conversationId: string; text: string; imageUrl?: string }>
    ) => {
      const { conversationId, text, imageUrl } = action.payload;
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: 'usr_me',
        text,
        imageUrl,
        timestamp: 'Just now',
        status: 'delivered'
      };

      if (!state.messages) {
        state.messages = {};
      }
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(newMsg);

      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.lastMessage = newMsg;
        conv.updatedAt = 'Just now';
      }
    },
    receiveMessage: (
      state,
      action: PayloadAction<{ conversationId: string; text: string; senderId: string; imageUrl?: string }>
    ) => {
      const { conversationId, text, senderId, imageUrl } = action.payload;
      const newMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId,
        text,
        imageUrl,
        timestamp: 'Just now',
        status: 'delivered'
      };

      if (!state.messages) {
        state.messages = {};
      }
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(newMsg);

      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.lastMessage = newMsg;
        conv.updatedAt = 'Just now';
        if (state.activeConversationId !== conversationId) {
          conv.unreadCount += 1;
        }
      }
    },
    setTypingStatus: (
      state,
      action: PayloadAction<{ conversationId: string; isTyping: boolean }>
    ) => {
      const conv = state.conversations.find(c => c.id === action.payload.conversationId);
      if (conv) {
        conv.isTyping = action.payload.isTyping;
      }
    },
    startConversationWithUser: (
      state,
      action: PayloadAction<{ user: UserProfile; initialMessage?: string }>
    ) => {
      const { user, initialMessage } = action.payload;
      if (!state.messages) {
        state.messages = {};
      }

      let existing = state.conversations.find(c => c.participant.id === user.id);

      if (!existing) {
        const newConvId = `conv_${user.id}`;
        const newConv: Conversation = {
          id: newConvId,
          participant: user,
          unreadCount: 0,
          updatedAt: 'Just now'
        };
        state.conversations.unshift(newConv);
        state.messages[newConvId] = [];
        existing = newConv;
      }

      state.activeConversationId = existing.id;

      if (!state.messages[existing.id]) {
        state.messages[existing.id] = [];
      }

      if (initialMessage) {
        const msg: ChatMessage = {
          id: `msg_${Date.now()}`,
          conversationId: existing.id,
          senderId: 'usr_me',
          text: initialMessage,
          timestamp: 'Just now',
          status: 'delivered'
        };
        state.messages[existing.id].push(msg);
        existing.lastMessage = msg;
      }
    },
    setMessagesSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    markMessagesAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const msgs = state.messages[conversationId];
      if (msgs) {
        msgs.forEach(m => {
          if (m.senderId === 'usr_me') {
            m.status = 'read';
          }
        });
      }
    }
  }
});

export const {
  setActiveConversation,
  sendMessage,
  receiveMessage,
  setTypingStatus,
  startConversationWithUser,
  setMessagesSearchFilter,
  markMessagesAsRead
} = messagesSlice.actions;

export default messagesSlice.reducer;
