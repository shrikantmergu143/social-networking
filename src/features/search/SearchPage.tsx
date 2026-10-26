import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, X, CheckCircle, Sparkles, Hash, Users, FileText } from 'lucide-react';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { PostCard } from '../feed/PostCard';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector, useDebounce } from '../../hooks';
import { toggleFollowUser } from '../connections/connectionsSlice';
import { ROUTES } from '../../routes/paths';
import styles from './SearchPage.module.css';
import { socialApi } from '../../lib/social.api';
import { message } from '../../app/notification';
import type { UserProfile } from '../../types';
import { setProfileFollowRequestPending } from '../discovery/discoverySlice';
import { getFollowButtonLabel, isFollowingProfile } from '../../lib/followStatus';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialQuery = searchParams.get('q') || searchParams.get('tag') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'posts' | 'tags'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Elena', 'Ceramics', 'DesignSystems', 'Maya Lin', 'Sourdough'
  ]);
  const [matchedUsers, setMatchedUsers] = useState<UserProfile[]>([]);

  const debouncedQuery = useDebounce(query, 250);

  const posts = useAppSelector(state => state.feed.posts);
  const following = useAppSelector(state => state.connections.following);

  // Sync url param
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchParams({ q: debouncedQuery.trim() });
    } else {
      setSearchParams({});
    }
  }, [debouncedQuery, setSearchParams]);

  const q = debouncedQuery.toLowerCase().trim();

  // Search Results
  useEffect(() => {
    if (q.length < 2) {
      setMatchedUsers([]);
      return;
    }
    let active = true;
    socialApi.searchUsers(q)
      .then(users => { if (active) setMatchedUsers(users); })
      .catch(error => { if (active) message.error(error instanceof Error ? error.message : 'Unable to search people.'); });
    return () => { active = false; };
  }, [q]);

  const matchedPosts = q
    ? posts.filter?.(p =>
        p.caption.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    : [];

  const matchedTags = q
    ? [...new Set(posts.flatMap(post => post.tags))]
        .filter?.(t => t.toLowerCase().includes(q))
    : [];

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchHeader}>
        <div className={styles.searchBarWrapper}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, bios, posts, and tags..."
            className={styles.searchInput}
            autoFocus
          />
          {query && (
            <button
              className={styles.clearBtn}
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tab filters */}
        <div className={styles.tabsRow}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'people' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('people')}
          >
            People ({matchedUsers.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'posts' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts ({matchedPosts.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'tags' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('tags')}
          >
            Tags ({matchedTags.length})
          </button>
        </div>
      </div>

      {/* If empty query, show recent searches & suggested tags */}
      {!q ? (
        <div>
          {recentSearches.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Recent Searches
                </span>
                <button
                  onClick={handleClearHistory}
                  style={{ fontSize: '0.75rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear history
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {recentSearches.map(item => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      fontSize: '0.8125rem',
                      color: 'var(--text-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
              Explore Passions
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['FilmPhotography', 'Ceramics', 'NaturalWine', 'Design', 'Architecture', 'Sourdough', 'AmbientMusic', 'TrailRunning', 'Astronomy'].map(t => (
                <button
                  key={t}
                  onClick={() => setQuery(t)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--surface-subtle)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Results Section */
        <div>
          {/* People Results */}
          {(activeTab === 'all' || activeTab === 'people') && matchedUsers.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase' }}>
                People
              </div>
              {matchedUsers.map(user => {
                const isFollowed = isFollowingProfile(user, following);
                return (
                  <div key={user.id} className={styles.userCard}>
                    <Link to={ROUTES.PROFILE(user.id)} className={styles.userLeft}>
                      <AppAvatar
                        src={user.avatar}
                        alt={user.fullName}
                        size={44}
                        isVerified={user.isVerified}
                      />
                      <div>
                        <div className={styles.userName}>
                          {user.fullName}
                          {user.isVerified && <CheckCircle size={14} fill="#38bdf8" color="white" />}
                        </div>
                        <div className={styles.userSub}>
                          @{user.username} · {user.location}
                        </div>
                      </div>
                    </Link>

                    <AppButton
                      variant={isFollowed ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={async () => {
                        try {
                          if (user.hasPendingFollowRequest && !isFollowed) {
                            await socialApi.cancelFollowRequest(user.id);
                            dispatch(setProfileFollowRequestPending({ profileId: user.id, pending: false }));
                            setMatchedUsers(current => current.map(profile => profile.id === user.id
                              ? { ...profile, hasPendingFollowRequest: false }
                              : profile));
                            message.info('Follow request cancelled');
                            return;
                          }
                          const result = await socialApi.setFollow(user.id, !isFollowed);
                          if (result.requestPending) {
                            dispatch(setProfileFollowRequestPending({ profileId: user.id, pending: true }));
                            message.success(`Follow request sent to ${user.fullName}`);
                            setMatchedUsers(current => current.map(profile => profile.id === user.id
                              ? { ...profile, hasPendingFollowRequest: true }
                              : profile));
                            return;
                          }
                          dispatch(toggleFollowUser(user));
                          message.info(isFollowed ? `Unfollowed ${user.fullName}` : `Followed ${user.fullName}`);
                        } catch (error) {
                          message.error(error instanceof Error ? error.message : 'Unable to update follow.');
                        }
                      }}
                    >
                      {getFollowButtonLabel(user, isFollowed)}
                    </AppButton>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tag Results */}
          {(activeTab === 'all' || activeTab === 'tags') && matchedTags.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase' }}>
                Hashtags
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {matchedTags.map(tag => (
                  <span
                    key={tag}
                    onClick={() => setQuery(tag)}
                    style={{
                      padding: '8px 16px',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.875rem'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Posts Results */}
          {(activeTab === 'all' || activeTab === 'posts') && matchedPosts.length > 0 && (
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase' }}>
                Posts ({matchedPosts.length})
              </div>
              {matchedPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* No results */}
          {matchedUsers.length === 0 && matchedPosts.length === 0 && matchedTags.length === 0 && (
            <AppEmptyState
              icon={<Search size={32} />}
              title={`No results for "${query}"`}
              description="Check your spelling or try searching for another hobby, username, or tag."
            />
          )}
        </div>
      )}
    </div>
  );
};
