import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types';
import { MOCK_USERS } from '../../mocks/users';

export interface ConnectionsState {
  following: UserProfile[];
  followers: UserProfile[];
  pendingRequests: UserProfile[];
  blockedUsers: UserProfile[];
}

const initialState: ConnectionsState = {
  following: MOCK_USERS.filter(u => u.isFollowing),
  followers: [MOCK_USERS[0], MOCK_USERS[1], MOCK_USERS[3], MOCK_USERS[5], MOCK_USERS[12], MOCK_USERS[17]],
  pendingRequests: [MOCK_USERS[4], MOCK_USERS[8]],
  blockedUsers: []
};

export const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
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
      state.followers = state.followers.filter(u => u.id !== action.payload);
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
      state.pendingRequests = state.pendingRequests.filter(u => u.id !== action.payload);
    },
    blockUser: (state, action: PayloadAction<UserProfile>) => {
      const user = action.payload;
      state.following = state.following.filter(u => u.id !== user.id);
      state.followers = state.followers.filter(u => u.id !== user.id);
      state.pendingRequests = state.pendingRequests.filter(u => u.id !== user.id);
      if (!state.blockedUsers.some(u => u.id === user.id)) {
        state.blockedUsers.push(user);
      }
    },
    unblockUser: (state, action: PayloadAction<string>) => {
      state.blockedUsers = state.blockedUsers.filter(u => u.id !== action.payload);
    }
  }
});

export const {
  toggleFollowUser,
  removeFollower,
  acceptFollowRequest,
  declineFollowRequest,
  blockUser,
  unblockUser
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
