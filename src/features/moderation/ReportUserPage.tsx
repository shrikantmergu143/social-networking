import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flag, CheckCircle, ShieldAlert } from 'lucide-react';
import { message } from '../../app/notification';
import { AppButton } from '../../components/common/AppButton';
import { AppAvatar } from '../../components/common/AppAvatar';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { blockUser } from '../connections/connectionsSlice';
import { ROUTES } from '../../routes/paths';

const REPORT_REASONS = [
  'Inappropriate or explicit photos',
  'Harassment or offensive language',
  'Spam, advertising or commercial selling',
  'Fake profile or impersonating someone else',
  'Underage account',
  'Other violation of community guidelines'
];

export const ReportUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const profiles = useAppSelector(state => state.discovery.profiles);
  const targetUser = profiles.find(p => p.id === userId) || profiles[0];

  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alsoBlock && targetUser) {
      dispatch(blockUser(targetUser));
    }
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '16px 0' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: 16
        }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-card)'
      }}>
        {!submitted ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <AppAvatar src={targetUser.avatar} alt={targetUser.fullName} size={48} />
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 2 }}>
                  Report {targetUser.fullName}
                </h1>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Help keep the Aura community safe and respectful
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: 8 }}>
                  Why are you reporting this profile?
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {REPORT_REASONS.map(reason => {
                    const isSelected = selectedReason === reason;
                    return (
                      <label
                        key={reason}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                          background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: 'var(--text-primary)'
                        }}
                      >
                        <input
                          type="radio"
                          name="reason"
                          checked={isSelected}
                          onChange={() => setSelectedReason(reason)}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span>{reason}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, marginBottom: 6 }}>
                  Additional Details (Optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  placeholder="Provide context or specific comments..."
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={alsoBlock}
                    onChange={(e) => setAlsoBlock(e.target.checked)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>Also block <strong>{targetUser.fullName}</strong> from contacting me</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <AppButton variant="ghost" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </AppButton>
                <AppButton variant="danger" type="submit">
                  Submit Report
                </AppButton>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 8px' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}>
              <CheckCircle size={32} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
              Report Received
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 24 }}>
              Thank you for keeping Aura safe. Our moderation team has logged this incident report for review.
              {alsoBlock && ` ${targetUser.fullName} has been blocked from your feed.`}
            </p>
            <AppButton variant="primary" onClick={() => navigate(ROUTES.FEED)}>
              Return to Feed
            </AppButton>
          </div>
        )}
      </div>
    </div>
  );
};
