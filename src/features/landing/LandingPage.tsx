import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Flame,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Lock,
  MessageCircle
} from 'lucide-react';
import { AppButton } from '../../components/common/AppButton';
import { AppAvatar } from '../../components/common/AppAvatar';
import { useAppSelector } from '../../hooks';
import { ROUTES } from '../../routes/paths';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const handleExplore = () => {
    if (isAuthenticated) {
      navigate(ROUTES.DISCOVER);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  const proofAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroSplit}>
          <div className={styles.heroTextContent}>
            <div className={styles.heroKicker}>
              <Sparkles size={16} /> Connection Reimagined
            </div>
            <h1 className={styles.heroTitle}>
              Meet People. <br />
              <span className="gradient-text">Build Connections.</span> <br />
              Find Your Person.
            </h1>
            <p className={styles.heroDescription}>
              Aura blends the organic visual storytelling of modern social media with intentional, verified dating discovery. Share your life, explore mutual interests, and find meaningful romantic and social sparks.
            </p>

            <div className={styles.heroButtons}>
              <AppButton
                variant="primary"
                size="lg"
                onClick={() => navigate(ROUTES.REGISTER)}
                icon={<ArrowRight size={18} />}
              >
                Get Started Free
              </AppButton>
              <AppButton
                variant="secondary"
                size="lg"
                onClick={handleExplore}
                icon={<Compass size={18} />}
              >
                Explore People
              </AppButton>
            </div>

            <div className={styles.proofRow}>
              <div className={styles.proofAvatars}>
                {proofAvatars.map((url, i) => (
                  <div key={i} className={styles.proofAvatarItem}>
                    <AppAvatar src={url} alt={`Member ${i + 1}`} size={38} />
                  </div>
                ))}
              </div>
              <div className={styles.proofText}>
                <strong style={{ color: 'var(--text-primary)' }}>12,000+ verified members</strong>
                <br />
                Connecting through passions, creativity, and shared lifestyles.
              </div>
            </div>
          </div>

          <div className={styles.heroMediaContent}>
            <div className={styles.heroImageCard}>
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
                alt="Aura Community"
                className={styles.heroImg}
              />
              <div className={styles.floatingMatchCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <AppAvatar
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                    alt="Elena"
                    size={46}
                    isVerified
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      Elena, 25 · SF
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                      96% Shared Passions (Art & Ceramics)
                    </div>
                  </div>
                </div>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Heart size={18} fill="white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.section} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionKicker}>Seamless Experience</div>
          <h2 className={styles.sectionTitle}>How Aura Works</h2>
          <p className={styles.sectionDesc}>
            Three simple steps designed to spark authentic conversations without the superficial fatigue of endless mindless swiping.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Users size={26} />
            </div>
            <h3 className={styles.featureCardTitle}>01. Curate Your Story</h3>
            <p className={styles.featureCardDesc}>
              Upload multiple photos, share your creative interests, relationship intentions, and post updates to your social feed.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
              <Flame size={26} />
            </div>
            <h3 className={styles.featureCardTitle}>02. Intentional Discovery</h3>
            <p className={styles.featureCardDesc}>
              Discover verified profiles with customizable filters for distance, lifestyle preferences, and relationship goals.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} style={{ background: 'var(--accent-light)', color: 'var(--accent-hover)' }}>
              <MessageCircle size={26} />
            </div>
            <h3 className={styles.featureCardTitle}>03. Real Conversations</h3>
            <p className={styles.featureCardDesc}>
              Mutual matches unlock real-time simulated messaging with typing indicators, photo attachments, and shared interest prompts.
            </p>
          </div>
        </div>
      </section>

      {/* Social & Dating Highlights */}
      <section id="features" className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionKicker}>Best of Both Worlds</div>
          <h2 className={styles.sectionTitle}>Social Feed Meets Matchmaking</h2>
          <p className={styles.sectionDesc}>
            Why separate your social life from romance? Aura combines your visual feed and community connections with smart dating tools.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle} style={{ color: 'var(--primary)' }}>Stories & Live Feeds</h3>
            <p className={styles.featureCardDesc}>
              Share daily ephemeral stories, comment on friend posts, bookmark favorite photography, and discover what your city is doing today.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle} style={{ color: 'var(--secondary)' }}>Verified Profiles</h3>
            <p className={styles.featureCardDesc}>
              Photo verification badges and authentic bios protect the community so you know every profile belongs to a real person.
            </p>
          </div>

          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle} style={{ color: 'var(--accent-hover)' }}>Super Likes & Rewind</h3>
            <p className={styles.featureCardDesc}>
              Stand out with Super Likes that highlight your profile, and rewind unintentional passes with our seamless history buffer.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className={styles.section} style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionKicker}>Real Stories</div>
          <h2 className={styles.sectionTitle}>Connections That Bloomed</h2>
          <p className={styles.sectionDesc}>
            Couples and friends who connected through shared passions on Aura.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <p className={styles.quoteText}>
              “We bonded over a mutual post about vintage synthesizers in the social feed before we even realized we were matched in Discovery! Moving in together next month.”
            </p>
            <div className={styles.quoteAuthor}>
              <AppAvatar
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80"
                alt="Maya & Alex"
                size={44}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Maya & Julian</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Together 10 months · San Francisco</div>
              </div>
            </div>
          </div>

          <div className={styles.testimonialCard}>
            <p className={styles.quoteText}>
              “Aura feels human. Seeing someone’s ceramics hobby or favorite road trip playlist gives you an actual conversation starter instead of awkward small talk.”
            </p>
            <div className={styles.quoteAuthor}>
              <AppAvatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
                alt="Elena"
                size={44}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Elena & Lucas</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Together 1 year · Mission District</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Privacy Section */}
      <section id="safety" className={styles.section}>
        <div className={styles.safetyBox}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-xl)',
            background: 'var(--surface)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
            flexShrink: 0
          }}>
            <ShieldCheck size={36} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
              Safety, Privacy & Respect by Design
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
              Your peace of mind is our priority. Control profile visibility with Incognito mode, block unwanted interactions with a single tap, and browse in a verified, harassment-free environment.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="var(--success)" /> Photo Verification
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="var(--success)" /> Proactive Moderation
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Lock size={16} color="var(--secondary)" /> Private Data Controls
              </span>
            </div>
          </div>
          <div>
            <AppButton
              variant="primary"
              onClick={() => navigate(ROUTES.REGISTER)}
            >
              Join Aura Today
            </AppButton>
          </div>
        </div>
      </section>
    </div>
  );
};
