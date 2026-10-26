import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, CheckCircle, Trash2 } from 'lucide-react';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { PostCard } from '../feed/PostCard';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleSaveProfile } from '../discovery/discoverySlice';
import { ROUTES } from '../../routes/paths';
import styles from './BookmarksPage.module.css';
import { socialApi } from '../../lib/social.api';

export const BookmarksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'posts' | 'profiles'>('posts');

  const { posts, savedPostIds } = useAppSelector(state => state.feed);
  const { savedProfiles, savedProfileIds } = useAppSelector(state => state.discovery);

  const savedPosts = posts.filter?.(p => savedPostIds.includes(p.id));
  const profilesToShow = savedProfiles.filter?.(profile => savedProfileIds.includes(profile.id));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Bookmark size={24} fill="var(--secondary)" color="var(--secondary)" />
          Saved Bookmarks
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Quick access to inspiration, favorite posts, and bookmarked profiles.
        </p>
      </div>

      <div className={styles.tabRow}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'posts' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Saved Posts ({savedPosts.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'profiles' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('profiles')}
        >
          Bookmarked Profiles ({savedProfiles.length})
        </button>
      </div>

      {activeTab === 'posts' ? (
        savedPosts.length > 0 ? (
          <div>
            {savedPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <AppEmptyState
            icon={<Bookmark size={32} />}
            title="No saved posts yet"
            description="Tap the bookmark icon on any post in the feed to save it for later."
          />
        )
      ) : (
        profilesToShow.length > 0 ? (
          <div className={styles.profilesGrid}>
            {profilesToShow.map(profile => (
              <div key={profile.id} className={styles.savedProfileCard}>
                <Link
                  to={ROUTES.PROFILE(profile.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}
                >
                  <AppAvatar
                    src={profile.avatar}
                    alt={profile.fullName}
                    size={46}
                    isVerified={profile.isVerified}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {profile.fullName}, {profile.age}
                      {profile.isVerified && <CheckCircle size={14} fill="#38bdf8" color="white" />}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {profile.location}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={async () => {
                    try {
                      await socialApi.setSavedProfile(profile.id, false);
                      dispatch(toggleSaveProfile(profile.id));
                      message.info('Removed from bookmarks');
                    } catch (error) {
                      message.error(error instanceof Error ? error.message : 'Unable to remove bookmark.');
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 6 }}
                  title="Remove bookmark"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <AppEmptyState
            icon={<Bookmark size={32} />}
            title="No bookmarked profiles"
            description="Save profiles while exploring Discovery to revisit them anytime."
          />
        )
      )}
    </div>
  );
};
