import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Trash2, Search, CheckCircle, Sparkles } from 'lucide-react';
import { message } from '../../app/notification';
import { AppButton } from '../../components/common/AppButton';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { AppConfirmDialog } from '../../components/common/AppConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { removeMatch, setMatchSearchQuery } from './matchesSlice';
import { ROUTES } from '../../routes/paths';
import type { UserProfile } from '../../types';
import styles from './MatchesPage.module.css';
import { socialApi } from '../../lib/social.api';

export const MatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { matches, searchQuery } = useAppSelector(state => state.matches);

  const [matchToRemove, setMatchToRemove] = useState<UserProfile | null>(null);

  const filteredMatches = matches.filter?.(m =>
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.interests.some?.(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleStartChat = async (user: UserProfile) => {
    try {
      const conversation = await socialApi.openConversation(user.id);
      navigate(ROUTES.CONVERSATION(conversation.id));
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Unable to start conversation.');
    }
  };

  const handleConfirmRemove = async () => {
    if (matchToRemove) {
      try {
        await socialApi.removeMatch(matchToRemove.id);
        dispatch(removeMatch(matchToRemove.id));
        message.info(`Removed match with ${matchToRemove.fullName}`);
        setMatchToRemove(null);
      } catch (error) {
        message.error(error instanceof Error ? error.message : 'Unable to remove match.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>
          <Heart size={24} fill="var(--primary)" color="var(--primary)" />
          Your Dating Matches ({matches.length})
        </h1>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setMatchSearchQuery(e.target.value))}
          placeholder="Search matches by name or interest..."
          className={styles.searchBox}
        />
      </div>

      {filteredMatches.length > 0 ? (
        <div className={styles.matchesGrid}>
          {filteredMatches.map(match => (
            <div key={match.id} className={styles.matchCard}>
              <div
                className={styles.photoWrapper}
                onClick={() => navigate(ROUTES.PROFILE(match.id))}
              >
                <img
                  src={match.photos[0] || match.avatar}
                  alt={match.fullName}
                  className={styles.matchPhoto}
                  referrerPolicy="no-referrer"
                />
                {match.matchPercentage && (
                  <div className={styles.compatibilityBadge}>
                    <span className="tabular-nums">{match.matchPercentage}%</span> Match
                  </div>
                )}
              </div>

              <div className={styles.cardBody}>
                <div>
                  <div className={styles.nameAge}>
                    <span>{match.fullName}, {match.age}</span>
                    {match.isVerified && (
                      <CheckCircle size={16} fill="#38bdf8" color="white" />
                    )}
                  </div>
                  <div className={styles.locationText}>
                    {match.location} · {match.distanceKm} km
                  </div>
                  <div className={styles.goalSnippet}>
                    {match.relationshipGoal}
                  </div>
                </div>

                <div className={styles.cardActions}>
                  <AppButton
                    variant="primary"
                    size="sm"
                    fullWidth
                    icon={<MessageCircle size={15} />}
                    onClick={() => handleStartChat(match)}
                  >
                    Chat
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setMatchToRemove(match)}
                    title="Remove Match"
                  >
                    <Trash2 size={16} color="var(--error)" />
                  </AppButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AppEmptyState
          icon={<Sparkles size={36} />}
          title="No matches found"
          description={
            searchQuery
              ? "No matches match your search terms."
              : "You haven't formed mutual matches yet. Head over to Discovery to like profiles and spark connections!"
          }
          action={
            <AppButton
              variant="primary"
              onClick={() => navigate(ROUTES.DISCOVER)}
            >
              Start Exploring in Discovery
            </AppButton>
          }
        />
      )}

      {/* Confirmation Dialog for Match Removal */}
      <AppConfirmDialog
        open={Boolean(matchToRemove)}
        title="Unmatch Connection?"
        description={`Are you sure you want to remove your match with ${matchToRemove?.fullName}? You won't be able to message each other unless you match again.`}
        confirmText="Remove Match"
        onConfirm={handleConfirmRemove}
        onCancel={() => setMatchToRemove(null)}
      />
    </div>
  );
};
