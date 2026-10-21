import React, { useState } from 'react';
import { Sparkles, Check, Crown, Flame, RotateCcw, Eye, Zap } from 'lucide-react';
import { message } from '../../app/notification';
import { AppButton } from '../../components/common/AppButton';
import { AppModal } from '../../components/common/AppModal';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { upgradePremium, cancelPremium } from '../settings/settingsSlice';
import styles from './PremiumPage.module.css';

export const PremiumPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.settings);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'aura_plus' | 'aura_elite'>('aura_elite');

  const handleOpenCheckout = (plan: 'aura_plus' | 'aura_elite') => {
    setSelectedPlan(plan);
    setCheckoutModalOpen(true);
  };

  const handleConfirmUpgrade = () => {
    dispatch(upgradePremium(selectedPlan));
    setCheckoutModalOpen(false);
    message.success(`🎉 You're now upgraded to ${selectedPlan === 'aura_elite' ? 'Aura Elite' : 'Aura Plus'}!`);
  };

  const handleCancel = () => {
    dispatch(cancelPremium());
    message.info('Subscription cancelled');
  };

  return (
    <div className={styles.container}>
      <div className={styles.kicker}>
        <Crown size={15} /> Level Up Your Connections
      </div>
      <h1 className={styles.title}>Unlock Aura Premium</h1>
      <p className={styles.subtitle}>
        Cut through the noise, browse at your own pace, and connect with people who are genuinely interested in you.
      </p>

      {/* Monthly vs Annual Toggle */}
      <div className={styles.billingToggle}>
        <button
          className={`${styles.toggleBtn} ${billingCycle === 'monthly' ? styles.toggleActive : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`${styles.toggleBtn} ${billingCycle === 'annual' ? styles.toggleActive : ''}`}
          onClick={() => setBillingCycle('annual')}
        >
          Annual (Save 35%)
        </button>
      </div>

      {/* Plans */}
      <div className={styles.plansGrid}>
        {/* Aura Plus */}
        <div className={styles.planCard}>
          <div>
            <div className={styles.planName}>Aura Plus</div>
            <div className={styles.planPrice}>
              <span className="tabular-nums">
                {billingCycle === 'annual' ? '$9.99' : '$14.99'}
              </span>
              <span className={styles.period}>/ month</span>
            </div>

            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span>Unlimited profile likes</span>
              </div>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span>Rewind accidental passes</span>
              </div>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span>Advanced age & distance filters</span>
              </div>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span>Browse with zero ads</span>
              </div>
            </div>
          </div>

          <AppButton
            variant="secondary"
            fullWidth
            onClick={() => handleOpenCheckout('aura_plus')}
          >
            {settings.premiumTier === 'aura_plus' ? 'Current Plan' : 'Select Plus'}
          </AppButton>
        </div>

        {/* Aura Elite */}
        <div className={`${styles.planCard} ${styles.featuredCard}`}>
          <div className={styles.featuredBadge}>Most Popular</div>
          <div>
            <div className={styles.planName} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={20} color="var(--primary)" /> Aura Elite
            </div>
            <div className={styles.planPrice}>
              <span className="tabular-nums">
                {billingCycle === 'annual' ? '$19.99' : '$29.99'}
              </span>
              <span className={styles.period}>/ month</span>
            </div>

            <div className={styles.featureList}>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span><strong>Everything in Aura Plus</strong></span>
              </div>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span><strong>See who already liked you</strong></span>
              </div>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span>5 Super Likes every day</span>
              </div>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span>Incognito stealth browsing</span>
              </div>
              <div className={styles.featureItem}>
                <Check size={18} color="var(--primary)" />
                <span>Priority queue in Discovery</span>
              </div>
            </div>
          </div>

          <AppButton
            variant="primary"
            fullWidth
            onClick={() => handleOpenCheckout('aura_elite')}
          >
            {settings.premiumTier === 'aura_elite' ? 'Current Plan' : 'Upgrade to Elite'}
          </AppButton>
        </div>
      </div>

      {settings.isPremium && (
        <div style={{ marginTop: 32, padding: 16, background: 'var(--surface-subtle)', borderRadius: 'var(--radius-lg)' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            You are currently subscribed to <strong>{settings.premiumTier === 'aura_elite' ? 'Aura Elite' : 'Aura Plus'}</strong>.{' '}
          </span>
          <button
            onClick={handleCancel}
            style={{ color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}
          >
            Cancel Subscription
          </button>
        </div>
      )}

      {/* Mock Demo Checkout Modal */}
      <AppModal
        open={checkoutModalOpen}
        onCancel={() => setCheckoutModalOpen(false)}
        width={460}
      >
        <div style={{ textAlign: 'center', padding: '16px 8px' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <Crown size={28} />
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)' }}>
            Confirm Mock Upgrade
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
            Upgrading to <strong>{selectedPlan === 'aura_elite' ? 'Aura Elite' : 'Aura Plus'}</strong> ({billingCycle} billing). This is a demonstration flow; no real payment will be charged.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AppButton variant="primary" fullWidth onClick={handleConfirmUpgrade}>
              Confirm Demo Activation
            </AppButton>
            <AppButton variant="ghost" fullWidth onClick={() => setCheckoutModalOpen(false)}>
              Back
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
};
