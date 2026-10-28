import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types';

export interface MatchesState {
  matches: UserProfile[];
  searchQuery: string;
}

const initialState: MatchesState = {
  matches: [],
  searchQuery: ''
};

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    replaceMatches: (state, action: PayloadAction<UserProfile[]>) => {
      state.matches = action.payload;
    },
    addMatch: (state, action: PayloadAction<UserProfile>) => {
      if (!state.matches.some?.(m => m.id === action.payload.id)) {
        state.matches.unshift(action.payload);
      }
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      state.matches = state.matches.filter?.(m => m.id !== action.payload);
    },
    setMatchSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  }
});

export const { replaceMatches, addMatch, removeMatch, setMatchSearchQuery } = matchesSlice.actions;
export default matchesSlice.reducer;
