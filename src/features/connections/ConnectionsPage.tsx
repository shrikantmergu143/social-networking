import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, UserPlus, UserCheck, CheckCircle, Search, Sparkles } from 'lucide-react';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleFollowUser, removeFollower, acceptFollowRequest, declineFollowRequest, replacePendingRequests } from './connectionsSlice';
import { ROUTES } from '../../routes/paths';
import styles from './ConnectionsPage.module.css';
import { socialApi } from '../../lib/social.api';
import { setProfileFollowRequestPending } from '../discovery/discoverySlice';
import { getFollowButtonLabel, isFollowingProfile } from '../../lib/followStatus';

export const ConnectionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { following, followers, pendingRequests } = useAppSelector(state => state.connections);
  const profiles = useAppSelector(state => state.discovery.profiles);

  // Tab: following | followers | requests | suggested
  const currentPath = location.pathname;
  const defaultTab = currentPath.includes('followers')
    ? 'followers'
    : currentPath.includes('requests')
    ? 'requests'
    : currentPath.includes('suggested')
    ? 'suggested'
    : currentPath.includes('following')
    ? 'following'
    : 'following';

  const [activeTab, setActiveTab] = useState<'following' | 'followers' | 'requests' | 'suggested'>(defaultTab);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setActiveTab(currentPath.includes('requests')
      ? 'requests'
      : currentPath.includes('followers')
      ? 'followers'
      : currentPath.includes('suggested')
      ? 'suggested'
      : currentPath.includes('following')
      ? 'following'
      : 'following');
  }, [currentPath]);

  const changeTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    navigate(tab === 'requests'
      ? ROUTES.FOLLOW_REQUESTS
      : tab === 'followers'
      ? ROUTES.FOLLOWERS
      : tab === 'following'
      ? ROUTES.FOLLOWING
      : ROUTES.SUGGESTED_CONNECTIONS);
  };

  // Suggested = profiles not yet in following and not 'usr_me'
  const suggested = profiles.filter?.(
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
      list = list.filter?.(u =>
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
            onClick={() => changeTab('following')}
          >
            Following ({following.length})
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'followers' ? styles.tabActive : ''}`}
            onClick={() => changeTab('followers')}
          >
            Followers ({followers.length})
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'requests' ? styles.tabActive : ''}`}
            onClick={() => changeTab('requests')}
          >
            Requests ({pendingRequests.length})
          </button>
          <button
            className={`${styles.tabItem} ${activeTab === 'suggested' ? styles.tabActive : ''}`}
            onClick={() => changeTab('suggested')}
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
            const isFollowed = isFollowingProfile(user, following);
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
                        onClick={async () => {
                          try {
                            await socialApi.acceptFollowRequest(user.id);
                            dispatch(acceptFollowRequest(user.id));
                            dispatch(replacePendingRequests(await socialApi.getFollowRequests()));
                            message.success(`Accepted follow request from ${user.fullName}`);
                          } catch (error) {
                            message.error(error instanceof Error ? error.message : 'Unable to accept follow request.');
                          }
                        }}
                      >
                        Accept
                      </AppButton>
                      <AppButton
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            await socialApi.declineFollowRequest(user.id);
                            dispatch(declineFollowRequest(user.id));
                            message.info('Declined follow request');
                          } catch (error) {
                            message.error(error instanceof Error ? error.message : 'Unable to decline follow request.');
                          }
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
                        onClick={async () => {
                          try {
                            if (user.hasPendingFollowRequest && !isFollowed) {
                              await socialApi.cancelFollowRequest(user.id);
                              dispatch(setProfileFollowRequestPending({ profileId: user.id, pending: false }));
                              message.info('Follow request cancelled');
                              return;
                            }
                            const result = await socialApi.setFollow(user.id, !isFollowed);
                            if (!result.requestPending) {
                              dispatch(toggleFollowUser(user));
                              message.info(isFollowed ? `Unfollowed ${user.fullName}` : `Followed ${user.fullName}`);
                            } else {
                              dispatch(setProfileFollowRequestPending({ profileId: user.id, pending: true }));
                              message.success(`Follow request sent to ${user.fullName}`);
                            }
                          } catch (error) {
                            message.error(error instanceof Error ? error.message : 'Unable to update follow.');
                          }
                        }}
                        icon={isFollowed ? <UserCheck size={15} /> : <UserPlus size={15} />}
                      >
                        {getFollowButtonLabel(user, isFollowed)}
                      </AppButton>

                      {activeTab === 'followers' && (
                        <AppButton
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await socialApi.removeFollower(user.id);
                              dispatch(removeFollower(user.id));
                              message.info(`Removed follower ${user.fullName}`);
                            } catch (error) {
                              message.error(error instanceof Error ? error.message : 'Unable to remove follower.');
                            }
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
