import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FeedPost, PostComment } from '../../types';

export interface FeedState {
  posts: FeedPost[];
  profilePosts: FeedPost[];
  savedPostIds: string[];
  isLoading: boolean;
  activeFilter: 'all' | 'following' | 'trending';
}

const initialState: FeedState = {
  posts: [],
  profilePosts: [],
  savedPostIds: [],
  isLoading: false,
  activeFilter: 'all'
};

const cloneComment = (comment: PostComment): PostComment => ({
  ...comment,
  replies: comment.replies?.map(cloneComment),
});

const clonePost = (post: FeedPost): FeedPost => ({
  ...post,
  author: { ...post.author },
  images: [...post.images],
  tags: [...post.tags],
  comments: post.comments.map(cloneComment),
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    toggleLikePost: (state, action: PayloadAction<string>) => {
      for (const post of [
        state.posts.find(item => item.id === action.payload),
        state.profilePosts.find(item => item.id === action.payload),
      ]) {
        if (post) {
          post.isLiked = !post.isLiked;
          post.likesCount = Math.max(0, post.likesCount + (post.isLiked ? 1 : -1));
        }
      }
    },
    toggleSavePost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const post = state.posts.find(p => p.id === postId);
      const profilePost = state.profilePosts.find(p => p.id === postId);
      const existsIndex = state.savedPostIds.indexOf(postId);

      if (existsIndex >= 0) {
        state.savedPostIds.splice(existsIndex, 1);
        if (post) post.isSaved = false;
        if (profilePost) profilePost.isSaved = false;
      } else {
        state.savedPostIds.unshift(postId);
        if (post) post.isSaved = true;
        if (profilePost) profilePost.isSaved = true;
      }
    },
    addComment: (
      state,
      action: PayloadAction<{ postId: string; comment: PostComment }>
    ) => {
      for (const post of [
        state.posts.find(item => item.id === action.payload.postId),
        state.profilePosts.find(item => item.id === action.payload.postId),
      ]) {
        if (!post) continue;
        if (action.payload.comment.parentCommentId) {
          const parent = post.comments.find(
            comment => comment.id === action.payload.comment.parentCommentId
          );
          if (parent) {
            parent.replies = [...(parent.replies || []), cloneComment(action.payload.comment)];
          } else {
            post.comments.push(cloneComment(action.payload.comment));
          }
        } else {
          post.comments.push(cloneComment(action.payload.comment));
        }
        post.commentsCount += 1;
      }
    },
    setCommentLike: (
      state,
      action: PayloadAction<{ postId: string; commentId: string; isLiked: boolean; likesCount: number }>
    ) => {
      for (const post of [
        state.posts.find(item => item.id === action.payload.postId),
        state.profilePosts.find(item => item.id === action.payload.postId),
      ]) {
        if (!post) continue;
        const update = (comments: PostComment[]): boolean => {
          for (const comment of comments) {
            if (comment.id === action.payload.commentId) {
              comment.isLiked = action.payload.isLiked;
              comment.likesCount = action.payload.likesCount;
              return true;
            }
            if (comment.replies && update(comment.replies)) return true;
          }
          return false;
        };
        update(post.comments);
      }
    },
    createPost: (state, action: PayloadAction<FeedPost>) => {
      state.posts.unshift(action.payload);
      state.profilePosts.unshift(clonePost(action.payload));
    },
    updatePost: (state, action: PayloadAction<FeedPost>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index >= 0) state.posts[index] = action.payload;
      const profileIndex = state.profilePosts.findIndex(post => post.id === action.payload.id);
      if (profileIndex >= 0) state.profilePosts[profileIndex] = clonePost(action.payload);
    },
    replaceProfilePosts: (state, action: PayloadAction<FeedPost[]>) => {
      state.profilePosts = action.payload;
    },
    replacePosts: (state, action: PayloadAction<FeedPost[]>) => {
      state.posts = action.payload;
      state.savedPostIds = action.payload.filter?.(post => post.isSaved).map(post => post.id);
    },
    setPostLikeState: (
      state,
      action: PayloadAction<{ postId: string; isLiked: boolean; likesCount: number }>
    ) => {
      const post = state.posts.find(item => item.id === action.payload.postId);
      const profilePost = state.profilePosts.find(item => item.id === action.payload.postId);
      if (post) {
        post.isLiked = action.payload.isLiked;
        post.likesCount = action.payload.likesCount;
      }
      if (profilePost) {
        profilePost.isLiked = action.payload.isLiked;
        profilePost.likesCount = action.payload.likesCount;
      }
    },
    setPostSavedState: (
      state,
      action: PayloadAction<{ postId: string; isSaved: boolean }>
    ) => {
      const { postId, isSaved } = action.payload;
      const post = state.posts.find(item => item.id === postId);
      const profilePost = state.profilePosts.find(item => item.id === postId);
      if (post) post.isSaved = isSaved;
      if (profilePost) profilePost.isSaved = isSaved;

      state.savedPostIds = state.savedPostIds.filter?.(id => id !== postId);
      if (isSaved) state.savedPostIds.unshift(postId);
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter?.(p => p.id !== action.payload);
      state.profilePosts = state.profilePosts.filter?.(p => p.id !== action.payload);
      state.savedPostIds = state.savedPostIds.filter?.(id => id !== action.payload);
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
  setCommentLike,
  createPost,
  updatePost,
  replacePosts,
  replaceProfilePosts,
  setPostLikeState,
  setPostSavedState,
  deletePost,
  setFeedFilter
} = feedSlice.actions;

export default feedSlice.reducer;
