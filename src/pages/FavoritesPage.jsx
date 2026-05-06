import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favs, setFavs] = useState([]);

  useEffect(() => {
    setFavs(JSON.parse(localStorage.getItem('favorites') || '[]'));
  }, []);

  const remove = (id) => {
    const newFavs = favs.filter(f => f._id !== id);
    setFavs(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ef', fontFamily: "'Montserrat', sans-serif", padding: '3rem 2rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;500&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontSize: '0.65rem', color: '#c9a96e', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Ваш список</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2.5rem', fontWeight: 300, color: '#1a1a1a', marginBottom: '2.5rem' }}>
          Избранное {favs.length > 0 && <span style={{ fontSize: '1.2rem', color: '#bbb' }}>({favs.length})</span>}
        </h1>

        {favs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#ccc', fontSize: '0.85rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>♡</div>
            Список избранного пуст
            <br /><br />
            <button onClick={() => navigate('/collections')}
              style={{ background: '#d4a853', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.8rem 2rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {favs.map(p => (
              <div key={p._id} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '100%', aspectRatio: '1', background: '#e8e4de', cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => navigate(`/product/${p._id}`)}>
                  {p.img
                    ? <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.3 }}>🪨</div>}
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#333', marginBottom: '0.4rem', cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${p._id}`)}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#c9a96e', fontWeight: 600, marginBottom: '0.8rem' }}>
                    {p.price?.toLocaleString('ru-RU')} UZS
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => navigate(`/product/${p._id}`)}
                      style={{ flex: 1, background: '#d4a853', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.5rem', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit' }}>
                      Открыть
                    </button>
                    <button onClick={() => remove(p._id)}
                      style={{ background: 'none', border: '1px solid #e0dbd2', borderRadius: '50px', color: '#bbb', padding: '0.5rem 0.8rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;