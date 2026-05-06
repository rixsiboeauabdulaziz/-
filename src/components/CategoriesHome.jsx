import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

const Categories = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.1 }
    );
    const el = document.getElementById('categories-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="categories-section" style={{ padding: '6rem 2rem', background: '#f9f7f4' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.7s' }}>
          <p style={{ color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Каталог
          </p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, marginBottom: '3rem', fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1a1a1a' }}>
            Категории
          </h2>
        </div>

        {loading ? (
          <p style={{ color: '#aaa', letterSpacing: '0.2em', fontSize: '0.8rem' }}>Загрузка...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, i) => (
              <div
                key={cat._id}
                onClick={() => navigate(`/collections/${cat._id}`)}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(30px)',
                  transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s, border-color 0.25s, box-shadow 0.25s`,
                  background: '#ffffff',
                  border: '1px solid #ede9e3',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#c9a96e';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.09)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#ede9e3';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#f5f3ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cat.img ? (
                    <img
                      src={cat.img}
                      alt={cat.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <span style={{ fontSize: '2.5rem', opacity: 0.2 }}>🪨</span>
                  )}
                </div>
                <div style={{ padding: '1rem 1.2rem', textAlign: 'center', borderTop: '1px solid #f0ece6' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {cat.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
