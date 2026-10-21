import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Sparkles, Image as ImageIcon, Camera } from 'lucide-react';
import { Slider, Select } from 'antd';
import { message } from '../../app/notification';
import { AppButton } from '../../components/common/AppButton';
import { AppAvatar } from '../../components/common/AppAvatar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateOnboardingData, completeOnboarding } from './onboardingSlice';
import { updateCurrentUserProfile } from '../auth/authSlice';
import { ROUTES } from '../../routes/paths';
import type { RelationshipGoal } from '../../types';
import styles from './OnboardingWizard.module.css';

const INTEREST_OPTIONS = [
  'Design', 'Coffee', 'Architecture', 'Ceramics', 'Film Photography',
  'Natural Wine', 'Bouldering', 'Vinyl Records', 'Sourdough', 'Synths',
  'Ambient Music', 'Poetry', 'Vintage Fashion', 'Trail Running', 'Botany',
  'Cinema', 'Surfing', 'Astronomy', 'Cooking', 'Modern Art'
];

const RELATIONSHIP_GOALS: RelationshipGoal[] = [
  'Long-term partner',
  'Long-term, open to short',
  'Short-term, open to long',
  'Short-term fun',
  'New friends',
  'Still figuring it out'
];

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const onboarding = useAppSelector(state => state.onboarding);
  const currentUser = useAppSelector(state => state.auth.currentUser);

  // Derive active step from URL path
  const currentPath = window.location.pathname;
  let activeStep = 1;
  if (currentPath.includes('interests')) activeStep = 2;
  else if (currentPath.includes('preferences')) activeStep = 3;
  else if (currentPath.includes('photos')) activeStep = 4;
  else if (currentPath.includes('complete')) activeStep = 5;

  // Local step state
  const [bio, setBio] = useState(onboarding.bio || currentUser?.bio || 'Product designer & coffee geek. Always hunting for minimalist architecture and good vinyl.');
  const [pronouns, setPronouns] = useState(onboarding.pronouns || 'they/them');
  const [location, setLocation] = useState(onboarding.location || 'San Francisco, CA');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    onboarding.interests.length ? onboarding.interests : ['Design', 'Coffee', 'Architecture']
  );
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal>(
    onboarding.relationshipGoal || 'Long-term partner'
  );
  const [ageRange, setAgeRange] = useState<[number, number]>(onboarding.ageRange || [21, 35]);
  const [maxDistance, setMaxDistance] = useState<number>(onboarding.maxDistanceKm || 25);
  const [photos, setPhotos] = useState<string[]>(
    onboarding.photos.length ? onboarding.photos : [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ]
  );

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < 7) {
        setSelectedInterests([...selectedInterests, interest]);
      } else {
        message.warning('You can select up to 7 passions');
      }
    }
  };

  const handleStep1Submit = () => {
    dispatch(updateOnboardingData({ bio, pronouns, location, step: 2 }));
    navigate(ROUTES.ONBOARDING_INTERESTS);
  };

  const handleStep2Submit = () => {
    if (selectedInterests.length < 3) {
      message.error('Please select at least 3 interests');
      return;
    }
    dispatch(updateOnboardingData({ interests: selectedInterests, step: 3 }));
    navigate(ROUTES.ONBOARDING_PREFERENCES);
  };

  const handleStep3Submit = () => {
    dispatch(updateOnboardingData({
      relationshipGoal,
      ageRange,
      maxDistanceKm: maxDistance,
      step: 4
    }));
    navigate(ROUTES.ONBOARDING_PHOTOS);
  };

  const handleStep4Submit = () => {
    if (photos.length === 0) {
      message.error('Please add at least 1 profile photo');
      return;
    }
    dispatch(updateOnboardingData({ photos, step: 5 }));
    navigate(ROUTES.ONBOARDING_COMPLETE);
  };

  const handleFinishOnboarding = () => {
    dispatch(completeOnboarding());
    dispatch(updateCurrentUserProfile({
      bio,
      pronouns,
      location,
      interests: selectedInterests,
      relationshipGoal,
      photos,
      avatar: photos[0]
    }));
    message.success('Your Aura profile is live!');
    navigate(ROUTES.FEED);
  };

  return (
    <div className={styles.container}>
      <header className={styles.topHeader}>
        <span className={styles.brand}>Aura</span>
        <div className={styles.progressContainer}>
          <span>Step {activeStep} of 5</span>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(activeStep / 5) * 100}%` }}
            />
          </div>
        </div>
        <Link to={ROUTES.FEED} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          Skip for now
        </Link>
      </header>

      <div className={styles.cardArea}>
        <div className={styles.wizardCard}>
          {/* Step 1: Basic Info */}
          {activeStep === 1 && (
            <div>
              <h2 className={styles.stepTitle}>Tell us about yourself</h2>
              <p className={styles.stepDesc}>Add a short intro and your pronouns so people know who you are.</p>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                  Pronouns
                </label>
                <input
                  type="text"
                  value={pronouns}
                  onChange={(e) => setPronouns(e.target.value)}
                  placeholder="e.g. she/her, they/them, he/him"
                  style={{
                    width: '100%', height: 44, borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', padding: '0 12px', fontSize: '0.9375rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                  Current Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mission District, San Francisco, CA"
                  style={{
                    width: '100%', height: 44, borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', padding: '0 12px', fontSize: '0.9375rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                  About You (Bio)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="What makes you tick? Share your favorite weekend routine or obsession..."
                  style={{
                    width: '100%', padding: 12, borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)', fontSize: '0.9375rem', fontFamily: 'inherit'
                  }}
                />
              </div>

              <div className={styles.buttonRow}>
                <div />
                <AppButton variant="primary" onClick={handleStep1Submit} icon={<ArrowRight size={18} />}>
                  Continue to Passions
                </AppButton>
              </div>
            </div>
          )}

          {/* Step 2: Interests & Passions */}
          {activeStep === 2 && (
            <div>
              <h2 className={styles.stepTitle}>What are your passions?</h2>
              <p className={styles.stepDesc}>Pick 3 to 7 interests to help us find people on your wavelength.</p>

              <div className={styles.tagGrid}>
                {INTEREST_OPTIONS.map(item => {
                  const isSelected = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      className={`${styles.tagButton} ${isSelected ? styles.tagButtonSelected : ''}`}
                      onClick={() => toggleInterest(item)}
                    >
                      {isSelected && <Check size={14} style={{ marginRight: 4, display: 'inline' }} />}
                      {item}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                Selected: <strong style={{ color: 'var(--primary)' }}>{selectedInterests.length}</strong> / 7
              </div>

              <div className={styles.buttonRow}>
                <AppButton variant="secondary" onClick={() => navigate(ROUTES.ONBOARDING_BASIC_INFO)}>
                  Back
                </AppButton>
                <AppButton variant="primary" onClick={handleStep2Submit} icon={<ArrowRight size={18} />}>
                  Continue to Preferences
                </AppButton>
              </div>
            </div>
          )}

          {/* Step 3: Preferences & Relationship Goals */}
          {activeStep === 3 && (
            <div>
              <h2 className={styles.stepTitle}>What are you looking for?</h2>
              <p className={styles.stepDesc}>Be honest about your intentions and discovery filters.</p>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8 }}>
                  Relationship Intention
                </label>
                <Select
                  value={relationshipGoal}
                  onChange={setRelationshipGoal}
                  style={{ width: '100%', height: 44 }}
                  options={RELATIONSHIP_GOALS.map(g => ({ value: g, label: g }))}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Age Range</label>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700 }} className="tabular-nums">
                    {ageRange[0]} - {ageRange[1]} years
                  </span>
                </div>
                <Slider
                  range
                  min={18}
                  max={60}
                  value={ageRange}
                  onChange={(val) => setAgeRange(val as [number, number])}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Maximum Distance</label>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 700 }} className="tabular-nums">
                    Up to {maxDistance} km
                  </span>
                </div>
                <Slider
                  min={5}
                  max={100}
                  value={maxDistance}
                  onChange={(val) => setMaxDistance(val as number)}
                />
              </div>

              <div className={styles.buttonRow}>
                <AppButton variant="secondary" onClick={() => navigate(ROUTES.ONBOARDING_INTERESTS)}>
                  Back
                </AppButton>
                <AppButton variant="primary" onClick={handleStep3Submit} icon={<ArrowRight size={18} />}>
                  Continue to Photos
                </AppButton>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {activeStep === 4 && (
            <div>
              <h2 className={styles.stepTitle}>Add profile photographs</h2>
              <p className={styles.stepDesc}>Profiles with 2 or more genuine photos get 4x more mutual connections.</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {photos.map((url, idx) => (
                  <div key={idx} style={{ position: 'relative', height: 140, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                    <img src={url} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute', bottom: 4, left: 4,
                      background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 10,
                      padding: '2px 6px', borderRadius: 4
                    }}>
                      {idx === 0 ? 'Primary' : `#${idx + 1}`}
                    </span>
                  </div>
                ))}
                {photos.length < 6 && (
                  <div
                    onClick={() => {
                      setPhotos([...photos, 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80']);
                      message.success('Photo added!');
                    }}
                    style={{
                      height: 140,
                      borderRadius: 'var(--radius-md)',
                      border: '2px dashed var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)'
                    }}
                  >
                    <Camera size={24} style={{ marginBottom: 4 }} />
                    <span style={{ fontSize: '0.75rem' }}>Add Photo</span>
                  </div>
                )}
              </div>

              <div className={styles.buttonRow}>
                <AppButton variant="secondary" onClick={() => navigate(ROUTES.ONBOARDING_PREFERENCES)}>
                  Back
                </AppButton>
                <AppButton variant="primary" onClick={handleStep4Submit} icon={<ArrowRight size={18} />}>
                  Review Profile
                </AppButton>
              </div>
            </div>
          )}

          {/* Step 5: Profile Preview & Complete */}
          {activeStep === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--primary-light)', color: 'var(--primary)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16
              }}>
                <Sparkles size={32} />
              </div>
              <h2 className={styles.stepTitle}>You’re All Set!</h2>
              <p className={styles.stepDesc}>Here is how your Aura card looks to members in your city.</p>

              {/* Card preview */}
              <div style={{
                maxWidth: 320, margin: '0 auto 24px', textAlign: 'left',
                borderRadius: 'var(--radius-xl)', overflow: 'hidden',
                background: 'white', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)'
              }}>
                <div style={{ height: 280, position: 'relative' }}>
                  <img src={photos[0]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    padding: 16, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      {currentUser?.fullName}, 26
                    </div>
                    <div style={{ fontSize: '0.8125rem', opacity: 0.9 }}>
                      {location} · {pronouns}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                    {bio}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {selectedInterests.slice(0, 4).map(i => (
                      <span key={i} style={{
                        fontSize: 11, background: 'var(--surface-subtle)',
                        padding: '2px 8px', borderRadius: 9999, color: 'var(--text-secondary)'
                      }}>
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <AppButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleFinishOnboarding}
                icon={<ArrowRight size={18} />}
              >
                Launch Aura Feed & Discovery
              </AppButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
