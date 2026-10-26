
// src/lib/api.ts
import axios from 'axios';
import { store } from '@/app/store';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL
    || 'http://localhost:3000/api',
  timeout: 15000,
});

api.interceptors.request.use((config: any) => {
  const token = store.getState().auth.authToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});