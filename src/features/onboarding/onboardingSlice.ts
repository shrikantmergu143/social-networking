import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Gender, RelationshipGoal } from '../../types';

export interface OnboardingData {
  step: number;
  fullName: string;
  birthDate: string;
  gender: Gender;
  pronouns: string;
  location: string;
  bio: string;
  interests: string[];
  relationshipGoal: RelationshipGoal;
  ageRange: [number, number];
  maxDistanceKm: number;
  photos: string[];
  isCompleted: boolean;
}

const initialState: OnboardingData = {
  step: 1,
  fullName: '',
  birthDate: '',
  gender: 'woman',
  pronouns: '',
  location: 'San Francisco, CA',
  bio: '',
  interests: ['Coffee', 'Music', 'Design'],
  relationshipGoal: 'Long-term partner',
  ageRange: [22, 34],
  maxDistanceKm: 25,
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  ],
  isCompleted: false
};

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    updateOnboardingData: (state, action: PayloadAction<Partial<OnboardingData>>) => {
      return { ...state, ...action.payload };
    },
    completeOnboarding: (state) => {
      state.isCompleted = true;
      state.step = 5;
    },
    resetOnboarding: () => initialState
  }
});

export const {
  setOnboardingStep,
  updateOnboardingData,
  completeOnboarding,
  resetOnboarding
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
