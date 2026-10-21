import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Check } from 'lucide-react';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { unblockUser } from '../connections/connectionsSlice';
import { ROUTES } from '../../routes/paths';

export const BlockedUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const blockedUsers = useAppSelector(state => state.connections.blockedUsers);

  const handleUnblock = (id: string, name: string) => {
    dispatch(unblockUser(id));
    message.success(`Unblocked ${name}`);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <ShieldAlert size={24} color="var(--error)" /> Blocked Accounts
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Blocked members cannot view your profile, see your stories, or message you on Aura.
        </p>
      </div>

      {blockedUsers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {blockedUsers.map(user => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--surface)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AppAvatar src={user.avatar} alt={user.fullName} size={42} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                    {user.fullName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    @{user.username}
                  </div>
                </div>
              </div>

              <AppButton
                variant="outline"
                size="sm"
                onClick={() => handleUnblock(user.id, user.fullName)}
              >
                Unblock
              </AppButton>
            </div>
          ))}
        </div>
      ) : (
        <AppEmptyState
          icon={<Shield size={34} color="var(--success)" />}
          title="No blocked accounts"
          description="Your blocklist is clean. If someone ever bothers you, you can block them from their profile menu."
        />
      )}
    </div>
  );
};
