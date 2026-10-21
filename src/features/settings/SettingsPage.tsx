import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Shield,
  Bell,
  Eye,
  Lock,
  Sparkles,
  HelpCircle,
  LogOut,
  ChevronRight,
  CheckCircle,
  Camera,
  Share2
} from 'lucide-react';
import { Switch, App, Input, Modal } from 'antd';
import { AppButton } from '../../components/common/AppButton';
import { AppConfirmDialog } from '../../components/common/AppConfirmDialog';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSettings, requestVerification, saveCredentials, saveSetting, updateSetting } from './settingsSlice';
import { logout, updateCurrentUserProfile } from '../auth/authSlice';
import { ROUTES } from '../../routes/paths';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const settings = useAppSelector(state => state.settings);
  const currentUser = useAppSelector(state => state.auth.currentUser);

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [credentialDraft, setCredentialDraft] = useState({ email: settings?.credentials?.email, phone: settings?.credentials?.phone });

  useEffect(() => { void dispatch(fetchSettings()); }, [dispatch]);
  useEffect(() => {
    setCredentialDraft({ email: settings?.credentials?.email, phone: settings?.credentials?.phone });
  }, [settings?.credentials?.email, settings?.credentials?.phone]);

  const handleToggle = (key: 'isProfileVisible' | 'incognitoMode' | 'showOnlineStatus' | 'pushNotifications' | 'matchAlerts' | 'messageAlerts', value: boolean) => {
    dispatch(updateSetting({ key, value }));
    void dispatch(saveSetting({ key, value })).unwrap()
      .then(() => message.success('Setting updated'))
      .catch((error: string) => message.error(error));
  };

  const handleCredentialsSave = async () => {
    if (!credentialDraft.email.trim() || !credentialDraft.phone.trim()) {
      message.error('Email and phone number are required');
      return;
    }
    try {
      await dispatch(saveCredentials(credentialDraft)).unwrap();
      setCredentialsOpen(false);
      message.success('Account credentials updated');
    } catch (error) { message.error(error as string); }
  };

  const handleVerification = async (method: 'photo' | 'social') => {
    try {
      await dispatch(requestVerification(method)).unwrap();
      dispatch(updateCurrentUserProfile({ isVerified: true }));
      message.success(method === 'photo' ? 'Photo verification successful! You are now verified.' : 'Social accounts connected and profile verified.');
    } catch (error) { message.error(error as string); }
  };

  const handleLogout = () => {
    dispatch(logout());
    message.info('Logged out of Aura');
    navigate(ROUTES.LANDING);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <Settings size={24} color="var(--primary)" /> Account & Settings
      </h1>

      {/* Account Info */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          Account Credentials
        </div>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Email Address</div>
            <div className={styles.settingDesc}>{settings?.credentials?.email} {settings?.credentials?.emailVerified ? '(Verified)' : '(Unverified)'}</div>
          </div>
          <AppButton variant="secondary" size="sm" onClick={() => setCredentialsOpen(true)}>
            Change
          </AppButton>
        </div>

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Phone Number</div>
            <div className={styles.settingDesc}>{settings?.credentials?.phone} {settings?.credentials?.phoneVerified ? '(Verified)' : ''}</div>
          </div>
          <AppButton variant="secondary" size="sm" onClick={() => setCredentialsOpen(true)}>
            Update
          </AppButton>
        </div>
      </div>

      {/* Verification Center */}
      <div className={styles.sectionCard} style={{ background: currentUser?.isVerified ? 'rgba(56, 189, 248, 0.05)' : 'var(--surface)' }}>
        <div className={styles.sectionHeader} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={18} color="#38bdf8" /> Profile Verification
          </span>
          {currentUser?.isVerified && <VerifiedBadge showText={true} size={18} />}
        </div>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>
              {currentUser?.isVerified ? 'Your account is fully verified' : 'Get Verified Badge'}
            </div>
            <div className={styles.settingDesc}>
              {currentUser?.isVerified
                ? 'Verified via Photo Verification & Connected Social Accounts'
                : 'Complete photo verification or connect social media accounts to earn your Verified badge'}
            </div>
          </div>
          {!currentUser?.isVerified ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <AppButton
                variant="primary"
                size="sm"
                icon={<Camera size={14} />}
                onClick={() => void handleVerification('photo')}
              >
                Verify Photo
              </AppButton>
              <AppButton
                variant="secondary"
                size="sm"
                icon={<Share2 size={14} />}
                onClick={() => void handleVerification('social')}
              >
                Connect Socials
              </AppButton>
            </div>
          ) : (
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => {
                dispatch(updateCurrentUserProfile({ isVerified: false }));
                message.info('Verification status reset for testing');
              }}
            >
              Reset Status
            </AppButton>
          )}
        </div>
      </div>

      {/* Privacy & Visibility */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <Eye size={18} color="var(--primary)" /> Privacy & Discovery Visibility
        </div>

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Show in Discovery</div>
            <div className={styles.settingDesc}>Allow other members to discover your profile deck</div>
          </div>
          <Switch
            checked={settings.isProfileVisible}
            onChange={(val) => handleToggle('isProfileVisible', val)}
          />
        </div>

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Incognito Browsing</div>
            <div className={styles.settingDesc}>Only members you like will be able to see your profile</div>
          </div>
          <Switch
            checked={settings.incognitoMode}
            onChange={(val) => handleToggle('incognitoMode', val)}
          />
        </div>

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Show Online Status</div>
            <div className={styles.settingDesc}>Display green active dot when you are on Aura</div>
          </div>
          <Switch
            checked={settings.showOnlineStatus}
            onChange={(val) => handleToggle('showOnlineStatus', val)}
          />
        </div>
      </div>

      {/* Notifications */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <Bell size={18} color="var(--secondary)" /> Notifications
        </div>

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Push Notifications</div>
            <div className={styles.settingDesc}>Receive instant mobile alerts for new activity</div>
          </div>
          <Switch
            checked={settings.pushNotifications}
            onChange={(val) => handleToggle('pushNotifications', val)}
          />
        </div>

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>New Match Alerts</div>
            <div className={styles.settingDesc}>Get notified immediately when a mutual connection happens</div>
          </div>
          <Switch
            checked={settings.matchAlerts}
            onChange={(val) => handleToggle('matchAlerts', val)}
          />
        </div>

        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Direct Message Alerts</div>
            <div className={styles.settingDesc}>Alerts for incoming chat messages</div>
          </div>
          <Switch
            checked={settings.messageAlerts}
            onChange={(val) => handleToggle('messageAlerts', val)}
          />
        </div>
      </div>

      {/* Safety & Moderation Link */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <Shield size={18} color="var(--success)" /> Safety & Blocklist
        </div>

        <div
          className={styles.settingRow}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(ROUTES.BLOCKED_USERS)}
        >
          <div>
            <div className={styles.settingLabel}>Manage Blocked Accounts</div>
            <div className={styles.settingDesc}>View and unblock profiles you previously restricted</div>
          </div>
          <ChevronRight size={18} color="var(--text-tertiary)" />
        </div>
      </div>

      {/* Subscription Tier */}
      <div className={styles.sectionCard} style={{ background: 'var(--gradient-subtle)' }}>
        <div className={styles.sectionHeader}>
          <Sparkles size={18} color="var(--accent)" /> Membership Tier
        </div>
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>
              Current Status: {settings.isPremium ? 'Aura Elite Member' : 'Standard Free Plan'}
            </div>
            <div className={styles.settingDesc}>
              {settings.isPremium
                ? 'All premium filters, unlimited likes, and rewind enabled'
                : 'Upgrade to unlock priority visibility and unlimited likes'}
            </div>
          </div>
          <AppButton
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTES.PREMIUM)}
          >
            {settings.isPremium ? 'Manage' : 'Upgrade'}
          </AppButton>
        </div>
      </div>

      {/* Log out button */}
      <div style={{ marginTop: 28, textAlign: 'center' }}>
        <AppButton
          variant="outline"
          onClick={() => setLogoutConfirmOpen(true)}
          icon={<LogOut size={16} />}
        >
          Sign Out of Account
        </AppButton>
      </div>

      <AppConfirmDialog
        open={logoutConfirmOpen}
        title="Log Out of Aura?"
        description="Are you sure you want to end your current session? You can log right back in with your demo credentials."
        confirmText="Log Out"
        onConfirm={handleLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
      />

      <Modal
        title="Account Credentials"
        open={credentialsOpen}
        okText="Save changes"
        onOk={() => void handleCredentialsSave()}
        onCancel={() => setCredentialsOpen(false)}
        confirmLoading={settings.isSaving}
      >
        <div style={{ display: 'grid', gap: 16, padding: '12px 0' }}>
          <label>
            <span style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Email address</span>
            <Input value={credentialDraft.email} onChange={event => setCredentialDraft({ ...credentialDraft, email: event.target.value })} />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Phone number</span>
            <Input value={credentialDraft.phone} onChange={event => setCredentialDraft({ ...credentialDraft, phone: event.target.value })} />
          </label>
        </div>
      </Modal>
    </div>
  );
};
