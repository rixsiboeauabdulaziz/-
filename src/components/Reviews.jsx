import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Reviews = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    const el = document.getElementById('reviews-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 1. Получаем данные через returnObjects
  const rawItems = t('reviewsSection.items', { returnObjects: true });
  
  // 2. Проверяем, что пришел именно массив. Если нет — создаем пустой массив.
  const itemsArray = Array.isArray(rawItems) ? rawItems : [];

  const starsMap = [5, 5, 4];
  const translatedReviews = itemsArray.map((rev, i) => ({
    ...rev,
    stars: starsMap[i] || 5
  }));

  return (
    <section id="reviews-section" style={{ padding: '6rem 2rem', background: '#0d0d0d' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.7s' }}>
          <p style={{ color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {t('reviewsSection.label')}
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '3rem', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#f0ebe3' }}>
            {t('reviewsSection.title')}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {translatedReviews.map((rev, i) => (
            <div
              key={i} // Используем индекс, если name может дублироваться
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(30px)',
                transition: `all 0.6s ease ${i * 0.15}s, border-color 0.25s`,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: '2px solid rgba(201,169,110,0.35)',
                padding: '2rem',
                borderRadius: '2px',
              }}
              onMouseEnter={e => e.currentTarget.style.borderLeftColor = '#c9a96e'}
              onMouseLeave={e => e.currentTarget.style.borderLeftColor = 'rgba(201,169,110,0.35)'}
            >
              <div style={{ color: '#c9a96e', fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>
                {'★'.repeat(rev.stars || 5)}{'☆'.repeat(5 - (rev.stars || 5))}
              </div>
              <p style={{ color: '#aaa', lineHeight: 1.9, fontFamily: 'Georgia, serif', marginBottom: '1.5rem', fontSize: '0.88rem' }}>
                "{rev.text}"
              </p>
              <div>
                <div style={{ color: '#c9a96e', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em' }}>{rev.name}</div>
                <div style={{ color: '#666', fontSize: '0.72rem', marginTop: '0.2rem', letterSpacing: '0.05em' }}>{rev.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;