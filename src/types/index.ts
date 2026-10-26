export type Gender = 'woman' | 'man' | 'non-binary' | 'other';

export type RelationshipGoal =
  | 'Long-term partner'
  | 'Long-term, open to short'
  | 'Short-term, open to long'
  | 'Short-term fun'
  | 'New friends'
  | 'Still figuring it out';

export interface DatingPreferences {
  genderPreference: Gender[];
  ageRange: [number, number];
  maxDistanceKm: number;
  intentions: RelationshipGoal[];
  verifiedOnly: boolean;
  recentlyActiveOnly: boolean;
  onlineOnly: boolean;
}

export interface Lifestyle {
  drinking?: 'Never' | 'Socially' | 'Frequently';
  smoking?: 'Never' | 'Socially' | 'Regularly';
  exercise?: 'Active' | 'Sometimes' | 'Almost never';
  pets?: string;
  zodiac?: string;
  education?: string;
  occupation?: string;
  languages?: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  age: number;
  birthDate?: string;
  gender: Gender;
  pronouns?: string;
  location: string;
  distanceKm: number;
  bio: string;
  avatar: string;
  coverImage: string;
  photos: string[];
  interests: string[];
  relationshipGoal: RelationshipGoal;
  lifestyle: Lifestyle;
  isVerified: boolean;
  isPrivate?: boolean;
  hasPendingFollowRequest?: boolean;
  isOnline: boolean;
  lastActive: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  mutualFriendsCount?: number;
  isFollowing?: boolean;
  isMatched?: boolean;
  matchPercentage?: number;
  socialLinks?: {
    instagram?: string;
    spotify?: string;
    twitter?: string;
  };
}

export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userVerified: boolean;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  parentCommentId?: string;
  replies?: PostComment[];
}

export interface FeedPost {
  id: string;
  userId: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
    location?: string;
  };
  caption: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
  tags: string[];
  comments: PostComment[];
  visibility: 'public' | 'connections' | 'close_friends';
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  durationSeconds: number;
  caption?: string;
  timestamp: string;
  viewed?: boolean;
}

export interface UserStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isVerified: boolean;
  hasUnseenStories: boolean;
  stories: StoryItem[];
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  participant: UserProfile;
  lastMessage?: ChatMessage;
  unreadCount: number;
  isTyping?: boolean;
  updatedAt: string;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'follow_request' | 'follow_accepted' | 'match' | 'message' | 'superlike' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  actor: {
    id: string;
    name: string;
    avatar: string;
    username: string;
  };
  text: string;
  targetId?: string;
  targetType?: 'post' | 'profile' | 'conversation';
  createdAt: string;
  isRead: boolean;
}

export interface DatingActionRecord {
  profileId: string;
  action: 'like' | 'pass' | 'superlike';
  timestamp: string;
}
export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: Gender;
  password: string;
  confirmPassword: string;
}
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: UserProfile & { email?: string; phoneNumber?: string | null };
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AccountCredentials {
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
}
