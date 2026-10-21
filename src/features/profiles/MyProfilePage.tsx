import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit3, Settings, MapPin, Sparkles, CheckCircle, Plus } from 'lucide-react';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { PostCard } from '../feed/PostCard';
import { EditProfileDrawer } from './EditProfileDrawer';
import { useAppSelector } from '../../hooks';
import { ROUTES } from '../../routes/paths';
import styles from './ProfilePage.module.css';

export const MyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const posts = useAppSelector(state => state.feed.posts);
  const following = useAppSelector(state => state.connections.following);
  const followers = useAppSelector(state => state.connections.followers);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  if (!currentUser) return null;

  const myPosts = posts.filter(p => p.userId === currentUser?.id);

  return (
    <div className={styles.profileContainer}>
      <div className={styles.coverCard}>
        <img
          src={currentUser?.coverImage || currentUser?.photos?.[0]}
          alt="My Cover"
          className={styles.coverImage}
        />
        <div className={styles.headerBar}>
          <div className={styles.avatarFloating}>
            <AppAvatar
              src={currentUser?.avatar}
              alt={currentUser?.fullName}
              size={96}
              isVerified={currentUser?.isVerified}
            />
          </div>

          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.profileTitle}>
                {currentUser?.fullName}, {currentUser?.age}
                {currentUser?.isVerified && (
                  <CheckCircle size={22} fill="#38bdf8" color="white" />
                )}
              </h1>
              <div className={styles.subMeta}>
                <span>@{currentUser?.username}</span>
                <span>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} /> {currentUser?.location}
                </span>
                {currentUser?.pronouns && (
                  <>
                    <span>·</span>
                    <span>{currentUser?.pronouns}</span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.actionRow}>
              <AppButton
                variant="primary"
                size="sm"
                onClick={() => setEditDrawerOpen(true)}
                icon={<Edit3 size={16} />}
              >
                Edit Profile
              </AppButton>
              <AppButton
                variant="secondary"
                size="sm"
                onClick={() => navigate(ROUTES.SETTINGS)}
                icon={<Settings size={16} />}
              >
                Settings
              </AppButton>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, paddingTop: 8, borderTop: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
            <span><strong className="tabular-nums">{followers.length * 120 + 20}</strong> <span style={{ color: 'var(--text-secondary)' }}>Followers</span></span>
            <span><strong className="tabular-nums">{following.length}</strong> <span style={{ color: 'var(--text-secondary)' }}>Following</span></span>
            <span><strong className="tabular-nums">{myPosts.length}</strong> <span style={{ color: 'var(--text-secondary)' }}>Posts</span></span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className={styles.infoCard}>
        <div className={styles.sectionHeading}>
          <Sparkles size={18} color="var(--primary)" /> About Me
        </div>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 16 }}>
          {currentUser?.bio}
        </p>

        {currentUser?.relationshipGoal && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-light)',
            color: 'var(--accent-hover)',
            fontWeight: 700,
            fontSize: '0.8125rem'
          }}>
            Relationship Goal: {currentUser?.relationshipGoal}
          </div>
        )}
      </div>

      {/* Interests */}
      <div className={styles.infoCard}>
        <div className={styles.sectionHeading}>
          Passions & Interests
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {currentUser?.interests?.map?.(i => (
            <span
              key={i}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--surface-subtle)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.8125rem'
              }}
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div className={styles.infoCard}>
        <div className={styles.sectionHeading}>
          Lifestyle & Basics
        </div>
        <div className={styles.lifestyleGrid}>
          {currentUser?.lifestyle?.occupation && (
            <div className={styles.lifestyleItem}>
              <div className={styles.lifestyleLabel}>Work</div>
              <div className={styles.lifestyleValue}>{currentUser?.lifestyle?.occupation}</div>
            </div>
          )}
          {currentUser?.lifestyle?.education && (
            <div className={styles.lifestyleItem}>
              <div className={styles.lifestyleLabel}>Education</div>
              <div className={styles.lifestyleValue}>{currentUser?.lifestyle?.education}</div>
            </div>
          )}
          {currentUser?.lifestyle?.exercise && (
            <div className={styles.lifestyleItem}>
              <div className={styles.lifestyleLabel}>Workout</div>
              <div className={styles.lifestyleValue}>{currentUser?.lifestyle?.exercise}</div>
            </div>
          )}
          {currentUser?.lifestyle?.drinking && (
            <div className={styles.lifestyleItem}>
              <div className={styles.lifestyleLabel}>Drinks</div>
              <div className={styles.lifestyleValue}>{currentUser?.lifestyle?.drinking}</div>
            </div>
          )}
          {currentUser?.lifestyle?.pets && (
            <div className={styles.lifestyleItem}>
              <div className={styles.lifestyleLabel}>Pets</div>
              <div className={styles.lifestyleValue}>{currentUser?.lifestyle?.pets}</div>
            </div>
          )}
        </div>
      </div>

      {/* Photos */}
      <div className={styles.infoCard}>
        <div className={styles.sectionHeading}>
          Photos ({currentUser?.photos?.length})
        </div>
        <div className={styles.photoGallery}>
          {currentUser?.photos?.map?.((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Photo ${idx + 1}`}
              className={styles.galleryPhoto}
            />
          ))}
        </div>
      </div>

      {/* My Posts */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '24px 0 16px', color: 'var(--text-primary)' }}>
          My Posts ({myPosts.length})
        </h3>
        {myPosts.length > 0 ? (
          myPosts.map(p => <PostCard key={p.id} post={p} />)
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>You haven't posted yet.</p>
        )}
      </div>

      <EditProfileDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
      />
    </div>
  );
};
