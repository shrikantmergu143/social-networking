import React, { useState } from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { Slider, Switch, Select } from 'antd';
import { AppDrawer } from '../../components/common/AppDrawer';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateFilters, resetFilters } from './discoverySlice';
import type { Gender, RelationshipGoal } from '../../types';

interface DatingFiltersDrawerProps {
  open: boolean;
  onClose: () => void;
}

const GOAL_OPTIONS: RelationshipGoal[] = [
  'Long-term partner',
  'Long-term, open to short',
  'Short-term, open to long',
  'Short-term fun',
  'New friends',
  'Still figuring it out'
];

export const DatingFiltersDrawer: React.FC<DatingFiltersDrawerProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.discovery.filters);

  const [localAgeRange, setLocalAgeRange] = useState<[number, number]>(filters.ageRange);
  const [localDistance, setLocalDistance] = useState<number>(filters.maxDistanceKm);
  const [localGenders, setLocalGenders] = useState<Gender[]>(filters.genderPreference);
  const [localIntentions, setLocalIntentions] = useState<RelationshipGoal[]>(filters.intentions);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(filters.verifiedOnly);
  const [onlineOnly, setOnlineOnly] = useState<boolean>(filters.onlineOnly);

  const handleApply = () => {
    dispatch(updateFilters({
      ageRange: localAgeRange,
      maxDistanceKm: localDistance,
      genderPreference: localGenders,
      intentions: localIntentions,
      verifiedOnly,
      onlineOnly
    }));
    onClose();
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalAgeRange([21, 35]);
    setLocalDistance(25);
    setLocalGenders(['woman', 'man', 'non-binary']);
    setLocalIntentions(['Long-term partner', 'Long-term, open to short']);
    setVerifiedOnly(false);
    setOnlineOnly(false);
  };

  return (
    <AppDrawer
      title="Discovery Filters"
      open={open}
      onClose={onClose}
      width={380}
      extra={
        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Gender */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            Interested in Meeting
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['woman', 'man', 'non-binary'] as Gender[]).map(g => {
              const active = localGenders.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    if (active) {
                      if (localGenders.length > 1) {
                        setLocalGenders(localGenders.filter(item => item !== g));
                      }
                    } else {
                      setLocalGenders([...localGenders, g]);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: active ? 'var(--primary)' : 'var(--border)',
                    background: active ? 'var(--primary-light)' : 'var(--surface)',
                    color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'capitalize'
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Range Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Age Range
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }} className="tabular-nums">
              {localAgeRange[0]} - {localAgeRange[1]}
            </span>
          </div>
          <Slider
            range
            min={18}
            max={65}
            value={localAgeRange}
            onChange={(val) => setLocalAgeRange(val as [number, number])}
          />
        </div>

        {/* Distance Slider */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Max Distance
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }} className="tabular-nums">
              Up to {localDistance} km
            </span>
          </div>
          <Slider
            min={2}
            max={100}
            value={localDistance}
            onChange={(val) => setLocalDistance(val as number)}
          />
        </div>

        {/* Intentions */}
        <div>
          <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            Relationship Intentions
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {GOAL_OPTIONS.map(goal => {
              const checked = localIntentions.includes(goal);
              return (
                <label
                  key={goal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: checked ? 'var(--surface-subtle)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{goal}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      if (checked) {
                        setLocalIntentions(localIntentions.filter(i => i !== goal));
                      } else {
                        setLocalIntentions([...localIntentions, goal]);
                      }
                    }}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Verified Profiles Only
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Only see members with checked verification
              </div>
            </div>
            <Switch checked={verifiedOnly} onChange={setVerifiedOnly} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Online Members Only
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Currently active on Aura
              </div>
            </div>
            <Switch checked={onlineOnly} onChange={setOnlineOnly} />
          </div>
        </div>

        {/* Apply CTA */}
        <div style={{ marginTop: 12 }}>
          <AppButton variant="primary" fullWidth onClick={handleApply}>
            Apply Filters
          </AppButton>
        </div>
      </div>
    </AppDrawer>
  );
};
