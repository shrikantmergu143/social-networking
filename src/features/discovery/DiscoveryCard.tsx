import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Heart,
  Star,
  RotateCcw,
  Bookmark,
  CheckCircle,
  MapPin,
  Info,
  Sparkles
} from 'lucide-react';
import { App } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { recordSwipe, rewindLastAction, toggleSaveProfile } from './discoverySlice';
import { showMatchedProfile } from './discoverySlice';
import { socialApi } from '../../lib/social.api';
import { ROUTES } from '../../routes/paths';
import type { UserProfile } from '../../types';
import styles from './DiscoveryCard.module.css';

interface DiscoveryCardProps {
  profile: UserProfile;
}

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ profile }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const actionHistory = useAppSelector(state => state.discovery.actionHistory);
  const savedProfileIds = useAppSelector(state => state.discovery.savedProfileIds);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const isSaved = savedProfileIds.includes(profile.id);
  const photos = profile.photos && profile.photos.length > 0 ? profile.photos : [profile.avatar];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx < photos.length - 1) {
      setActivePhotoIdx(prev => prev + 1);
    } else {
      setActivePhotoIdx(0);
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx > 0) {
      setActivePhotoIdx(prev => prev - 1);
    } else {
      setActivePhotoIdx(photos.length - 1);
    }
  };

  const submitAction = async (action: 'like' | 'pass' | 'superlike') => {
    try {
      const result = await socialApi.recordDatingAction(profile.id, action);
      dispatch(recordSwipe({ profileId: profile.id, actionType: action }));
      if (result.matched) dispatch(showMatchedProfile(profile));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to save this action.');
      setDragX(0);
    }
  };

  const handlePass = () => {
    setDragX(-300);
    setTimeout(() => {
      void submitAction('pass').finally(() => setDragX(0));
    }, 200);
  };

  const handleLike = () => {
    setDragX(300);
    setTimeout(() => {
      void submitAction('like').finally(() => setDragX(0));
    }, 200);
  };

  const handleSuperLike = () => {
    void submitAction('superlike');
  };

  const handleRewind = () => {
    if (actionHistory.length > 0) {
      dispatch(rewindLastAction());
      message.info('Previous profile restored to queue');
    } else {
      message.info('No recent actions to rewind');
    }
  };

  const handleToggleSave = async () => {
    try {
      await socialApi.setSavedProfile(profile.id, !isSaved);
      dispatch(toggleSaveProfile(profile.id));
      message.success(isSaved ? 'Profile removed from bookmarks' : 'Profile bookmarked');
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to save profile.');
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    setDragX(deltaX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 100) {
      handleLike();
    } else if (dragX < -100) {
      handlePass();
    } else {
      setDragX(0);
    }
  };

  return (
    <div className={styles.discoveryDeck}>
      <div
        className={styles.cardFrame}
        style={{
          transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
          touchAction: 'none',
          cursor: 'grab'
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Swipe Stamp Overlays */}
        {dragX > 20 && (
          <div style={{ opacity: Math.min(dragX / 100, 1), position: 'absolute', top: 40, left: 30, zIndex: 30, pointerEvents: 'none' }} className="px-6 py-2 border-4 border-emerald-500 rounded-xl text-emerald-500 font-extrabold text-3xl uppercase tracking-widest rotate-[-15deg] bg-white/80 shadow-lg">
            LIKE
          </div>
        )}
        {dragX < -20 && (
          <div style={{ opacity: Math.min(-dragX / 100, 1), position: 'absolute', top: 40, right: 30, zIndex: 30, pointerEvents: 'none' }} className="px-6 py-2 border-4 border-rose-500 rounded-xl text-rose-500 font-extrabold text-3xl uppercase tracking-widest rotate-[15deg] bg-white/80 shadow-lg">
            PASS
          </div>
        )}

        {/* Photo Bar Indicators */}
        {photos.length > 1 && (
          <div className={styles.photoIndicators}>
            {photos.map((_, i) => (
              <div
                key={i}
                className={`${styles.indicatorBar} ${i === activePhotoIdx ? styles.indicatorActive : ''}`}
              />
            ))}
          </div>
        )}

        <img
          src={photos[activePhotoIdx]}
          alt={profile.fullName}
          className={styles.photoImage}
          referrerPolicy="no-referrer"
        />

        {/* Tap zones for browsing photos */}
        <div className={styles.touchLeft} onClick={handlePrevPhoto} title="Previous photo" />
        <div className={styles.touchRight} onClick={handleNextPhoto} title="Next photo" />

        {/* Scrim Overlay */}
        <div className={styles.scrimOverlay}>
          <div className={styles.nameRow}>
            <h2 className={styles.profileName}>
              {profile.fullName}, {profile.age}
              {profile.isVerified && (
                <CheckCircle size={20} className={styles.verifiedIcon} fill="#38bdf8" color="white" />
              )}
            </h2>
          </div>

          <div className={styles.metaRow}>
            <MapPin size={14} />
            <span>{profile.distanceKm} km away · {profile.location}</span>
          </div>

          {profile.relationshipGoal && (
            <div className={styles.intentionLabel}>
              <Sparkles size={12} /> {profile.relationshipGoal}
            </div>
          )}

          {profile.bio && (
            <p className={styles.bioSnippet}>{profile.bio}</p>
          )}

          {profile.interests && (
            <div className={styles.tagsCluster}>
              {profile.interests.slice(0, 4).map(i => (
                <span key={i} className={styles.tagPill}>{i}</span>
              ))}
            </div>
          )}
        </div>

        {/* Info button -> opens full profile details */}
        <button
          className={styles.detailsTrigger}
          onClick={() => navigate(ROUTES.PROFILE(profile.id))}
          title="View Full Profile"
        >
          <Info size={20} />
        </button>
      </div>

      {/* Tactile Action Dock */}
      <div className={styles.actionDock}>
        <button
          className={`${styles.dockBtn} ${styles.rewindBtn}`}
          onClick={handleRewind}
          title="Rewind previous card"
          disabled={actionHistory.length === 0}
        >
          <RotateCcw size={18} />
        </button>

        <button
          className={`${styles.dockBtn} ${styles.passBtn}`}
          onClick={handlePass}
          title="Pass"
        >
          <X size={28} strokeWidth={2.5} />
        </button>

        <button
          className={`${styles.dockBtn} ${styles.superlikeBtn}`}
          onClick={handleSuperLike}
          title="Super Like"
        >
          <Star size={24} fill="currentColor" />
        </button>

        <button
          className={`${styles.dockBtn} ${styles.likeBtn}`}
          onClick={handleLike}
          title="Like"
        >
          <Heart size={30} fill="currentColor" />
        </button>

        <button
          className={`${styles.dockBtn} ${styles.bookmarkBtn}`}
          onClick={handleToggleSave}
          title={isSaved ? "Saved" : "Save profile"}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};
