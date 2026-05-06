import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

      {/* ФОНОВОЕ ИЗОБРАЖЕНИЕ */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1800&q=85&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: 'scale(1.05)',
        transition: 'transform 8s ease',
      }} />

      {/* ТЁМНЫЙ ОВЕРЛЕЙ — чтобы текст читался */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.45) 60%, rgba(10,8,6,0.15) 100%)',
      }} />

      {/* ЗОЛОТАЯ ПОЛОСКА СЛЕВА */}
      <div style={{
        position: 'absolute', left: 0, top: '15%', bottom: '15%',
        width: '3px',
        background: 'linear-gradient(to bottom, transparent, #c9a96e, transparent)',
      }} />

      {/* КОНТЕНТ */}
      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 0 3.5rem' }}>
        <p style={{
          color: '#c9a96e', letterSpacing: '0.5em', fontSize: '0.65rem',
          textTransform: 'uppercase', marginBottom: '1.5rem',
          animation: 'fadeUp 0.8s ease 0.2s both',
          fontFamily: 'Montserrat, sans-serif',
        }}>
          ZarStone · Керамика и Гранит
        </p>

        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 6.5rem)',
          fontWeight: 300, lineHeight: 1.05,
          marginBottom: '2.5rem',
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          animation: 'fadeUp 0.8s ease 0.4s both',
          color: '#fff',
        }}>
          Природная<br />
          <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>красота</span><br />
          в каждой плите
        </h1>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', animation: 'fadeUp 0.8s ease 0.6s both' }}>
          <button
            onClick={() => navigate('/collections')}
            style={{
              background: '#c9a96e', color: '#fff', border: 'none',
              padding: '1rem 2.5rem', fontSize: '0.78rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s',
              borderRadius: '50px',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
            }}
            onMouseEnter={e => e.target.style.background = '#b8913e'}
            onMouseLeave={e => e.target.style.background = '#c9a96e'}
          >
            Смотреть каталог
          </button>
          <button
            onClick={() => navigate('/contacts')}
            style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.35)',
              padding: '1rem 2.5rem', fontSize: '0.78rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s',
              borderRadius: '50px',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 500,
            }}
            onMouseEnter={e => { e.target.style.borderColor = '#c9a96e'; e.target.style.color = '#c9a96e'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.35)'; e.target.style.color = '#fff'; }}
          >
            Связаться с нами
          </button>
        </div>
      </div>

      {/* СКРОЛЛ ИНДИКАТОР */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
        animation: 'bounce 2s infinite',
      }}>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', fontFamily: 'Montserrat, sans-serif' }}>scroll</span>
        <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, rgba(201,169,110,0.8), transparent)' }} />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(10px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;