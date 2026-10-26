import { http } from './http';
import { unwrapApiResponse } from '../features/feed/feed.api';
import type { AppNotification, ChatMessage, Conversation, DatingPreferences, UserProfile, UserStory } from '../types';

export const socialApi = {
  async searchUsers(query: string) {
    return unwrapApiResponse(await http.get<UserProfile[]>('/users/search', { config: { params: { q: query } } }));
  },
  async getProfile(userId: string) {
    return unwrapApiResponse(await http.get<UserProfile>(`/users/${encodeURIComponent(userId)}`));
  },
  async getFollowing() {
    return unwrapApiResponse(await http.get<UserProfile[]>('/users/me/following'));
  },
  async getFollowers() {
    return unwrapApiResponse(await http.get<UserProfile[]>('/users/me/followers'));
  },
  async getSavedProfiles() {
    return unwrapApiResponse(await http.get<UserProfile[]>('/users/me/saved'));
  },
  async setSavedProfile(userId: string, isSaved: boolean) {
    const response = isSaved
      ? await http.post<{ isSaved: boolean }, Record<string, never>>(`/users/${encodeURIComponent(userId)}/save`, {})
      : await http.delete<{ isSaved: boolean }>(`/users/${encodeURIComponent(userId)}/save`);
    return unwrapApiResponse(response);
  },
  async getBlockedProfiles() {
    return unwrapApiResponse(await http.get<UserProfile[]>('/users/me/blocked'));
  },
  async setBlocked(userId: string, blocked: boolean) {
    const response = blocked
      ? await http.post<{ blocked: boolean }, Record<string, never>>(`/users/${encodeURIComponent(userId)}/block`, {})
      : await http.delete<{ blocked: boolean }>(`/users/${encodeURIComponent(userId)}/block`);
    return unwrapApiResponse(response);
  },
  async reportUser(userId: string, reason: string, details: string) {
    return unwrapApiResponse(await http.post<{ id: string; status: string }, { reason: string; details: string }>(
      `/users/${encodeURIComponent(userId)}/report`,
      { reason, details }
    ));
  },
  async setFollow(userId: string, follow: boolean) {
    const response = follow
      ? await http.post<{ isFollowing: boolean; requestPending: boolean }, Record<string, never>>(`/users/${encodeURIComponent(userId)}/follow`, {})
      : await http.delete<{ isFollowing: boolean; requestPending?: boolean }>(`/users/${encodeURIComponent(userId)}/follow`);
    return unwrapApiResponse(response);
  },
  async getFollowRequests() {
    return unwrapApiResponse(await http.get<UserProfile[]>('/users/me/follow-requests'));
  },
  async acceptFollowRequest(userId: string) {
    return unwrapApiResponse(await http.post<{ accepted: boolean }, Record<string, never>>(`/users/${encodeURIComponent(userId)}/follow-request/accept`, {}));
  },
  async declineFollowRequest(userId: string) {
    return unwrapApiResponse(await http.delete<{ accepted: boolean }>(`/users/${encodeURIComponent(userId)}/follow-request/decline`));
  },
  async cancelFollowRequest(userId: string) {
    return unwrapApiResponse(await http.delete<{ requestPending: boolean }>(`/users/${encodeURIComponent(userId)}/follow-request`));
  },
  async removeFollower(userId: string) {
    return unwrapApiResponse(await http.delete<{ removed: boolean }>(`/users/${encodeURIComponent(userId)}/follower`));
  },
  async getDiscovery() {
    return unwrapApiResponse(await http.get<UserProfile[]>('/dating/discover'));
  },
  async recordDatingAction(profileId: string, action: 'like' | 'pass' | 'superlike') {
    return unwrapApiResponse(await http.post<
      { action: string; matched: boolean },
      { profileId: string; action: 'like' | 'pass' | 'superlike' }
    >('/dating/actions', { profileId, action }));
  },
  async getMatches() {
    return unwrapApiResponse(await http.get<UserProfile[]>('/dating/matches'));
  },
  async removeMatch(userId: string) {
    return unwrapApiResponse(await http.delete<{ removed: boolean }>(`/matches/${encodeURIComponent(userId)}`));
  },
  async getPreferences() {
    return unwrapApiResponse(await http.get<DatingPreferences>('/preferences'));
  },
  async updatePreferences(preferences: DatingPreferences) {
    return unwrapApiResponse(await http.patch<DatingPreferences, DatingPreferences>('/preferences', preferences));
  },
  async getStories() {
    return unwrapApiResponse(await http.get<UserStory[]>('/stories'));
  },
  async createStory(payload: { mediaUrl: string; mediaType: 'image' | 'video'; caption?: string }) {
    return unwrapApiResponse(await http.post('/stories', payload));
  },
  async markStoryViewed(itemId: string) {
    return unwrapApiResponse(await http.post<{ viewed: boolean }, Record<string, never>>(`/stories/${encodeURIComponent(itemId)}/view`, {}));
  },
  async getConversations() {
    return unwrapApiResponse(await http.get<Conversation[]>('/conversations'));
  },
  async openConversation(userId: string) {
    return unwrapApiResponse(await http.post<{ id: string }, Record<string, never>>(`/conversations/${encodeURIComponent(userId)}`, {}));
  },
  async getMessages(conversationId: string) {
    return unwrapApiResponse(await http.get<ChatMessage[]>(`/messages/${encodeURIComponent(conversationId)}`));
  },
  async sendMessage(conversationId: string, payload: { text: string; imageUrl?: string }) {
    return unwrapApiResponse(await http.post<ChatMessage, typeof payload>(`/messages/${encodeURIComponent(conversationId)}`, payload));
  },
  async getNotifications() {
    return unwrapApiResponse(await http.get<AppNotification[]>('/notifications'));
  },
  async markNotificationRead(notificationId: string) {
    return unwrapApiResponse(await http.patch<{ isRead: boolean }, Record<string, never>>(`/notifications/${encodeURIComponent(notificationId)}/read`, {}));
  },
  async markAllNotificationsRead() {
    return unwrapApiResponse(await http.patch<{ updated: boolean }, Record<string, never>>('/notifications/read-all', {}));
  },
};
