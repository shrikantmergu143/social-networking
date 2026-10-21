import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, UserCheck, CheckCircle, Search, Sparkles } from 'lucide-react';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleFollowUser, removeFollower, acceptFollowRequest, declineFollowRequest } from './connectionsSlice';
import { ROUTES } from '../../routes/paths';
import styles from './ConnectionsPage.module.css';

export const ConnectionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { following, followers, pendingRequests } = useAppSelector(state => state.connections);
  const profiles = useAppSelector(state => state.discovery.profiles);

  // Tab: following | followers | requests | suggested
  const currentPath = window.location.pathname;
  const defaultTab = currentPath.includes('followers')
    ? 'followers'
    : currentPath.includes('requests')
    ? 'requests'
    : currentPath.includes('following')
    ? 'following'
    : 'following';

  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'requests' | 'suggested'>(defaultTab);
  const [search, setSearch] = useState('');

  // Suggested = profiles not yet in following and not 'usr_me'
  const suggested = profiles.filter(
    p => p.id !== 'usr_me' && !following.some(f => f.id === p.id)
  );

  const getList = () => {
    let list = activeTab === 'following'
      ? following
      : activeTab === 'followers'
      ? followers
      : activeTab === 'requests'
      ? pendingRequests
      : suggested;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const list = getList();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Users size={24} color="var(--primary)" /> Social Connections
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          Manage your network of friends, creatives, and people you follow on Aura.
        </p>

        {/* Tab navigation */}
        <div className={styles.tabsBar}>
          <button
            className={`${styles.tabItem} ${activeTab === 'following' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following ({following.length})
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'followers' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Followers ({followers.length})
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'requests' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests ({pendingRequests.length})
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'suggested' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('suggested')}
          >
            Explore ({suggested.length})
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, username, or city..."
          style={{
            width: '100%',
            height: 42,
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border)',
            padding: '0 16px',
            fontSize: '0.875rem',
            outline: 'none',
            background: 'var(--surface)',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {list.length > 0 ? (
        <div>
          {list.map(user => {
            const isFollowed = following.some(f => f.id === user.id);
            return (
              <div key={user.id} className={styles.userCard}>
                <Link to={ROUTES.PROFILE(user.id)} className={styles.userMeta}>
                  <AppAvatar
                    src={user.avatar}
                    alt={user.fullName}
                    size={48}
                    isVerified={user.isVerified}
                    isOnline={user.isOnline}
                  />
                  <div>
                    <div className={styles.nameRow}>
                      {user.fullName}
                      {user.isVerified && <CheckCircle size={15} fill="#38bdf8" color="white" />}
                    </div>
                    <div className={styles.subRow}>
                      @{user.username} · {user.location}
                    </div>
                  </div>
                </Link>

                <div style={{ display: 'flex', gap: 8 }}>
                  {activeTab === 'requests' ? (
                    <>
                      <AppButton
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          dispatch(acceptFollowRequest(user.id));
                          message.success(`Accepted follow request from ${user.fullName}`);
                        }}
                      >
                        Accept
                      </AppButton>
                      <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          dispatch(declineFollowRequest(user.id));
                          message.info(`Declined follow request`);
                        }}
                      >
                        Decline
                      </AppButton>
                    </>
                  ) : (
                    <>
                      <AppButton
                        variant={isFollowed ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => {
                          dispatch(toggleFollowUser(user));
                          message.info(isFollowed ? `Unfollowed ${user.fullName}` : `Followed ${user.fullName}`);
                        }}
                        icon={isFollowed ? <UserCheck size={15} /> : <UserPlus size={15} />}
                      >
                        {isFollowed ? 'Following' : 'Follow'}
                      </AppButton>

                      {activeTab === 'followers' && (
                        <AppButton
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            dispatch(removeFollower(user.id));
                            message.info(`Removed follower ${user.fullName}`);
                          }}
                        >
                          Remove
                        </AppButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <AppEmptyState
          icon={<Sparkles size={32} />}
          title="No connections found"
          description={
            search
              ? "No people matched your filter query."
              : activeTab === 'following'
              ? "You aren't following anyone yet. Discover people in suggestions!"
              : "No users in this list right now."
          }
        />
      )}
    </div>
  );
};
