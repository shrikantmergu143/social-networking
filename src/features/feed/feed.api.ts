import { http, type ApiResponse } from '../../lib/http';
import type { FeedPost, PostComment } from '../../types';

export interface PostPayload {
  caption: string;
  images: string[];
  tags: string[];
  visibility: FeedPost['visibility'];
}

export interface PostCommentPayload {
  postId: string;
  text: string;
  parentCommentId?: string;
}

export interface PostLikeResponse {
  isLiked: boolean;
  likesCount: number;
}

export interface PostSaveResponse {
  isSaved: boolean;
}

export interface CommentLikeResponse {
  isLiked: boolean;
  likesCount: number;
}

export interface SavedPostsPage {
  status: number;
  message: string;
  data: FeedPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type FeedPostsPage = SavedPostsPage;

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.status || response.data === null) {
    throw new Error(response.error?.message || 'The request could not be completed.');
  }
  return response.data;
}

export const feedApi = {
  async getPosts(page = 1, limit = 10, search = '') {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search.trim() ? { search: search.trim() } : {}),
    });
    const response = await http.get<FeedPostsPage>(`/posts?${query.toString()}`);
    if (!response.status || response.data === null) {
      throw new Error(response.error?.message || 'The request could not be completed.');
    }
    return response.data;
  },

  async getSavedPosts(page: number, limit: number) {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await http.get<SavedPostsPage>(
      `/posts/saved/posts?${query.toString()}`
    );
    if (!response.status || response.data === null) {
      throw new Error(response.error?.message || 'The request could not be completed.');
    }
    return response.data;
  },

  async getMyPosts() {
    return unwrapApiResponse(await http.get<FeedPost[]>('/posts/me'));
  },

  async createPost(payload: PostPayload) {
    return unwrapApiResponse(await http.post<FeedPost, PostPayload>('/posts', payload));
  },

  async updatePost(postId: string, payload: PostPayload) {
    return unwrapApiResponse(
      await http.patch<FeedPost, PostPayload>(`/posts/${encodeURIComponent(postId)}`, payload)
    );
  },

  async deletePost(postId: string) {
    return unwrapApiResponse(await http.delete<{ deleted: boolean }>(`/posts/${encodeURIComponent(postId)}`));
  },

  async setPostLike(postId: string, isLiked: boolean) {
    return unwrapApiResponse(
      await http.put<PostLikeResponse, { isLiked: boolean }>(
        `/posts/${encodeURIComponent(postId)}/like`,
        { isLiked }
      )
    );
  },

  async setPostSaved(postId: string, isSaved: boolean) {
    return unwrapApiResponse(
      await http.put<PostSaveResponse, { isSaved: boolean }>(
        `/posts/${encodeURIComponent(postId)}/save`,
        { isSaved }
      )
    );
  },

  async createComment(payload: PostCommentPayload) {
    return unwrapApiResponse(
      await http.post<PostComment, PostCommentPayload>('/comments', payload)
    );
  },

  async setCommentLike(commentId: string, isLiked: boolean) {
    return unwrapApiResponse(
      await http.put<CommentLikeResponse, { isLiked: boolean }>(
        `/comments/${encodeURIComponent(commentId)}/like`,
        { isLiked }
      )
    );
  },
};
