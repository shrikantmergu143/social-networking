import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserStory, StoryItem } from '../../types';
import { MOCK_STORIES } from '../../mocks/stories';

export interface StoriesState {
  stories: UserStory[];
  viewedStoryIds: string[];
}

const initialState: StoriesState = {
  stories: MOCK_STORIES,
  viewedStoryIds: ['st_me_1', 'st_5_1', 'st_7_1', 'st_10_1']
};

export const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    markStoryAsViewed: (state, action: PayloadAction<string>) => {
      const storyItemId = action.payload;
      if (!state.viewedStoryIds.includes(storyItemId)) {
        state.viewedStoryIds.push(storyItemId);
      }
      // Update hasUnseenStories if all stories of that user are viewed
      state.stories.forEach(userStory => {
        const hasUnseen = userStory.stories.some(st => !state.viewedStoryIds.includes(st.id));
        userStory.hasUnseenStories = hasUnseen;
      });
    },
    addUserStory: (state, action: PayloadAction<StoryItem>) => {
      const myStory = state.stories.find(s => s.userId === 'usr_me');
      if (myStory) {
        myStory.stories.unshift(action.payload);
      } else {
        state.stories.unshift({
          id: 'story_me',
          userId: 'usr_me',
          userName: 'Your Story',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          isVerified: true,
          hasUnseenStories: false,
          stories: [action.payload]
        });
      }
    }
  }
});

export const { markStoryAsViewed, addUserStory } = storiesSlice.actions;
export default storiesSlice.reducer;
