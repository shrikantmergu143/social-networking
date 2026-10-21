import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AppAvatar } from '../../components/common/AppAvatar';
import { useAppSelector } from '../../hooks';
import { ROUTES } from '../../routes/paths';
import styles from './StoriesCarousel.module.css';

interface StoriesCarouselProps {
  onOpenCreateStory?: () => void;
}

export const StoriesCarousel: React.FC<StoriesCarouselProps> = ({ onOpenCreateStory }) => {
  const navigate = useNavigate();
  const stories = useAppSelector(state => state.stories.stories);
  const currentUser = useAppSelector(state => state.auth.currentUser);

  return (
    <div className={styles.carouselContainer}>
      <div className={`${styles.scrollRow} hide-scrollbar`}>
        {/* Current user add story */}
        <div
          className={styles.storyItem}
          onClick={() => {
            if (onOpenCreateStory) onOpenCreateStory();
            else navigate(ROUTES.STORIES('story_me'));
          }}
        >
          <div className={styles.avatarRingWrapper}>
            <AppAvatar
              src={currentUser?.avatar || ''}
              alt="Your Story"
              size={62}
            />
            <div className={styles.addIcon}>
              <Plus size={12} strokeWidth={3} />
            </div>
          </div>
          <span className={styles.storyName}>Your Story</span>
        </div>

        {/* Other users stories */}
        {stories.filter(s => s.userId !== 'usr_me').map((userStory) => (
          <div
            key={userStory.id}
            className={styles.storyItem}
            onClick={() => navigate(ROUTES.STORIES(userStory.id))}
          >
            <AppAvatar
              src={userStory.userAvatar}
              alt={userStory.userName}
              size={62}
              hasStoryRing={true}
              hasSeenStory={!userStory.hasUnseenStories}
              isVerified={userStory.isVerified}
            />
            <span className={styles.storyName}>{userStory.userName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
