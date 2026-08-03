import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- ВСПОМОГАТЕЛЬНЫЕ ХУКИ ---
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const useCounter = (end, duration = 2000, startTrigger = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startTrigger) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, startTrigger]);
  return count;
};

// --- КОНСТАНТЫ СТИЛЕЙ ---
const COLORS = {
  GOLD: '#B8874A',
  DARK: '#0D0B09',
  CREAM: '#F5F0E8',
  WARM_GRAY: '#8C8680',
  WHITE: '#FFFFFF'
};

// --- ВНУТРЕННИЕ КОМПОНЕНТЫ ---
const Reveal = ({ children, delay = 0, x = 0, y = 32, className = '', style = {} }) => {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translate(0, 0)' : `translate(${x}px, ${y}px)`,
        transition: `opacity 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}s, transform 1.2s cubic-bezier(0.215, 0.61, 0.355, 1) ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const StatItem = ({ data, isLast }) => {
  const [ref, vis] = useInView();
  const count = useCounter(data.value, 2500, vis);
  
  return (
    <div
      ref={ref}
      style={{
        padding: '4rem 2rem',
        borderRight: isLast ? 'none' : `1px solid rgba(0,0,0,0.06)`,
        textAlign: 'center'
      }}
    >
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.5rem', color: COLORS.DARK, lineHeight: 1 }}>
        {count.toLocaleString()}{data.suffix}
      </div>
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '1rem', fontWeight: 600 }}>
        {data.label}
      </div>
      <div style={{ fontSize: '0.7rem', color: COLORS.WARM_GRAY, marginTop: '0.4rem' }}>{data.sub}</div>
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---
const About = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const STATS_DATA = [
    { value: 20, suffix: '+', label: t('about.stats.years'), sub: t('about.stats.yearsSub') },
    { value: 5000, suffix: '+', label: t('about.stats.projects'), sub: t('about.stats.projectsSub') },
    { value: 120, suffix: '', label: t('about.stats.types'), sub: t('about.stats.typesSub') },
    { value: 47, suffix: '', label: t('about.stats.regions'), sub: t('about.stats.regionsSub') },
  ];

  return (
    <div style={{ background: COLORS.CREAM, color: COLORS.DARK, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-btn { transition: all 0.4s ease; cursor: pointer; border: 1px solid ${COLORS.GOLD}; background: transparent; color: ${COLORS.GOLD}; }
        .hero-btn:hover { background: ${COLORS.GOLD}; color: white; transform: translateY(-2px); }
        @media (max-width: 768px) { 
            .grid-adaptive { grid-template-columns: 1fr !important; gap: 3rem !important; } 
            .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <section style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1800)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `scale(1.1) translateY(${scrollY * 0.15}px)`,
          transition: 'transform 0.1s linear'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,11,9,0.85) 0%, rgba(13,11,9,0.2) 100%)' }} />
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
          <Reveal y={40}>
            <span style={{ color: COLORS.GOLD, letterSpacing: '0.6em', textTransform: 'uppercase', fontSize: '0.7rem', display: 'block', marginBottom: '1.5rem' }}>
              {t('about.heroSubtitle')}
            </span>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: 'clamp(3rem, 8vw, 6rem)', 
              color: COLORS.WHITE, 
              lineHeight: 1.1, 
              marginBottom: '2rem' 
            }}>
              {t('about.heroTitle')} <br /> 
              <span style={{ fontStyle: 'italic', color: COLORS.GOLD }}>{t('about.heroTitleItalic')}</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '550px', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '3rem', fontWeight: 300 }}>
              {t('about.heroDesc')}
            </p>
            <button onClick={() => navigate('/collections')} className="hero-btn" style={{ padding: '1.2rem 2.8rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              {t('hero.catalogBtn')}
            </button>
          </Reveal>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section style={{ background: COLORS.WHITE, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', maxWidth: '1400px', margin: '0 auto' }}>
          {STATS_DATA.map((s, i) => (
            <StatItem key={i} data={s} isLast={i === 3} />
          ))}
        </div>
      </section>

      {/* --- STORY / DETAILS --- */}
      <section style={{ padding: '10rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <div className="grid-adaptive" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '6rem', alignItems: 'center' }}>
          <Reveal x={-40}>
            <div style={{ position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200" 
                alt="Production" 
                style={{ width: '100%', height: '650px', objectFit: 'cover', borderRadius: '4px' }} 
              />
              <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '200px', height: '200px', background: COLORS.GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                <span style={{ color: COLORS.WHITE, fontSize: '0.8rem', letterSpacing: '0.1em', fontWeight: 500 }}>
                    QUALITY GUARANTEED
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} x={40}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', marginBottom: '2.5rem', lineHeight: 1.2 }}>
              {t('about.storyTitle')}
            </h2>
            <p style={{ color: COLORS.WARM_GRAY, fontSize: '1.05rem', lineHeight: 2, marginBottom: '2.5rem' }}>
              {t('about.storyDesc')}
            </p>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {t('about.features', { returnObjects: true }).map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.95rem' }}>
                  <div style={{ width: '30px', height: '1px', background: COLORS.GOLD }} />
                  {text}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* --- QUOTE SECTION --- */}
      <section style={{ height: '60vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800)`,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }} />
        <Reveal style={{ position: 'relative', textAlign: 'center', maxWidth: '900px', padding: '0 30px' }}>
          <h3 style={{ 
            fontFamily: "'Playfair Display', serif", 
            color: COLORS.WHITE, 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            fontWeight: 400, 
            fontStyle: 'italic', 
            lineHeight: 1.5 
          }}>
            «{t('about.quote')}»
          </h3>
        </Reveal>
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: '10rem 5%', textAlign: 'center', background: COLORS.DARK }}>
        <Reveal y={30}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: COLORS.WHITE, marginBottom: '1.5rem' }}>
            {t('about.ctaTitle')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '3.5rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.8rem' }}>
            {t('about.ctaSubtitle')}
          </p>
          <button 
            onClick={() => navigate('/contacts')}
            style={{ 
              background: COLORS.GOLD, color: COLORS.WHITE, border: 'none', 
              padding: '1.3rem 4rem', fontSize: '0.8rem', letterSpacing: '0.3em', 
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: '50px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {t('about.ctaBtn')}
          </button>
        </Reveal>
      </section>
    </div>
  );
};

export default About;