import { http } from '../../../lib/http';
import type { AccountCredentials } from '../../../types';
import type { AppSettings } from '../settingsSlice';

export type SettingsPayload = Partial<AppSettings> & {
  credentials?: AccountCredentials;
};

export const settingsApi = {
  getSettings() {
    return http.get<SettingsPayload>('/settings');
  },

  updateSettings(payload: Partial<AppSettings>) {
    return http.patch<SettingsPayload, Partial<AppSettings>>('/settings', payload);
  },

  updateCredentials(payload: Partial<AccountCredentials>) {
    return http.patch<AccountCredentials, Partial<AccountCredentials>>('/account/credentials', payload);
  },

  requestVerification(method: 'photo' | 'social') {
    return http.post<{ isVerified: boolean }, { method: 'photo' | 'social' }>('/account/verification', { method });
  },
};
