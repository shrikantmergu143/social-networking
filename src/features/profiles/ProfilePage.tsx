import React, { useEffect, useState } from 'react';
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
import { toggleFollowUser, blockUser } from '../connections/connectionsSlice';
import { replaceNotifications } from '../notifications/notificationsSlice';
import { ROUTES } from '../../routes/paths';
import styles from './ProfilePage.module.css';
import { socialApi } from '../../lib/social.api';
import { ProfileCover } from './ProfileCover';
import { setProfileFollowRequestPending } from '../discovery/discoverySlice';
import { getFollowButtonLabel, isFollowingProfile } from '../../lib/followStatus';

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(state => state.auth.currentUser);
  const profiles = useAppSelector(state => state.discovery.profiles);
  const posts = useAppSelector(state => state.feed.posts);
  const following = useAppSelector(state => state.connections.following);
  const [loadedProfile, setLoadedProfile] = useState<(typeof profiles)[number] | null>(null);

  useEffect(() => {
    if (!userId || userId === currentUser?.id) return;
    let active = true;
    socialApi.getProfile(userId)
      .then(data => { if (active) setLoadedProfile(data); })
      .catch(error => { if (active) message.error(error instanceof Error ? error.message : 'Unable to load profile.'); });
    return () => { active = false; };
  }, [userId, currentUser?.id]);

  // If userId is 'usr_me' or matches current user id, navigate to /my-profile
  if (userId === 'usr_me' || userId === currentUser?.id) {
    navigate(ROUTES.MY_PROFILE, { replace: true });
    return null;
  }

  const profile = loadedProfile?.id === userId ? loadedProfile : profiles.find(p => p.id === userId);
  if (!profile) return null;
  const isFollowed = isFollowingProfile(profile, following);
  const userPosts = profile.isPrivate && !isFollowed ? [] : posts.filter?.(p => p.userId === profile.id);

  const handleLike = async () => {
    try {
      const result = await socialApi.recordDatingAction(profile.id, 'like');
      message.success(result.matched ? `It's a match with ${profile.fullName}!` : `You liked ${profile.fullName}!`);
      dispatch(replaceNotifications(await socialApi.getNotifications()));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to like this profile.');
    }
  };

  const handleSuperLike = async () => {
    try {
      const result = await socialApi.recordDatingAction(profile.id, 'superlike');
      message.success(result.matched ? `It's a match with ${profile.fullName}!` : `You Super Liked ${profile.fullName}!`);
      dispatch(replaceNotifications(await socialApi.getNotifications()));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to super like this profile.');
    }
  };

  const handleSendMessage = async () => {
    if (profile.isPrivate && !isFollowed) {
      message.info('Follow this private profile and wait for approval before messaging.');
      return;
    }
    try {
      const conversation = await socialApi.openConversation(profile.id);
      navigate(ROUTES.CONVERSATION(conversation.id));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to open conversation.');
    }
  };

  const handleToggleFollow = async () => {
    try {
      if (profile.hasPendingFollowRequest && !isFollowed) {
        await socialApi.cancelFollowRequest(profile.id);
        dispatch(setProfileFollowRequestPending({ profileId: profile.id, pending: false }));
        setLoadedProfile({ ...profile, hasPendingFollowRequest: false });
        message.info('Follow request cancelled');
        return;
      }
      const result = await socialApi.setFollow(profile.id, !isFollowed);
      if (result.requestPending) {
        dispatch(setProfileFollowRequestPending({ profileId: profile.id, pending: true }));
        setLoadedProfile({ ...profile, hasPendingFollowRequest: true });
        message.success(`Follow request sent to ${profile.fullName}`);
      } else {
        dispatch(toggleFollowUser(profile));
        setLoadedProfile({ ...profile, isFollowing: !isFollowed, hasPendingFollowRequest: false });
        dispatch(replaceNotifications(await socialApi.getNotifications()));
        message.info(isFollowed ? `Unfollowed ${profile.fullName}` : `Followed ${profile.fullName}`);
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to update follow.');
    }
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
        void socialApi.setBlocked(profile.id, true)
          .then(() => {
            dispatch(blockUser(profile));
            message.warning(`Blocked ${profile.fullName}`);
            navigate(ROUTES.FEED);
          })
          .catch(error => message.error(error instanceof Error ? error.message : 'Unable to block user.'));
      }
    }
  ];

  return (
    <div className={styles.profileContainer}>
      {/* Cover & Profile Header */}
      <div className={styles.coverCard}>
        <ProfileCover src={profile.coverImage || profile.photos[0]} alt="Cover" />
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
                {getFollowButtonLabel(profile, isFollowed)}
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
                disabled={Boolean(profile.isPrivate && !isFollowed)}
                title={profile.isPrivate && !isFollowed ? 'Follow and wait for approval before messaging' : undefined}
                icon={<MessageCircle size={16} />}
              >
                {profile.isPrivate && !isFollowed ? 'Private' : 'Message'}
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
