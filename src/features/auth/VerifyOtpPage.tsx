import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { message } from '../../app/notification';
import { AppButton } from '../../components/common/AppButton';
import { ROUTES } from '../../routes/paths';
import styles from './AuthPages.module.css';

export const VerifyOtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || 'alexmorgan@example.com';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      message.success('Code verified successfully');
      navigate(ROUTES.RESET_PASSWORD, { state: { email } });
    }, 600);
  };

  const handleResend = () => {
    message.info('New verification code sent to ' + email);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div style={{ marginBottom: 16 }}>
          <Link to={ROUTES.FORGOT_PASSWORD} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Verify Code</h1>
          <p className={styles.subtitle}>
            We've sent a 6-digit code to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '24px 0' }}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 46,
                  height: 52,
                  textAlign: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  outline: 'none',
                  background: 'var(--surface-subtle)'
                }}
              />
            ))}
          </div>

          {error && <div className={styles.errorMessage} style={{ textAlign: 'center', marginBottom: 16 }}>{error}</div>}

          <AppButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Verify & Proceed
          </AppButton>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.8125rem', marginTop: 20, color: 'var(--text-secondary)' }}>
          Didn't receive code?{' '}
          <button
            type="button"
            onClick={handleResend}
            style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Resend Code
          </button>
        </p>
      </div>
    </div>
  );
};
