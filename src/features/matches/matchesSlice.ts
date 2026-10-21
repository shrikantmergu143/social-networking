import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types';
import { MOCK_USERS } from '../../mocks/users';

export interface MatchesState {
  matches: UserProfile[];
  searchQuery: string;
}

const initialState: MatchesState = {
  // Elena Rostova and Maya Lin start as existing mutual matches
  matches: [MOCK_USERS[0], MOCK_USERS[1]],
  searchQuery: ''
};

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    addMatch: (state, action: PayloadAction<UserProfile>) => {
      if (!state.matches.some(m => m.id === action.payload.id)) {
        state.matches.unshift(action.payload);
      }
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      state.matches = state.matches.filter(m => m.id !== action.payload);
    },
    setMatchSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    }
  }
});

export const { addMatch, removeMatch, setMatchSearchQuery } = matchesSlice.actions;
export default matchesSlice.reducer;
