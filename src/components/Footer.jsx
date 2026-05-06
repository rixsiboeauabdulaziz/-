import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const links = [
    { label: 'Главная', path: '/home' },
    { label: 'Коллекции', path: '/collections' },
    { label: 'О компании', path: '/about' },
    { label: 'Оплата и доставка', path: '/delivery' },
    { label: 'Контакты', path: '/contacts' },
  ];

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '3rem 2rem', background: '#0a0a0a' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ color: '#b48c5a', fontSize: '1.4rem', fontWeight: 300, letterSpacing: '0.4em', fontFamily: "'Cormorant Garamond', Georgia, serif", marginBottom: '0.4rem' }}>
            ZARSTONE
          </div>
          <div style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Керамика и гранит с 2005 года</div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              style={{ background: 'none', border: 'none', color: '#555', fontSize: '0.8rem', cursor: 'pointer', letterSpacing: '0.05em', transition: 'color 0.3s' }}
              onMouseEnter={e => e.target.style.color = '#b48c5a'}
              onMouseLeave={e => e.target.style.color = '#555'}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div style={{ color: '#333', fontSize: '0.75rem' }}>© 2026 ZarStone. Все права защищены.</div>
      </div>
    </footer>
  );
};

export default Footer;
