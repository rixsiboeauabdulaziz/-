import React, { useState, useEffect, useRef } from 'react';

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

const reasons = [
  { icon: '◈', title: 'Прямые поставки', desc: 'Работаем напрямую с карьерами и заводами — без посредников и лишних наценок.' },
  { icon: '◉', title: 'Точные размеры', desc: 'Резка и обработка по вашим чертежам. Отклонение не более 0.5 мм.' },
  { icon: '◐', title: 'Доставка по РФ', desc: 'Собственный транспорт и надёжные партнёры. Доставляем в любой регион.' },
  { icon: '◎', title: 'Контроль качества', desc: 'Каждая партия проверяется по ГОСТ. Сертификаты на всю продукцию.' },
];

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
        transition2: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
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
  const [headRef, headVisible] = useInView();

  return (
    <section style={{ background: '#F5F0E8', padding: '7rem 2.5rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
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
              Наши преимущества
            </p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 400, color: '#0D0B09',
              lineHeight: 1.15,
            }}>
              Почему<br />
              <em style={{ color: '#B8874A' }}>выбирают нас</em>
            </h2>
          </div>
          <p style={{
            color: '#8C8680', fontSize: '0.85rem',
            maxWidth: '260px', textAlign: 'right',
            lineHeight: 1.75, fontWeight: 300,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Двадцать лет мы доказываем качество не словами, а каждым реализованным проектом
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '2px',
          background: 'rgba(0,0,0,0.06)',
        }}>
          {reasons.map((r, i) => (
            <Card key={r.title} r={r} i={i} />
          ))}
        </div>

        {/* Bottom strip */}
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
          {[['5 000+', 'проектов'], ['47', 'регионов'], ['20', 'лет']].map(([val, lab]) => (
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
            Работаем с частными клиентами, архитекторами и крупными подрядчиками
          </p>
        </div>

      </div>
    </section>
  );
};

export default WhyUs;
