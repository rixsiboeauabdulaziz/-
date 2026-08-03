import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const useInView = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
};

const Card = ({ r, i }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.9s ease ${i * 0.1}s, transform 0.9s ease ${i * 0.1}s`,
        background: hovered ? '#fff' : '#faf8f5',
        borderTop: `2px solid ${hovered ? '#B8874A' : 'rgba(184,135,74,0.25)'}`,
        padding: '2.5rem 2rem',
        cursor: 'default',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.09)' : '0 2px 16px rgba(0,0,0,0.04)',
        transitionProperty: 'background, box-shadow, border-color',
        transitionDuration: '0.3s'
      }}
    >
      <div style={{ fontSize: '1.6rem', color: '#B8874A', marginBottom: '1.4rem', lineHeight: 1 }}>
        {r.icon}
      </div>
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.05rem', fontWeight: 400,
        color: '#0D0B09', marginBottom: '0.9rem',
        letterSpacing: '0.01em',
      }}>
        {r.title}
      </h3>
      <p style={{
        color: '#8C8680', fontSize: '0.85rem',
        lineHeight: 1.85, fontWeight: 300,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {r.desc}
      </p>
      <div style={{
        width: hovered ? '36px' : '20px',
        height: '2px',
        background: '#B8874A',
        marginTop: '1.8rem',
        borderRadius: '1px',
        transition: 'width 0.4s ease',
      }} />
    </div>
  );
};

const WhyUs = () => {
  const { t } = useTranslation();
  const [headRef, headVisible] = useInView();

  const reasonsIcons = ['◈', '◉', '◐', '◎'];
  
  // Получаем данные. Если t() вернул не массив, используем пустой массив, чтобы .map не выдавал ошибку
  const rawReasons = t('whyUs.reasons', { returnObjects: true });
  const reasonsArray = Array.isArray(rawReasons) ? rawReasons : [];

  const translatedReasons = reasonsArray.map((item, idx) => ({
    ...item,
    icon: reasonsIcons[idx] || '◈'
  }));

  return (
    <section style={{ background: '#F5F0E8', padding: '7rem 2.5rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div
          ref={headRef}
          style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'all 0.9s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '4rem',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <p style={{
              color: '#B8874A', letterSpacing: '0.45em',
              fontSize: '0.6rem', textTransform: 'uppercase',
              marginBottom: '0.7rem', fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {t('whyUs.label')}
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 400, color: '#0D0B09',
              lineHeight: 1.15,
            }}>
              {t('whyUs.titlePart1')}<br />
              <em style={{ color: '#B8874A' }}>{t('whyUs.titlePart2')}</em>
            </h2>
          </div>
          <p style={{
            color: '#8C8680', fontSize: '0.85rem',
            maxWidth: '260px', textAlign: 'right',
            lineHeight: 1.75, fontWeight: 300,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t('whyUs.headerDesc')}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '2px',
          background: 'rgba(0,0,0,0.06)',
        }}>
          {translatedReasons.map((r, i) => (
            <Card key={i} r={r} i={i} />
          ))}
        </div>

        <div style={{
          marginTop: '4rem',
          padding: '2.5rem 3rem',
          background: '#0D0B09',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          {[
            ['5 000+', t('whyUs.stats.projects')], 
            ['47', t('whyUs.stats.regions')], 
            ['20', t('whyUs.stats.years')]
          ].map(([val, lab]) => (
            <div key={lab} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                fontWeight: 400, color: '#B8874A', lineHeight: 1,
              }}>{val}</div>
              <div style={{
                fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                marginTop: '0.3rem', fontFamily: "'DM Sans', sans-serif",
              }}>{lab}</div>
            </div>
          ))}
          <div style={{ width: '1px', height: '40px', background: 'rgba(184,135,74,0.3)' }} />
          <p style={{
            color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem',
            maxWidth: '280px', lineHeight: 1.75, fontWeight: 300,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {t('whyUs.footerDesc')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;