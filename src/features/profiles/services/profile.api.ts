import { http } from '../../../lib/http';
import type { AxiosProgressEvent } from 'axios';

export interface UploadFileResponse {
  url?: string;
  fileUrl?: string;
  location?: string;
  data?: { url?: string; fileUrl?: string; location?: string };
}

export const profileApi = {
  updateProfile(payload: unknown) {
    return http.patch('/profiles/me', payload);
  },

  uploadFile(file: File, type = 'profile', onUploadProgress?: (event: AxiosProgressEvent) => void) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return http.post<UploadFileResponse, FormData>('/upload', formData, {
      onUploadProgress,
    });
  },
};
