import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Send, Sparkles } from 'lucide-react';
import { AppModal } from './AppModal';
import { AppButton } from './AppButton';
import { AppAvatar } from './AppAvatar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { dismissMatchCelebration } from '../../features/discovery/discoverySlice';
import { addMatch } from '../../features/matches/matchesSlice';
import { startConversationWithUser } from '../../features/messages/messagesSlice';
import { ROUTES } from '../../routes/paths';
import styles from './MatchCelebrationModal.module.css';

export const MatchCelebrationModal: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showMatchCelebration, lastMatchedUser } = useAppSelector(state => state.discovery);
  const currentUser = useAppSelector(state => state.auth.currentUser);
  const [firstMessage, setFirstMessage] = useState('');

  if (!showMatchCelebration || !lastMatchedUser) return null;

  const handleSendMessage = () => {
    dispatch(addMatch(lastMatchedUser));
    dispatch(startConversationWithUser({
      user: lastMatchedUser,
      initialMessage: firstMessage.trim() || `Hey ${lastMatchedUser.fullName.split(' ')[0]}! Excited to connect ✨`
    }));
    dispatch(dismissMatchCelebration());
    navigate(ROUTES.MESSAGES);
  };

  const handleKeepExploring = () => {
    dispatch(addMatch(lastMatchedUser));
    dispatch(dismissMatchCelebration());
  };

  return (
    <AppModal
      open={showMatchCelebration}
      onCancel={handleKeepExploring}
      width={460}
      className="match-modal"
    >
      <div className={styles.overlay}>
        <div className={styles.matchHeader}>
          <div className={styles.matchBadge}>
            <Sparkles size={14} /> Mutual Connection
          </div>
          <h2 className={styles.title}>It’s an Aura Match!</h2>
        </div>

        <div className={styles.avatarOverlap}>
          <div className={styles.avatarLeft}>
            <AppAvatar
              src={currentUser?.avatar || ''}
              alt={currentUser?.fullName || 'You'}
              size={100}
            />
          </div>
          <div className={styles.heartCenter}>
            <Heart size={22} fill="white" />
          </div>
          <div className={styles.avatarRight}>
            <AppAvatar
              src={lastMatchedUser.avatar}
              alt={lastMatchedUser.fullName}
              size={100}
            />
          </div>
        </div>

        <p className={styles.subtitle}>
          You and <strong style={{ color: 'var(--text-primary)' }}>{lastMatchedUser.fullName}</strong> liked each other’s vibe!
          {lastMatchedUser.matchPercentage && (
            <span> · <span className="tabular-nums" style={{ color: 'var(--primary)', fontWeight: 700 }}>{lastMatchedUser.matchPercentage}%</span> shared interests</span>
          )}
        </p>

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            type="text"
            value={firstMessage}
            onChange={(e) => setFirstMessage(e.target.value)}
            placeholder={`Say something nice to ${lastMatchedUser.fullName.split(' ')[0]}...`}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              padding: '0 48px 0 20px',
              fontSize: '0.9375rem',
              outline: 'none',
              background: 'var(--surface-subtle)',
              fontFamily: 'inherit'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              position: 'absolute',
              right: 6,
              top: 6,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--gradient-primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(255, 79, 129, 0.3)'
            }}
            title="Send Message"
          >
            <Send size={16} />
          </button>
        </div>

        <div className={styles.actions}>
          <AppButton
            variant="primary"
            fullWidth
            onClick={handleSendMessage}
            icon={<Send size={16} />}
          >
            Send Message & Chat
          </AppButton>
          <AppButton
            variant="ghost"
            fullWidth
            onClick={handleKeepExploring}
          >
            Keep Swiping
          </AppButton>
        </div>
      </div>
    </AppModal>
  );
};
