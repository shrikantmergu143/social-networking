import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AccountCredentials } from '../../types';
import { settingsApi, type SettingsPayload } from './services/settings.api';

export interface AppSettings {
  isProfileVisible: boolean;
  incognitoMode: boolean;
  showOnlineStatus: boolean;
  showDistance: boolean;
  showAge: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  matchAlerts: boolean;
  messageAlerts: boolean;
  isPremium: boolean;
  premiumTier: 'none' | 'aura_plus' | 'aura_elite';
  theme: 'light' | 'dark' | 'system';
}

export interface SettingsState extends AppSettings {
  credentials: AccountCredentials;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  isProfileVisible: true,
  incognitoMode: false,
  showOnlineStatus: true,
  showDistance: true,
  showAge: true,
  pushNotifications: true,
  emailNotifications: false,
  matchAlerts: true,
  messageAlerts: true,
  isPremium: false,
  premiumTier: 'none',
  theme: 'light',
  credentials: {
    email: 'alexmorgan@example.com',
    phone: '+1 (555) 438-9201',
    emailVerified: true,
    phoneVerified: false,
  },
  isLoading: false,
  isSaving: false,
  error: null,
};

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  const response = await settingsApi.getSettings();
  return response.status && response.data ? response.data : rejectWithValue(response.error?.message || 'Unable to load settings.');
});

export const saveSetting = createAsyncThunk(
  'settings/saveSetting',
  async ({ key, value }: { key: keyof AppSettings; value: AppSettings[keyof AppSettings] }, { rejectWithValue }) => {
    const response = await settingsApi.updateSettings({ [key]: value });
    return response.status ? { key, value } : rejectWithValue(response.error?.message || 'Unable to save setting.');
  }
);

export const saveCredentials = createAsyncThunk(
  'settings/saveCredentials',
  async (payload: Partial<AccountCredentials>, { rejectWithValue }) => {
    const response = await settingsApi.updateCredentials(payload);
    return response.status && response.data ? response.data : rejectWithValue(response.error?.message || 'Unable to update credentials.');
  }
);

export const requestVerification = createAsyncThunk(
  'settings/requestVerification',
  async (method: 'photo' | 'social', { rejectWithValue }) => {
    const response = await settingsApi.requestVerification(method);
    return response.status && response.data ? response.data : rejectWithValue(response.error?.message || 'Unable to start verification.');
  }
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting: <K extends keyof AppSettings>(
      state: SettingsState,
      action: PayloadAction<{ key: K; value: AppSettings[K] }>
    ) => {
      state[action.payload.key] = action.payload.value;
    },
    upgradePremium: (state, action: PayloadAction<'aura_plus' | 'aura_elite'>) => {
      state.isPremium = true;
      state.premiumTier = action.payload;
    },
    cancelPremium: (state) => {
      state.isPremium = false;
      state.premiumTier = 'none';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSettings.pending, state => { state.isLoading = true; state.error = null; })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<SettingsPayload>) => {
        Object.assign(state, action.payload);
        state.isLoading = false;
      })
      .addCase(fetchSettings.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string || action.error.message || null; })
      .addCase(saveSetting.pending, state => { state.isSaving = true; state.error = null; })
      .addCase(saveSetting.fulfilled, (state, action) => {
        state[action.payload.key as keyof AppSettings] = action.payload.value as never;
        state.isSaving = false;
      })
      .addCase(saveSetting.rejected, (state, action) => { state.isSaving = false; state.error = action.payload as string || action.error.message || null; })
      .addCase(saveCredentials.fulfilled, (state, action: PayloadAction<AccountCredentials>) => { state.credentials = action.payload; })
      .addCase(requestVerification.fulfilled, state => { state.error = null; });
  }
});

export const { updateSetting, upgradePremium, cancelPremium } = settingsSlice.actions;
export default settingsSlice.reducer;
