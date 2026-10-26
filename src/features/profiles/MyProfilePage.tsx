import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit3,
  Settings,
  MapPin,
  Sparkles,
  CheckCircle,
  UsersRound,
  UserRoundPlus,
  FileText,
  BriefcaseBusiness,
  Check
} from 'lucide-react';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { PostCard } from '../feed/PostCard';
import { EditProfileDrawer } from './EditProfileDrawer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ROUTES } from '../../routes/paths';
import styles from './ProfilePage.module.css';
import { ProfileCover } from './ProfileCover';
import { feedApi } from '../feed/feed.api';
import { replaceProfilePosts } from '../feed/feedSlice';
import { replaceFollowers, replaceFollowing } from '../connections/connectionsSlice';
import { socialApi } from '../../lib/social.api';
import { message } from '../../app/notification';

export const MyProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const myPosts = useAppSelector(state => state.feed.profilePosts);
  const following = useAppSelector(state => state.connections.following);
  const followers = useAppSelector(state => state.connections.followers);

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    let active = true;

    feedApi.getMyPosts()
      .then(profilePosts => {
        if (active) dispatch(replaceProfilePosts(profilePosts));
      })
      .catch(error => {
        if (active) message.error(error instanceof Error ? error.message : 'Unable to load your posts.');
      })
      .finally(() => {
        if (active) setIsLoadingPosts(false);
      });

    socialApi.getFollowing()
      .then(profiles => { if (active) dispatch(replaceFollowing(profiles)); })
      .catch(error => {
        if (active) message.error(error instanceof Error ? error.message : 'Unable to load your following list.');
      });

    socialApi.getFollowers()
      .then(profiles => { if (active) dispatch(replaceFollowers(profiles)); })
      .catch(error => {
        if (active) message.error(error instanceof Error ? error.message : 'Unable to load your followers list.');
      });

    return () => { active = false; };
  }, [currentUser?.id, dispatch]);

  if (!currentUser) return null;

  const userPosts = myPosts?.filter?.(post => post.userId === currentUser.id);

  return (
    <div className={`${styles.profileContainer} ${styles.myProfileContainer}`}>
      <div className={styles.coverCard}>
        <ProfileCover src={currentUser.coverImage || currentUser.photos?.[0]} alt="My Cover" />
        <div className={styles.headerBar}>
          <div className={`${styles.avatarFloating} ${styles.myAvatarFloating}`}>
            <AppAvatar
              src={currentUser?.avatar}
              alt={currentUser?.fullName}
              size={96}
              // isVerified={currentUser?.isVerified}
              className={styles.myProfileAvatar}
            />
          </div>

          <div >
            <div>
              <div className={styles.titleRow}>
                <div>
                  <h1 className={styles.profileTitle}>
                    {currentUser?.fullName}
                    {currentUser?.isVerified && (
                      <span className={styles.verifiedBadge} title="Verified Profile">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </h1>
                  <div className={styles.subMeta}>
                    <span>@{currentUser?.username}</span>
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
              <div className={styles.profileDetails}>
                {currentUser?.location && (
                  <span className={styles.profileDetail}>
                    <MapPin size={16} /> {currentUser.location}
                  </span>
                )}
                {currentUser?.lifestyle?.occupation && (
                  <span className={styles.profileDetail}>
                    <BriefcaseBusiness size={16} /> {currentUser.lifestyle.occupation}
                  </span>
                )}
                {currentUser?.pronouns && (
                  <span className={styles.profileDetail}>{currentUser.pronouns}</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.profileStats}>
            <button
              type="button"
              className={`${styles.statItem} ${styles.statButton}`}
              onClick={() => navigate(ROUTES.FOLLOWERS)}
              aria-label={`View ${followers?.length} followers`}
            >
              <span className={styles.statIcon}><UsersRound size={22} /></span>
              <span className={styles.statCopy}>
                <strong className={`${styles.statValue} tabular-nums`}>{followers?.length}</strong>
                <span className={styles.statLabel}>Followers</span>
              </span>
            </button>
            <button
              type="button"
              className={`${styles.statItem} ${styles.statButton}`}
              onClick={() => navigate(ROUTES.FOLLOWING)}
              aria-label={`View ${following?.length} following`}
            >
              <span className={styles.statIcon}><UserRoundPlus size={22} /></span>
              <span className={styles.statCopy}>
                <strong className={`${styles.statValue} tabular-nums`}>{following?.length}</strong>
                <span className={styles.statLabel}>Following</span>
              </span>
            </button>
            <div className={styles.statItem}>
              <span className={styles.statIcon}><FileText size={22} /></span>
              <span className={styles.statCopy}>
                <strong className={`${styles.statValue} tabular-nums`}>{userPosts?.length}</strong>
                <span className={styles.statLabel}>Posts</span>
              </span>
            </div>
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
      <div className='pb-4'>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '24px 0 16px', color: 'var(--text-primary)' }}>
          My Posts ({userPosts?.length})
        </h3>
        {isLoadingPosts ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading your posts...</p>
        ) : userPosts?.length > 0 ? (
          userPosts?.map(p => <PostCard key={p.id} post={p} />)
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
