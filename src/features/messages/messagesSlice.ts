import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Conversation, ChatMessage, MessageReceipt, UserProfile } from '../../types';

export interface MessagesState {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  searchFilter: string;
  readReceiptKeys: string[];
}

const initialState: MessagesState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
  searchFilter: '',
  readReceiptKeys: []
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    replaceConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      if (!state.activeConversationId && action.payload.length) {
        state.activeConversationId = action.payload[0].id;
      }
    },
    setConversationMessages: (state, action: PayloadAction<{ conversationId: string; messages: ChatMessage[] }>) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    appendServerMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { conversationId } = action.payload;
      state.messages[conversationId] ||= [];
      const existingMessage = state.messages[conversationId].find(message => message.id === action.payload.id);
      if (!existingMessage) {
        state.messages[conversationId].push(action.payload);
      }
      const conversation = state.conversations.find(item => item.id === conversationId);
      if (conversation) {
        conversation.lastMessage = existingMessage ?? action.payload;
        conversation.updatedAt = action.payload.timestamp;
      }
    },
    upsertConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(item => item.id === action.payload.id);
      if (index < 0) state.conversations.unshift(action.payload);
      else state.conversations[index] = action.payload;
      state.activeConversationId = action.payload.id;
      state.messages[action.payload.id] ||= [];
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
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
      action: PayloadAction<{ message: ChatMessage; currentUserId: string }>
    ) => {
      const { message, currentUserId } = action.payload;
      const { conversationId } = message;
      state.messages[conversationId] ||= [];
      if (state.messages[conversationId].some?.(item => item.id === message.id)) return;
      state.messages[conversationId].push(message);

      const conv = state.conversations.find(c => c.id === conversationId);
      if (conv) {
        conv.lastMessage = message;
        conv.updatedAt = message.timestamp;
        if (message.senderId !== currentUserId && state.activeConversationId !== conversationId) {
          conv.unreadCount += 1;
        }
      }
    },
    updateMessageReceipts: (
      state,
      action: PayloadAction<{ conversationId: string; receipts: MessageReceipt[]; currentUserId: string }>
    ) => {
      const { conversationId, receipts, currentUserId } = action.payload;
      for (const receipt of receipts) {
        const receiptKey = `${receipt.messageId}:${receipt.userId}`;
        const becameRead = receipt.userId === currentUserId &&
          Boolean(receipt.readAt) &&
          !state.readReceiptKeys.includes(receiptKey);
        if (becameRead) state.readReceiptKeys.push(receiptKey);

        const chatMessage = state.messages[conversationId]?.find(item => item.id === receipt.messageId);
        const conversation = state.conversations.find(item => item.id === conversationId);
        if (chatMessage) {
          chatMessage.receipts = chatMessage.receipts ?? [];
          const existing = chatMessage.receipts.find(item => item.userId === receipt.userId);
          if (existing) {
            existing.deliveredAt = receipt.deliveredAt;
            existing.readAt = receipt.readAt;
          } else {
            chatMessage.receipts.push(receipt);
          }

          const recipients = chatMessage.receipts.filter(item => item.userId !== chatMessage.senderId);
          if (recipients.length && recipients.every(item => item.readAt)) {
            chatMessage.status = 'read';
          } else if (recipients.length && recipients.every(item => item.deliveredAt)) {
            chatMessage.status = 'delivered';
          } else {
            chatMessage.status = 'sent';
          }

          if (conversation?.lastMessage?.id === chatMessage.id) {
            conversation.lastMessage = chatMessage;
          }
        }
        if (becameRead && state.activeConversationId !== conversationId && conversation) {
          conversation.unreadCount = Math.max(0, conversation.unreadCount - 1);
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
      const conversation = state.conversations.find(item => item.id === action.payload);
      if (conversation) conversation.unreadCount = 0;
    }
  }
});

export const {
  replaceConversations,
  setConversationMessages,
  appendServerMessage,
  upsertConversation,
  setActiveConversation,
  sendMessage,
  receiveMessage,
  updateMessageReceipts,
  setTypingStatus,
  startConversationWithUser,
  setMessagesSearchFilter,
  markMessagesAsRead
} = messagesSlice.actions;

export default messagesSlice.reducer;
