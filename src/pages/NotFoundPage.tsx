import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { AppButton } from '../components/common/AppButton';
import { ROUTES } from '../routes/paths';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        background: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
      }}>
        <Compass size={36} />
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 440, marginBottom: 24, lineHeight: 1.6 }}>
        The link you followed may be broken, or the profile or page may have moved.
      </p>

      <AppButton
        variant="primary"
        onClick={() => navigate(ROUTES.FEED)}
        icon={<ArrowLeft size={16} />}
      >
        Return to Home Feed
      </AppButton>
    </div>
  );
};
