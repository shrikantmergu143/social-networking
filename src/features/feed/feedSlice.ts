import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FeedPost, PostComment } from '../../types';
import { MOCK_POSTS } from '../../mocks/posts';

export interface FeedState {
  posts: FeedPost[];
  savedPostIds: string[];
  isLoading: boolean;
  activeFilter: 'all' | 'following' | 'trending';
}

const initialState: FeedState = {
  posts: MOCK_POSTS,
  savedPostIds: ['post_1', 'post_5', 'post_6', 'post_8', 'post_10', 'post_12', 'post_16', 'post_18', 'post_19', 'post_20'],
  isLoading: false,
  activeFilter: 'all'
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    toggleLikePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(p => p.id === action.payload);
      if (post) {
        if (post.isLiked) {
          post.isLiked = false;
          post.likesCount = Math.max(0, post.likesCount - 1);
        } else {
          post.isLiked = true;
          post.likesCount += 1;
        }
      }
    },
    toggleSavePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const post = state.posts.find(p => p.id === postId);
      const existsIndex = state.savedPostIds.indexOf(postId);

      if (existsIndex >= 0) {
        state.savedPostIds.splice(existsIndex, 1);
        if (post) post.isSaved = false;
      } else {
        state.savedPostIds.unshift(postId);
        if (post) post.isSaved = true;
      }
    },
    addComment: (
      state,
      action: PayloadAction<{ postId: string; comment: PostComment }>
    ) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.comments.push(action.payload.comment);
        post.commentsCount += 1;
      }
    },
    createPost: (state, action: PayloadAction<FeedPost>) => {
      state.posts.unshift(action.payload);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
      state.savedPostIds = state.savedPostIds.filter(id => id !== action.payload);
    },
    setFeedFilter: (state, action: PayloadAction<'all' | 'following' | 'trending'>) => {
      state.activeFilter = action.payload;
    }
  }
});

export const {
  toggleLikePost,
  toggleSavePost,
  addComment,
  createPost,
  deletePost,
  setFeedFilter
} = feedSlice.actions;

export default feedSlice.reducer;
