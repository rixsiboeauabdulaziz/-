import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../axios';
import { useTranslation } from 'react-i18next'; // Импорт хука

const HeartIcon = ({ filled }) => (
  <svg width="15" height="15" viewBox="0 0 24 24"
    fill={filled ? '#c9a96e' : 'none'}
    stroke={filled ? '#c9a96e' : '#bbb'}
    strokeWidth="1.8"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const S = {
  section:  { padding: '5rem 2rem', background: '#ffffff', fontFamily: "'Montserrat', sans-serif" },
  inner:    { maxWidth: '1200px', margin: '0 auto' },
  label:    { color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.4rem' },
  heading:  { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 300, color: '#1a1a1a', marginBottom: '2.5rem' },
  grid:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' },
  card:     { background: '#fff', border: '1px solid #ede9e3', borderRadius: '3px', overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' },
  imgWrap:  { width: '100%', aspectRatio: '1', background: '#f5f3ef', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img:      { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' },
  body:     { padding: '1rem 1.1rem 1.3rem' },
  title:    { fontSize: '0.72rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  articul:  { fontSize: '0.7rem', color: '#bbb', marginBottom: '0.9rem', letterSpacing: '0.04em' },
  divider:  { height: '1px', background: '#f0ece6', margin: '0.6rem 0 0.9rem' },
  btn:      { width: '100%', background: '#1a1a1a', border: 'none', borderRadius: '1px', color: '#fff', padding: '0.65rem', fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s' },
  empty:    { textAlign: 'center', color: '#bbb', padding: '4rem', fontSize: '0.8rem', letterSpacing: '0.2em' },
};

const PopularProducts = () => {
  const { t } = useTranslation(); // Инициализация
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));
  const navigate = useNavigate();

  useEffect(() => {
    instance.get('/products')
      .then(({ data }) => setProducts(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleFav = (product) => {
    const isExist = favorites.some(f => f._id === product._id);
    const newFavs = isExist
      ? favorites.filter(f => f._id !== product._id)
      : [...favorites, { _id: product._id, title: product.title, price: product.price, img: product.img }];
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const hoverCard = (e, active) => {
    e.currentTarget.style.transform   = active ? 'translateY(-6px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow   = active ? '0 16px 40px rgba(0,0,0,0.10)' : '0 2px 12px rgba(0,0,0,0.05)';
    e.currentTarget.style.borderColor = active ? '#c9a96e' : '#ede9e3';
  };

  return (
    <section style={S.section}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Cormorant+Garamond:wght@300;400&display=swap" rel="stylesheet" />
      <div style={S.inner}>
        <p style={S.label}>{t('popular.label')}</p>
        <h2 style={S.heading}>{t('popular.title')}</h2>

        {loading ? (
          <div style={S.empty}>{t('loading')}</div>
        ) : products.length === 0 ? (
          <div style={S.empty}>{t('popular.notFound')}</div>
        ) : (
          <div style={S.grid}>
            {products.map(p => {
              const isFilled = favorites.some(f => f._id === p._id);
              return (
                <div key={p._id} style={S.card} onMouseEnter={e => hoverCard(e, true)} onMouseLeave={e => hoverCard(e, false)}>
                  <div style={S.imgWrap}>
                    {p.img
                      ? <img src={p.img} alt={p.title} style={S.img}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                          onError={e => { e.target.style.display = 'none'; }} />
                      : <span style={{ fontSize: '3rem', opacity: 0.15 }}>🪨</span>
                    }
                  </div>
                  <div style={S.body}>
                    <div style={S.title}>{p.title}</div>
                    {p.article && <div style={S.articul}>{t('popular.art')}: {p.article}</div>}
                    <div style={S.divider} />
                    <button
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.65rem', color: isFilled ? '#c9a96e' : '#aaa', marginBottom: '0.9rem', cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', letterSpacing: '0.04em', transition: 'color 0.2s' }}
                      onClick={(e) => { e.stopPropagation(); toggleFav(p); }}
                    >
                      <HeartIcon filled={isFilled} />
                      {isFilled ? t('popular.inFav') : t('popular.toFav')}
                    </button>
                    <button
                      style={S.btn}
                      onClick={() => navigate(`/product/${p._id}`)}
                      onMouseEnter={e => e.target.style.background = '#c9a96e'}
                      onMouseLeave={e => e.target.style.background = '#1a1a1a'}
                    >
                      {t('popular.more')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;