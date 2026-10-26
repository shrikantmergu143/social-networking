import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile, DatingPreferences, DatingActionRecord } from '../../types';

export interface DiscoveryState {
  profiles: UserProfile[];
  processedIds: string[];
  actionHistory: DatingActionRecord[];
  savedProfileIds: string[];
  savedProfiles: UserProfile[];
  filters: DatingPreferences;
  lastMatchedUser: UserProfile | null;
  showMatchCelebration: boolean;
}

const defaultFilters: DatingPreferences = {
  genderPreference: ['woman', 'man', 'non-binary'],
  ageRange: [21, 35],
  maxDistanceKm: 25,
  intentions: [
    'Long-term partner',
    'Long-term, open to short',
    'Short-term, open to long',
    'New friends'
  ],
  verifiedOnly: false,
  recentlyActiveOnly: false,
  onlineOnly: false
};

const initialState: DiscoveryState = {
  profiles: [],
  processedIds: [],
  actionHistory: [],
  savedProfileIds: [],
  savedProfiles: [],
  filters: defaultFilters,
  lastMatchedUser: null,
  showMatchCelebration: false
};

export const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    replaceProfiles: (state, action: PayloadAction<UserProfile[]>) => {
      state.profiles = action.payload;
    },
    setProfileFollowRequestPending: (state, action: PayloadAction<{ profileId: string; pending: boolean }>) => {
      const profile = state.profiles.find(item => item.id === action.payload.profileId);
      if (profile) profile.hasPendingFollowRequest = action.payload.pending;
    },
    replaceSavedProfiles: (state, action: PayloadAction<UserProfile[]>) => {
      state.savedProfileIds = action.payload.map(profile => profile.id);
      state.savedProfiles = action.payload;
    },
    replaceDiscoveryFilters: (state, action: PayloadAction<DatingPreferences>) => {
      state.filters = action.payload;
    },
    showMatchedProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.lastMatchedUser = action.payload;
      state.showMatchCelebration = Boolean(action.payload);
    },
    recordSwipe: (
      state,
      action: PayloadAction<{ profileId: string; actionType: 'like' | 'pass' | 'superlike' }>
    ) => {
      const { profileId, actionType } = action.payload;
      if (!state.processedIds.includes(profileId)) {
        state.processedIds.push(profileId);
      }
      state.actionHistory.push({
        profileId,
        action: actionType,
        timestamp: new Date().toISOString()
      });

    },
    dismissMatchCelebration: (state) => {
      state.showMatchCelebration = false;
      state.lastMatchedUser = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<DatingPreferences>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = defaultFilters;
    },
    toggleSaveProfile: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.savedProfileIds.indexOf(id);
      if (idx >= 0) {
        state.savedProfileIds.splice(idx, 1);
        state.savedProfiles = state.savedProfiles.filter?.(profile => profile.id !== id);
      } else {
        state.savedProfileIds.push(id);
        const profile = state.profiles.find(item => item.id === id);
        if (profile && !state.savedProfiles.some(item => item.id === id)) {
          state.savedProfiles.unshift(profile);
        }
      }
    },
    rewindLastAction: (state) => {
      const last = state.actionHistory.pop();
      if (last) {
        state.processedIds = state.processedIds.filter?.(id => id !== last.profileId);
      }
    },
    resetDiscoveryQueue: (state) => {
      state.processedIds = [];
      state.actionHistory = [];
    }
  }
});

export const {
  recordSwipe,
  replaceProfiles,
  setProfileFollowRequestPending,
  replaceSavedProfiles,
  replaceDiscoveryFilters,
  showMatchedProfile,
  dismissMatchCelebration,
  updateFilters,
  resetFilters,
  toggleSaveProfile,
  rewindLastAction,
  resetDiscoveryQueue
} = discoverySlice.actions;

export default discoverySlice.reducer;
