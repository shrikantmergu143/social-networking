import type { Conversation, ChatMessage, AppNotification } from '../types';
import { MOCK_USERS } from './users';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_1',
    participant: MOCK_USERS[0], // Elena Rostova
    unreadCount: 1,
    isTyping: false,
    updatedAt: '12m ago',
    lastMessage: {
      id: 'msg_103',
      conversationId: 'conv_1',
      senderId: 'usr_1',
      text: 'Would love that! How about this Thursday around 6:30pm at Vermentino?',
      timestamp: '12m ago',
      status: 'delivered'
    }
  },
  {
    id: 'conv_2',
    participant: MOCK_USERS[1], // Maya Lin
    unreadCount: 0,
    isTyping: false,
    updatedAt: '1h ago',
    lastMessage: {
      id: 'msg_204',
      conversationId: 'conv_2',
      senderId: 'usr_me',
      text: 'Sent you that Japanese ambient vinyl album link! Let me know what you think of track 3.',
      timestamp: '1h ago',
      status: 'read'
    }
  },
  {
    id: 'conv_3',
    participant: MOCK_USERS[5], // Chloe Dupont
    unreadCount: 0,
    isTyping: false,
    updatedAt: '5h ago',
    lastMessage: {
      id: 'msg_302',
      conversationId: 'conv_3',
      senderId: 'usr_6',
      text: 'The ceramic series looks stunning in person. Come by the gallery Friday preview!',
      timestamp: '5h ago',
      status: 'read'
    }
  },
  {
    id: 'conv_4',
    participant: MOCK_USERS[17], // Camille Laurent
    unreadCount: 0,
    isTyping: false,
    updatedAt: '1d ago',
    lastMessage: {
      id: 'msg_401',
      conversationId: 'conv_4',
      senderId: 'usr_18',
      text: 'Next weekend sourdough workshop is officially booked! Excited to see your crumb structure.',
      timestamp: '1d ago',
      status: 'read'
    }
  }
];

export const MOCK_MESSAGES_MAP: Record<string, ChatMessage[]> = {
  conv_1: [
    {
      id: 'msg_101',
      conversationId: 'conv_1',
      senderId: 'usr_1',
      text: 'Hey Alex! Saw your design notes on the vertical cadence grid. So satisfying to look at.',
      timestamp: '2h ago',
      status: 'read'
    },
    {
      id: 'msg_102',
      conversationId: 'conv_1',
      senderId: 'usr_me',
      text: 'Thank you Elena! I really admire your ceramics work too — that subtle terracotta glaze is exquisite. We should grab coffee or natural wine sometime!',
      timestamp: '45m ago',
      status: 'read'
    },
    {
      id: 'msg_103',
      conversationId: 'conv_1',
      senderId: 'usr_1',
      text: 'Would love that! How about this Thursday around 6:30pm at Vermentino?',
      timestamp: '12m ago',
      status: 'delivered'
    }
  ],
  conv_2: [
    {
      id: 'msg_201',
      conversationId: 'conv_2',
      senderId: 'usr_2',
      text: 'Hey Alex! It is an instant match ✨ You produce beats too right?',
      timestamp: 'Yesterday',
      status: 'read'
    },
    {
      id: 'msg_202',
      conversationId: 'conv_2',
      senderId: 'usr_me',
      text: 'Yes! Mostly chill ambient and lo-fi beats with analog synths. Saw your rooftop set preview!',
      timestamp: 'Yesterday',
      status: 'read'
    },
    {
      id: 'msg_203',
      conversationId: 'conv_2',
      senderId: 'usr_2',
      text: 'Drop some track recommendations my way whenever you have a minute!',
      timestamp: '3h ago',
      status: 'read'
    },
    {
      id: 'msg_204',
      conversationId: 'conv_2',
      senderId: 'usr_me',
      text: 'Sent you that Japanese ambient vinyl album link! Let me know what you think of track 3.',
      timestamp: '1h ago',
      status: 'read'
    }
  ]
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'match',
    actor: {
      id: 'usr_1',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    text: 'You and Elena matched! Say hello to start the spark.',
    targetId: 'usr_1',
    targetType: 'profile',
    createdAt: '15m ago',
    isRead: false
  },
  {
    id: 'notif_2',
    type: 'message',
    actor: {
      id: 'usr_1',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    text: 'Elena sent you a message: "Would love that! How about this Thursday..."',
    targetId: 'conv_1',
    targetType: 'conversation',
    createdAt: '12m ago',
    isRead: false
  },
  {
    id: 'notif_3',
    type: 'like',
    actor: {
      id: 'usr_2',
      name: 'Maya Lin',
      username: 'mayalin',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
    },
    text: 'Maya liked your recent post: "Finalizing typographic spacing rules..."',
    targetId: 'post_4',
    targetType: 'post',
    createdAt: '1h ago',
    isRead: true
  },
  {
    id: 'notif_4',
    type: 'comment',
    actor: {
      id: 'usr_1',
      name: 'Elena Rostova',
      username: 'elenarostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    },
    text: 'Elena commented on your post: "The font pairings here are so clean..."',
    targetId: 'post_4',
    targetType: 'post',
    createdAt: '2h ago',
    isRead: true
  },
  {
    id: 'notif_5',
    type: 'follow',
    actor: {
      id: 'usr_6',
      name: 'Chloe Dupont',
      username: 'chloe_dupont',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80'
    },
    text: 'Chloe started following your social profile.',
    targetId: 'usr_6',
    targetType: 'profile',
    createdAt: '5h ago',
    isRead: true
  },
  {
    id: 'notif_6',
    type: 'system',
    actor: {
      id: 'aura_system',
      name: 'Aura Concierge',
      username: 'aura',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    text: 'Welcome to Aura! Explore people in Discovery or share your first story to connect with your community.',
    createdAt: '1d ago',
    isRead: true
  }
];
