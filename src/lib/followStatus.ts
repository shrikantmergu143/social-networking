import type { UserProfile } from '../types';

export const isFollowingProfile = (_profile: UserProfile, followedProfiles: UserProfile[]) =>
  followedProfiles.some(followed => followed.id === _profile.id);

export const getFollowButtonLabel = (profile: UserProfile, isFollowing: boolean) =>
  isFollowing ? 'Following' : profile.hasPendingFollowRequest ? 'Cancel Request' : 'Follow';
