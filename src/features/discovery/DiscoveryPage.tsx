import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Flame, RotateCcw, Sparkles, LayoutGrid, Layers, Heart, X, CheckCircle, MapPin, Info, Search } from 'lucide-react';
import { Card, Row, Col, Tag, Button, App } from 'antd';
import { DiscoveryCard } from './DiscoveryCard';
import { DatingFiltersDrawer } from './DatingFiltersDrawer';
import { AppEmptyState } from '../../components/common/AppEmptyState';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { resetDiscoveryQueue, recordSwipe, replaceProfiles } from './discoverySlice';
import { socialApi } from '../../lib/social.api';
import { message as appMessage } from '../../app/notification';
import { ROUTES } from '../../routes/paths';
import styles from './DiscoveryPage.module.css';

export const DiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { profiles, processedIds, filters } = useAppSelector(state => state.discovery);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    let active = true;
    socialApi.getDiscovery()
      .then(data => { if (active) dispatch(replaceProfiles(data)); })
      .catch(error => { if (active) appMessage.error(error instanceof Error ? error.message : 'Unable to load profiles.'); });
    return () => { active = false; };
  }, [dispatch]);

  // Filter profiles based on:
  // 1. Not current user ('usr_me')
  // 2. Not already processed
  // 3. Age within range
  // 4. Distance within maxDistanceKm
  // 5. Gender matches preferences
  // 6. Verified only if checked
  // 7. Online only if checked
  // 8. Search query matching name, location, interests, or bio
  const eligibleProfiles = profiles.filter?.(p => {
    if (p.id === 'usr_me') return false;
    if (processedIds.includes(p.id)) return false;

    // Age
    if (p.age < filters.ageRange[0] || p.age > filters.ageRange[1]) return false;

    // Distance
    if (p.distanceKm > filters.maxDistanceKm) return false;

    // Gender
    if (filters.genderPreference.length > 0 && !filters.genderPreference.includes(p.gender)) {
      return false;
    }

    // Verified
    if (filters.verifiedOnly && !p.isVerified) return false;

    // Online
    if (filters.onlineOnly && !p.isOnline) return false;

    // Search query (interests, location, name, bio)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.fullName.toLowerCase().includes(q);
      const locationMatch = p.location.toLowerCase().includes(q);
      const bioMatch = p.bio?.toLowerCase().includes(q) || false;
      const interestMatch = p.interests?.some?.(i => i.toLowerCase().includes(q)) || false;
      if (!nameMatch && !locationMatch && !bioMatch && !interestMatch) {
        return false;
      }
    }

    return true;
  });

  const currentProfile = eligibleProfiles[0];

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.pageHeading}>
          <Flame size={24} color="var(--primary)" />
          <span>Discover Connections</span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search bar for interests, location, name */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, color: '#888' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interests, location..."
              style={{
                height: 36,
                paddingLeft: 32,
                paddingRight: 12,
                borderRadius: 18,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                fontSize: '0.8125rem',
                outline: 'none',
                width: 200
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 14 }}
              >
                ×
              </button>
            )}
          </div>

          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', padding: 4, borderRadius: 12 }}>
            <button
              onClick={() => setViewMode('deck')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'deck' ? 'white' : 'transparent',
                boxShadow: viewMode === 'deck' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                color: viewMode === 'deck' ? 'var(--primary)' : '#666'
              }}
            >
              <Layers size={15} /> Swipe
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: viewMode === 'grid' ? 'white' : 'transparent',
                boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                color: viewMode === 'grid' ? 'var(--primary)' : '#666'
              }}
            >
              <LayoutGrid size={15} /> Feed
            </button>
          </div>

          <button
            className={styles.filterTrigger}
            onClick={() => setFilterDrawerOpen(true)}
            title="Open Filters"
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {eligibleProfiles.length === 0 ? (
        <AppEmptyState
          icon={<Sparkles size={36} />}
          title="You've explored everyone for now!"
          description="You've reviewed all members matching your current filters. Try adjusting your age or distance preferences, or reset the deck to review again."
          action={
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <AppButton
                variant="outline"
                onClick={() => setFilterDrawerOpen(true)}
              >
                Adjust Filters
              </AppButton>
              <AppButton
                variant="primary"
                icon={<RotateCcw size={16} />}
                onClick={() => dispatch(resetDiscoveryQueue())}
              >
                Reset Deck Queue
              </AppButton>
            </div>
          }
        />
      ) : viewMode === 'deck' && currentProfile ? (
        <DiscoveryCard profile={currentProfile} />
      ) : (
        <div style={{ paddingBottom: 32, width: '100%', maxWidth: 900, margin: '0 auto' }}>
          <div style={{ marginBottom: 16, fontSize: 14, color: '#666', fontWeight: 500 }}>
            Visual Discovery Feed ({eligibleProfiles.length} profiles available)
          </div>
          <Row gutter={[16, 16]}>
            {eligibleProfiles.map(profile => {
              const photo = profile.photos?.[0] || profile.avatar;
              return (
                <Col xs={24} sm={12} md={8} key={profile.id}>
                  <Card
                    hoverable
                    style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f0' }}
                    cover={
                      <div style={{ height: 280, position: 'relative', overflow: 'hidden' }}>
                        <img
                          alt={profile.fullName}
                          src={photo}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          referrerPolicy="no-referrer"
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          padding: '24px 16px 12px 16px',
                          color: 'white'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 18, fontWeight: 700 }}>
                            {profile.fullName}, {profile.age}
                            {profile.isVerified && <CheckCircle size={16} fill="#38bdf8" color="white" />}
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.9, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <MapPin size={12} /> {profile.distanceKm} km · {profile.location}
                          </div>
                        </div>
                      </div>
                    }
                    actions={[
                      <button
                        onClick={() => dispatch(recordSwipe({ profileId: profile.id, actionType: 'pass' }))}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff4d4f', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 4, fontWeight: 600 }}
                        title="Pass"
                      >
                        <X size={16} /> Pass
                      </button>,
                      <button
                        onClick={() => navigate(ROUTES.PROFILE(profile.id))}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#7928ca', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 4, fontWeight: 600 }}
                        title="View Profile"
                      >
                        <Info size={16} /> Profile
                      </button>,
                      <button
                        onClick={() => {
                          dispatch(recordSwipe({ profileId: profile.id, actionType: 'like' }));
                          message.success(`Liked ${profile.fullName}!`);
                        }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ff3366', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: 4, fontWeight: 600 }}
                        title="Like"
                      >
                        <Heart size={16} fill="#ff3366" /> Like
                      </button>
                    ]}
                  >
                    <Card.Meta
                      description={
                        <div>
                          {profile.relationshipGoal && (
                            <Tag color="magenta" style={{ marginBottom: 6, borderRadius: 999 }}>
                              {profile.relationshipGoal}
                            </Tag>
                          )}
                          <div style={{ fontSize: 13, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {profile.bio || 'No bio yet.'}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      )}

      <DatingFiltersDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
    </div>
  );
};
