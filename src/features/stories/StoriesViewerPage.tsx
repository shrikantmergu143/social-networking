import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Send, Heart, Pause, Play } from 'lucide-react';
import { message } from '../../app/notification';
import { AppAvatar } from '../../components/common/AppAvatar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { markStoryAsViewed } from './storiesSlice';
import { startConversationWithUser } from '../messages/messagesSlice';
import { ROUTES } from '../../routes/paths';
import styles from './StoriesViewerPage.module.css';
import { socialApi } from '../../lib/social.api';

export const StoriesViewerPage: React.FC = () => {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();
  const dispatch = useAppDispatch();
  const stories = useAppSelector(state => state.stories.stories);
  const profiles = useAppSelector(state => state.discovery.profiles);

  // Find user story by storyId
  const currentStoryUserIndex = stories.findIndex(s => s.id === storyId);
  const currentStoryUser = stories[currentStoryUserIndex >= 0 ? currentStoryUserIndex : 0];

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const currentItem = currentStoryUser?.stories[activeItemIndex];

  // Auto-progress timer
  useEffect(() => {
    if (!currentItem || isPaused) return;

    const duration = (currentItem.durationSeconds || 5) * 1000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentItem, isPaused, activeItemIndex, currentStoryUserIndex]);

  // Mark story as viewed
  useEffect(() => {
    if (currentItem) {
      dispatch(markStoryAsViewed(currentItem.id));
      socialApi.markStoryViewed(currentItem.id).catch(error => {
        message.error(error instanceof Error ? error.message : 'Unable to save story view.');
      });
    }
  }, [currentItem, dispatch]);

  const handleNext = () => {
    setProgress(0);
    if (currentStoryUser && activeItemIndex < currentStoryUser.stories.length - 1) {
      setActiveItemIndex(prev => prev + 1);
    } else {
      // Go to next user's story
      if (currentStoryUserIndex < stories.length - 1) {
        setActiveItemIndex(0);
        navigate(ROUTES.STORIES(stories[currentStoryUserIndex + 1].id));
      } else {
        // Exit to feed
        navigate(ROUTES.FEED);
      }
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (activeItemIndex > 0) {
      setActiveItemIndex(prev => prev - 1);
    } else {
      if (currentStoryUserIndex > 0) {
        setActiveItemIndex(0);
        navigate(ROUTES.STORIES(stories[currentStoryUserIndex - 1].id));
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const targetUser = profiles.find(p => p.id === currentStoryUser.userId);
    if (targetUser) {
      try {
        const { id } = await socialApi.openConversation(targetUser.id);
        await socialApi.sendMessage(id, { text: `Replied to your story: "${replyText.trim()}"` });
        message.success(`Reply sent to ${currentStoryUser.userName}`);
      } catch (error) {
        message.error(error instanceof Error ? error.message : 'Unable to send story reply.');
        return;
      }
    } else {
      message.success(`Reply sent to ${currentStoryUser.userName}`);
    }
    setReplyText('');
  };

  if (!currentStoryUser || !currentItem) {
    return null;
  }

  return (
    <div className={styles.root}>
      <div className={styles.viewerContainer}>
        {/* Progress bars */}
        <div className={styles.progressContainer}>
          {currentStoryUser.stories.map((st, idx) => (
            <div key={st.id} className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: idx < activeItemIndex ? '100%' : idx === activeItemIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div className={styles.topBar}>
          <div className={styles.authorMeta}>
            <AppAvatar
              src={currentStoryUser.userAvatar}
              alt={currentStoryUser.userName}
              size={36}
              isVerified={currentStoryUser.isVerified}
            />
            <div>
              <div className={styles.authorName}>{currentStoryUser.userName}</div>
              <div className={styles.storyTime}>{currentItem.timestamp}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={styles.closeBtn}
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              className={styles.closeBtn}
              onClick={() => navigate(ROUTES.FEED)}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Media */}
        <div className={styles.mediaWrapper}>
          <img
            src={currentItem.mediaUrl}
            alt="Story"
            className={styles.storyImg}
            referrerPolicy="no-referrer"
          />

          {/* Left / Right touch tap zones */}
          <div className={styles.tapZoneLeft} onClick={handlePrev} />
          <div className={styles.tapZoneRight} onClick={handleNext} />
        </div>

        {/* Caption */}
        {currentItem.caption && (
          <div className={styles.storyCaption}>
            {currentItem.caption}
          </div>
        )}

        {/* Reply Bar */}
        <form onSubmit={handleSendReply} className={styles.replyBar}>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            placeholder={`Reply to ${currentStoryUser.userName}...`}
            className={styles.replyInput}
          />
          <button type="submit" className={styles.sendBtn} title="Send reply">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
