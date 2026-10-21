import React from 'react';
import { CheckCircle } from 'lucide-react';

interface VerifiedBadgeProps {
  size?: number;
  showText?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 16, showText = false }) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        verticalAlign: 'middle'
      }}
      title="Verified Account (Social / Photo Verified)"
    >
      <CheckCircle size={size} fill="#38bdf8" color="white" />
      {showText && (
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7' }}>
          Verified
        </span>
      )}
    </span>
  );
};
