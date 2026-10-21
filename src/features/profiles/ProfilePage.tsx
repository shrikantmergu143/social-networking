import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  MapPin,
  Sparkles,
  ShieldAlert,
  Flag,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { Dropdown, type MenuProps } from 'antd';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { AppButton } from '../../components/common/AppButton';
import { PostCard } from '../feed/PostCard';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { recordSwipe } from '../discovery/discoverySlice';
import { toggleFollowUser, blockUser } from '../connections/connectionsSlice';
import { startConversationWithUser } from '../messages/messagesSlice';
import { ROUTES } from '../../routes/paths';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.auth.currentUser);
  const profiles = useAppSelector(state => state.discovery.profiles);
  const posts = useAppSelector(state => state.feed.posts);
  const following = useAppSelector(state => state.connections.following);

  // If userId is 'usr_me' or matches current user id, navigate to /my-profile
  if (userId === 'usr_me' || userId === currentUser?.id) {
    navigate(ROUTES.MY_PROFILE, { replace: true });
    return null;
  }

  const profile = profiles.find(p => p.id === userId) || profiles[0];
  const isFollowed = following.some(f => f.id === profile.id);
  const userPosts = posts.filter(p => p.userId === profile.id);

  const handleLike = () => {
    dispatch(recordSwipe({ profileId: profile.id, actionType: 'like' }));
    message.success(`You liked ${profile.fullName}!`);
  };

  const handleSuperLike = () => {
    dispatch(recordSwipe({ profileId: profile.id, actionType: 'superlike' }));
    message.success(`You Super Liked ${profile.fullName}!`);
  };

  const handleSendMessage = () => {
    dispatch(startConversationWithUser({ user: profile }));
    navigate(ROUTES.MESSAGES);
  };

  const handleToggleFollow = () => {
    dispatch(toggleFollowUser(profile));
    message.info(isFollowed ? `Unfollowed ${profile.fullName}` : `Following ${profile.fullName}`);
  };

  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'report',
      label: 'Report Profile',
      icon: <Flag size={14} />,
      onClick: () => navigate(ROUTES.REPORT(profile.id))
    },
    {
      key: 'block',
      label: 'Block User',
      icon: <ShieldAlert size={14} />,
      danger: true,
      onClick: () => {
        dispatch(blockUser(profile));
        message.warning(`Blocked ${profile.fullName}`);
        navigate(ROUTES.FEED);
      }
    }
  ];

  return (
    <div className={styles.profileContainer}>
      {/* Cover & Profile Header */}
      <div className={styles.coverCard}>
        <img
          src={profile.coverImage || profile.photos[0]}
          alt="Cover"
          className={styles.coverImage}
        />
        <div className={styles.headerBar}>
          <div className={styles.avatarFloating}>
            <AppAvatar
              src={profile.avatar}
              alt={profile.fullName}
              size={96}
              isVerified={profile.isVerified}
              isOnline={profile.isOnline}
            />
          </div>

          <div className={styles.titleRow}>
            <div>
              <h1 className={styles.profileTitle}>
                {profile.fullName}, {profile.age}
                {profile.isVerified && (
                  <CheckCircle size={22} fill="#38bdf8" color="white" />
                )}
              </h1>
              <div className={styles.subMeta}>
                <span>@{profile.username}</span>
                <span>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={13} /> {profile.location} ({profile.distanceKm} km away)
                </span>
                {profile.pronouns && (
                  <>
                    <span>·</span>
                    <span>{profile.pronouns}</span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.actionRow}>
              <AppButton
                variant={isFollowed ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleToggleFollow}
                icon={isFollowed ? <UserCheck size={16} /> : <UserPlus size={16} />}
              >
                {isFollowed ? 'Following' : 'Follow'}
              </AppButton>

              <AppButton
                variant="primary"
                size="sm"
                onClick={handleLike}
                icon={<Heart size={16} />}
              >
                Like
              </AppButton>

              <AppButton
                variant="accent"
                size="sm"
                onClick={handleSuperLike}
              >
                Super Like
              </AppButton>

              <AppButton
                variant="secondary"
                size="sm"
                onClick={handleSendMessage}
                icon={<MessageCircle size={16} />}
              >
                Message
              </AppButton>

              <Dropdown menu={{ items: moreMenuItems }} trigger={['click']} placement="bottomRight">
                <AppButton variant="ghost" size="sm">
                  ···
                </AppButton>
              </Dropdown>
            </div>
          </div>

          {/* Followers & Followed counters */}
          <div style={{ display: 'flex', gap: 20, paddingTop: 8, borderTop: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
            <span><strong className="tabular-nums">{profile.followerCount}</strong> <span style={{ color: 'var(--text-secondary)' }}>Followers</span></span>
            <span><strong className="tabular-nums">{profile.followingCount}</strong> <span style={{ color: 'var(--text-secondary)' }}>Following</span></span>
            <span><strong className="tabular-nums">{userPosts.length}</strong> <span style={{ color: 'var(--text-secondary)' }}>Posts</span></span>
          </div>
        </div>
      </div>

      {/* Bio & Intentions */}
      <div className={styles.infoCard}>
        <div className={styles.sectionHeading}>
          <Sparkles size={18} color="var(--primary)" /> About & Intentions
        </div>
        <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 16 }}>
          {profile.bio}
        </p>

        {profile.relationshipGoal && (
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
            Relationship Goal: {profile.relationshipGoal}
          </div>
        )}
      </div>

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <div className={styles.infoCard}>
          <div className={styles.sectionHeading}>
            Passions & Interests
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {profile.interests.map(i => (
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
      )}

      {/* Lifestyle Breakdown */}
      {profile.lifestyle && (
        <div className={styles.infoCard}>
          <div className={styles.sectionHeading}>
            Lifestyle & Basics
          </div>
          <div className={styles.lifestyleGrid}>
            {profile.lifestyle.occupation && (
              <div className={styles.lifestyleItem}>
                <div className={styles.lifestyleLabel}>Work</div>
                <div className={styles.lifestyleValue}>{profile.lifestyle.occupation}</div>
              </div>
            )}
            {profile.lifestyle.education && (
              <div className={styles.lifestyleItem}>
                <div className={styles.lifestyleLabel}>Education</div>
                <div className={styles.lifestyleValue}>{profile.lifestyle.education}</div>
              </div>
            )}
            {profile.lifestyle.exercise && (
              <div className={styles.lifestyleItem}>
                <div className={styles.lifestyleLabel}>Workout</div>
                <div className={styles.lifestyleValue}>{profile.lifestyle.exercise}</div>
              </div>
            )}
            {profile.lifestyle.drinking && (
              <div className={styles.lifestyleItem}>
                <div className={styles.lifestyleLabel}>Drinks</div>
                <div className={styles.lifestyleValue}>{profile.lifestyle.drinking}</div>
              </div>
            )}
            {profile.lifestyle.pets && (
              <div className={styles.lifestyleItem}>
                <div className={styles.lifestyleLabel}>Pets</div>
                <div className={styles.lifestyleValue}>{profile.lifestyle.pets}</div>
              </div>
            )}
            {profile.lifestyle.zodiac && (
              <div className={styles.lifestyleItem}>
                <div className={styles.lifestyleLabel}>Zodiac</div>
                <div className={styles.lifestyleValue}>{profile.lifestyle.zodiac}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      {profile.photos && profile.photos.length > 0 && (
        <div className={styles.infoCard}>
          <div className={styles.sectionHeading}>
            Photo Gallery ({profile.photos.length})
          </div>
          <div className={styles.photoGallery}>
            {profile.photos.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`${profile.fullName} photo ${idx + 1}`}
                className={styles.galleryPhoto}
              />
            ))}
          </div>
        </div>
      )}

      {/* Social Posts Stream */}
      <div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '24px 0 16px', color: 'var(--text-primary)' }}>
          Social Activity ({userPosts.length})
        </h3>
        {userPosts.length > 0 ? (
          userPosts.map(p => <PostCard key={p.id} post={p} />)
        ) : (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No posts shared yet.</p>
        )}
      </div>
    </div>
  );
};
