import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile, DatingPreferences, DatingActionRecord } from '../../types';
import { MOCK_USERS } from '../../mocks/users';

export interface DiscoveryState {
  profiles: UserProfile[];
  processedIds: string[];
  actionHistory: DatingActionRecord[];
  savedProfileIds: string[];
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
  profiles: MOCK_USERS,
  processedIds: [],
  actionHistory: [],
  savedProfileIds: ['usr_1', 'usr_2'],
  filters: defaultFilters,
  lastMatchedUser: null,
  showMatchCelebration: false
};

export const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
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

      // Deterministic mutual match scenario:
      // Profiles 'usr_1' (Elena Rostova), 'usr_2' (Maya Lin), and 'usr_18' (Camille Laurent)
      // are mutual match triggers when liked or superliked!
      if (['usr_1', 'usr_2', 'usr_18'].includes(profileId) && (actionType === 'like' || actionType === 'superlike')) {
        const matched = state.profiles.find(p => p.id === profileId);
        if (matched) {
          state.lastMatchedUser = matched;
          state.showMatchCelebration = true;
        }
      }
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
      } else {
        state.savedProfileIds.push(id);
      }
    },
    rewindLastAction: (state) => {
      const last = state.actionHistory.pop();
      if (last) {
        state.processedIds = state.processedIds.filter(id => id !== last.profileId);
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
  dismissMatchCelebration,
  updateFilters,
  resetFilters,
  toggleSaveProfile,
  rewindLastAction,
  resetDiscoveryQueue
} = discoverySlice.actions;

export default discoverySlice.reducer;
