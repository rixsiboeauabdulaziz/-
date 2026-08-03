import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Импорт хука

const Contacts = () => {
  const { t } = useTranslation(); // Инициализация
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.1 });
    const el = document.getElementById('contacts-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Формируем массив данных с использованием переводов
  const items = [
    { icon: '📍', label: t('contacts.address'), value: t('contacts.addressValue') },
    { icon: '📞', label: t('contacts.phone'), value: '+7 (495) 123-45-67' },
    { icon: '✉️', label: t('contacts.email'), value: 'info@zarstone.ru' },
    { icon: '🕐', label: t('contacts.hours'), value: t('contacts.hoursValue') },
  ];

  return (
    <section id="contacts-section" style={{ padding: '6rem 2rem', background: '#ffffff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.7s', textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            {t('contacts.label')}
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1a1a1a' }}>
            {t('contacts.title')}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem', opacity: visible ? 1 : 0, transition: 'all 0.7s 0.2s' }}>
          {items.map((c) => (
            <div
              key={c.label}
              style={{
                padding: '2rem',
                border: '1px solid #ede9e3',
                borderRadius: '3px',
                textAlign: 'center',
                background: '#faf8f5',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'border-color 0.3s, transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#c9a96e';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#ede9e3';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
              }}
            >
              <div style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{c.icon}</div>
              <div style={{ color: '#c9a96e', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                {c.label}
              </div>
              <div style={{ color: '#555', fontSize: '0.85rem' }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contacts;