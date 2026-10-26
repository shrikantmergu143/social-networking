import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types';

export interface ConnectionsState {
  following: UserProfile[];
  followers: UserProfile[];
  pendingRequests: UserProfile[];
  blockedUsers: UserProfile[];
}

const initialState: ConnectionsState = {
  following: [],
  followers: [],
  pendingRequests: [],
  blockedUsers: []
};

export const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    replaceFollowing: (state, action: PayloadAction<UserProfile[]>) => {
      state.following = action.payload;
    },
    replaceFollowers: (state, action: PayloadAction<UserProfile[]>) => {
      state.followers = action.payload;
    },
    replacePendingRequests: (state, action: PayloadAction<UserProfile[]>) => {
      state.pendingRequests = action.payload;
    },
    replaceBlockedUsers: (state, action: PayloadAction<UserProfile[]>) => {
      state.blockedUsers = action.payload;
    },
    toggleFollowUser: (state, action: PayloadAction<UserProfile>) => {
      const user = action.payload;
      const index = state.following.findIndex(u => u.id === user.id);
      if (index >= 0) {
        state.following.splice(index, 1);
      } else {
        state.following.unshift({ ...user, isFollowing: true });
      }
    },
    removeFollower: (state, action: PayloadAction<string>) => {
      state.followers = state.followers.filter?.(u => u.id !== action.payload);
    },
    acceptFollowRequest: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const reqIndex = state.pendingRequests.findIndex(u => u.id === userId);
      if (reqIndex >= 0) {
        const user = state.pendingRequests[reqIndex];
        state.pendingRequests.splice(reqIndex, 1);
        if (!state.followers.some(f => f.id === userId)) {
          state.followers.unshift({ ...user, isFollowing: true });
        }
      }
    },
    declineFollowRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter?.(u => u.id !== action.payload);
    },
    blockUser: (state, action: PayloadAction<UserProfile>) => {
      const user = action.payload;
      state.following = state.following.filter?.(u => u.id !== user.id);
      state.followers = state.followers.filter?.(u => u.id !== user.id);
      state.pendingRequests = state.pendingRequests.filter?.(u => u.id !== user.id);
      if (!state.blockedUsers.some(u => u.id === user.id)) {
        state.blockedUsers.push(user);
      }
    },
    unblockUser: (state, action: PayloadAction<string>) => {
      state.blockedUsers = state.blockedUsers.filter?.(u => u.id !== action.payload);
    }
  }
});

export const {
  toggleFollowUser,
  replaceFollowing,
  replaceFollowers,
  replacePendingRequests,
  replaceBlockedUsers,
  removeFollower,
  acceptFollowRequest,
  declineFollowRequest,
  blockUser,
  unblockUser
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
