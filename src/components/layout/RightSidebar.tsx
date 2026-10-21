import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Heart } from 'lucide-react';
import { AppAvatar } from '../common/AppAvatar';
import { AppButton } from '../common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { toggleFollowUser } from '../../features/connections/connectionsSlice';
import { ROUTES } from '../../routes/paths';
import styles from './RightSidebar.module.css';

export const RightSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const profiles = useAppSelector(state => state.discovery.profiles);
  const matches = useAppSelector(state => state.matches.matches);
  const following = useAppSelector(state => state.connections.following);

  // Suggested people who aren't followed yet
  const suggested = profiles.filter(
    p => !following.some(f => f.id === p.id) && p.id !== 'usr_me'
  ).slice(0, 4);

  const trendingTopics = [
    { name: 'FilmPhotography', count: '1.2k posts' },
    { name: 'Ceramics', count: '890 posts' },
    { name: 'NaturalWine', count: '640 posts' },
    { name: 'Sourdough', count: '520 posts' },
    { name: 'AmbientMusic', count: '410 posts' }
  ];

  return (
    <aside className={styles.rightSidebar}>
      {/* Online Matches Strip */}
      {matches.length > 0 && (
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={16} fill="var(--primary)" color="var(--primary)" />
              Your Matches
            </span>
            <Link to={ROUTES.MATCHES} className={styles.seeAllLink}>
              View All ({matches.length})
            </Link>
          </div>
          <div className={styles.onlineMatchesRow}>
            {matches.slice(0, 5).map(match => (
              <Link
                key={match.id}
                to={ROUTES.PROFILE(match.id)}
                className={styles.onlineMatchItem}
                title={`${match.fullName} (${match.age})`}
              >
                <AppAvatar
                  src={match.avatar}
                  alt={match.fullName}
                  size={52}
                  isVerified={match.isVerified}
                  isOnline={match.isOnline}
                />
                <span className={styles.onlineMatchName}>
                  {match.fullName.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Suggested People */}
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={16} color="var(--primary)" />
            Suggested for You
          </span>
          <Link to={ROUTES.CONNECTIONS} className={styles.seeAllLink}>
            See All
          </Link>
        </div>
        <div className={styles.peopleList}>
          {suggested.map(person => {
            const isFollowed = following.some(f => f.id === person.id);
            return (
              <div key={person.id} className={styles.personRow}>
                <Link to={ROUTES.PROFILE(person.id)} className={styles.personInfo}>
                  <AppAvatar
                    src={person.avatar}
                    alt={person.fullName}
                    size={40}
                    isVerified={person.isVerified}
                  />
                  <div className={styles.personText}>
                    <div className={styles.personName}>
                      {person.fullName}
                    </div>
                    <div className={styles.personSub}>
                      {person.lifestyle.occupation || person.interests[0]}
                    </div>
                  </div>
                </Link>

                <AppButton
                  variant={isFollowed ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => dispatch(toggleFollowUser(person))}
                >
                  {isFollowed ? 'Following' : 'Follow'}
                </AppButton>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Interests */}
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.title} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} color="var(--secondary)" />
            Trending Communities
          </span>
        </div>
        <div className={styles.tagCluster}>
          {trendingTopics.map(t => (
            <Link
              key={t.name}
              to={`${ROUTES.SEARCH}?tag=${t.name}`}
              className={styles.tagItem}
            >
              #{t.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
