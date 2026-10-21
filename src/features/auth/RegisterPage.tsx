import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, ArrowRight } from 'lucide-react';
import { Select, App } from 'antd';
import { AppButton } from '../../components/common/AppButton';
import { useAppDispatch } from '../../hooks';
import { loginSuccess } from './authSlice';
import { updateOnboardingData } from '../onboarding/onboardingSlice';
import { ROUTES } from '../../routes/paths';
import type { Gender } from '../../types';
import styles from './AuthPages.module.css';
import { authApi } from './services/auth.api';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<Gender>('woman');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength score (0 to 4)
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (!birthDate) errs.birthDate = 'Date of birth is required';
    if (!password || password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) errs.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const response = await authApi.register({
      email: email,
      password: password,
      birthDate: birthDate,
      fullName: fullName,
      gender: gender,
      phoneNumber: phone,
      confirmPassword: confirmPassword,
    });
    if (response?.status) {
      const userData = response.data;
      dispatch(updateOnboardingData({
        fullName: userData?.user?.fullName,
        birthDate: userData?.user?.birthDate,
        gender: userData?.user?.gender,
      }));
      dispatch(loginSuccess({
        user: userData.user,
        token: userData.accessToken,
      }));
      message.success('Account created! Let’s complete your profile.');
      navigate(ROUTES.ONBOARDING_BASIC_INFO);
    } else {
      message.error(response?.error?.message || 'Unable to create your account.');
    }
    setLoading(false);
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   // Create user and start guided onboarding
    //   dispatch(updateOnboardingData({
    //     fullName,
    //     birthDate,
    //     gender
    //   }));
    //   dispatch(loginSuccess({
    //     user: {
    //       ...CURRENT_USER,
    //       fullName,
    //       gender,
    //       birthDate
    //     },
    //     token: 'auth_token_reg_' + Date.now()
    //   }));
    //   message.success('Account created! Let’s complete your profile.');
    //   navigate(ROUTES.ONBOARDING_BASIC_INFO);
    // }, 600);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.cardHeader}>
          <h1 className={styles.title}>Join Aura</h1>
          <p className={styles.subtitle}>Create your profile and start connecting</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jordan Hayes"
              className={styles.input}
            />
            {errors.fullName && <div className={styles.errorMessage}>{errors.fullName}</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@domain.com"
                className={styles.input}
              />
              {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={styles.input}
              />
              {errors.phone && <div className={styles.errorMessage}>{errors.phone}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={styles.input}
              />
              {errors.birthDate && <div className={styles.errorMessage}>{errors.birthDate}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Gender</label>
              <Select
                value={gender}
                onChange={setGender}
                style={{ width: '100%', height: 44 }}
                options={[
                  { value: 'woman', label: 'Woman' },
                  { value: 'man', label: 'Man' },
                  { value: 'non-binary', label: 'Non-binary' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Create Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className={styles.input}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Strength indicator */}
            <div className={styles.strengthBar}>
              <div className={styles.strengthSegment} style={{ background: strength >= 1 ? 'var(--error)' : 'var(--border)' }} />
              <div className={styles.strengthSegment} style={{ background: strength >= 2 ? 'var(--warning)' : 'var(--border)' }} />
              <div className={styles.strengthSegment} style={{ background: strength >= 3 ? 'var(--accent)' : 'var(--border)' }} />
              <div className={styles.strengthSegment} style={{ background: strength >= 4 ? 'var(--success)' : 'var(--border)' }} />
            </div>
            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className={styles.input}
            />
            {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8125rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ accentColor: 'var(--primary)', marginTop: 3 }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>
                I agree to the <a href="#terms" style={{ color: 'var(--primary)' }}>Terms of Service</a> and confirm I am at least 18 years old.
              </span>
            </label>
            {errors.agreeTerms && <div className={styles.errorMessage}>{errors.agreeTerms}</div>}
          </div>

          <AppButton
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            icon={<ArrowRight size={18} />}
          >
            Create Account & Continue
          </AppButton>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: 24, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
