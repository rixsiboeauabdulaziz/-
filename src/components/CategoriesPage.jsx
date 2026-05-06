
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

// Цвета для фильтра (можно расширить под свои данные)
const COLOR_OPTIONS = [
  { label: 'Белый',    value: 'white',  hex: '#f5f5f0' },
  { label: 'Серый',    value: 'gray',   hex: '#9e9e9e' },
  { label: 'Чёрный',   value: 'black',  hex: '#2a2a2a' },
  { label: 'Бежевый',  value: 'beige',  hex: '#d4b896' },
  { label: 'Коричн.',  value: 'brown',  hex: '#7b5230' },
  { label: 'Зелёный',  value: 'green',  hex: '#4a8c5c' },
  { label: 'Синий',    value: 'blue',   hex: '#3a6ea5' },
  { label: 'Красный',  value: 'red',    hex: '#b94040' },
  { label: 'Розовый',  value: 'pink',   hex: '#d47fa6' },
  { label: 'Жёлтый',   value: 'yellow', hex: '#c9a630' },
];

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Единые фильтры для обеих секций
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const debounceRef = useRef(null);

  // Загрузка категорий
  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(err => console.error('Ошибка загрузки категорий:', err))
      .finally(() => setLoading(false));
  }, []);

  // Загрузка продуктов с дебаунсом
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search, selectedCategories, minPrice, maxPrice, selectedColor]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const params = {};
      if (search) params.title = search;
      if (selectedCategories.length === 1) params.category = selectedCategories[0];
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedColor) params.color = selectedColor;
      const { data } = await axios.get('/products', { params });
      setProducts(data);
    } catch (err) {
      console.error('Ошибка загрузки продуктов:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const toggleCategory = (id) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSearch('');
    setSelectedColor('');
  };

  const hasFilters = selectedCategories.length > 0 || minPrice || maxPrice || search || selectedColor;

  // Фильтрация категорий в верхней секции
  const filteredCategories = selectedCategories.length > 0
    ? categories.filter(cat => selectedCategories.includes(cat._id))
    : categories;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f3ef', fontFamily: 'Montserrat, sans-serif' }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: '#1a1714',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1800&q=70&fit=crop)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.25,
        }} />

        <button
          onClick={() => navigate("/")}
          style={{
            position: 'absolute', top: '1.5rem', left: '2rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px',
            color: '#fff', fontSize: '0.68rem',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            gap: '0.5rem', fontFamily: 'inherit',
            padding: '0.55rem 1.2rem',
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.3)'; e.currentTarget.style.borderColor = '#c9a96e'; e.currentTarget.style.color = '#c9a96e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
        >
          ← &nbsp; На главную
        </button>

        <div style={{ position: 'relative' }}>
          <p style={{ color: '#c9a96e', letterSpacing: '0.5em', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
            ZarStone
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300, color: '#fff', marginBottom: '0.5rem',
          }}>
            Все категории
          </h1>

          {/* ПОИСК */}
          <div style={{ maxWidth: '420px', margin: '0 auto', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', opacity: 0.4 }} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Поиск по продуктам..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50px', color: '#fff',
                padding: '0.8rem 1rem 0.8rem 2.8rem',
                fontSize: '0.82rem', fontFamily: 'inherit',
                outline: 'none', transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#c9a96e'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT: sidebar + content ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 5rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

        {/* ── FILTER SIDEBAR (единый, управляет обеими секциями) ── */}
        <div style={{
          width: '220px',
          flexShrink: 0,
          background: '#fff',
          borderRadius: '4px',
          padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: '1.5rem',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1714' }}>
              Фильтры
            </span>
            {hasFilters && (
              <button onClick={resetFilters} style={{
                background: 'none', border: 'none', color: '#c9a96e',
                fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: 'inherit', padding: 0,
              }}>
                Сбросить
              </button>
            )}
          </div>

          {/* Hint */}
          <p style={{ fontSize: '0.62rem', color: '#aaa', marginBottom: '1.2rem', letterSpacing: '0.04em', lineHeight: 1.5 }}>
            Фильтры применяются к категориям и продуктам
          </p>

          {/* Categories filter */}
          <div style={{ marginBottom: '1.8rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.8rem' }}>
              Категории
            </p>
            {categories.map(cat => (
              <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.55rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => toggleCategory(cat._id)}
                  style={{ accentColor: '#c9a96e', width: '14px', height: '14px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.75rem', color: selectedCategories.includes(cat._id) ? '#c9a96e' : '#333', fontWeight: selectedCategories.includes(cat._id) ? 600 : 400, transition: 'color 0.2s' }}>
                  {cat.title}
                </span>
              </label>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f0ece6', marginBottom: '1.8rem' }} />

          {/* Color filter */}
          <div style={{ marginBottom: '1.8rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.9rem' }}>
              Цвет
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {COLOR_OPTIONS.map(color => {
                const isSelected = selectedColor === color.value;
                return (
                  <button
                    key={color.value}
                    title={color.label}
                    onClick={() => setSelectedColor(isSelected ? '' : color.value)}
                    style={{
                      width: '26px', height: '26px',
                      borderRadius: '50%',
                      background: color.hex,
                      border: isSelected ? '2px solid #c9a96e' : '2px solid #e0dcd5',
                      cursor: 'pointer',
                      outline: isSelected ? '2px solid rgba(201,169,110,0.3)' : 'none',
                      transition: 'border-color 0.2s, transform 0.15s, outline 0.2s',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                      flexShrink: 0,
                      position: 'relative',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = '#c9a96e'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = '#e0dcd5'; }}
                  />
                );
              })}
            </div>
            {selectedColor && (
              <p style={{ fontSize: '0.65rem', color: '#c9a96e', marginTop: '0.6rem', letterSpacing: '0.08em' }}>
                {COLOR_OPTIONS.find(c => c.value === selectedColor)?.label}
                <button
                  onClick={() => setSelectedColor('')}
                  style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '0.65rem', marginLeft: '0.4rem', fontFamily: 'inherit', padding: 0 }}
                >✕</button>
              </p>
            )}
          </div>

          <div style={{ borderTop: '1px solid #f0ece6', marginBottom: '1.8rem' }} />

          {/* Price filter */}
          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.8rem' }}>
              Стоимость
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="От"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={{
                  width: '50%', border: '1px solid #e8e4de',
                  borderRadius: '4px', padding: '0.5rem 0.6rem',
                  fontSize: '0.72rem', fontFamily: 'inherit',
                  outline: 'none', color: '#1a1714',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = '#e8e4de'}
              />
              <input
                type="number"
                placeholder="До"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{
                  width: '50%', border: '1px solid #e8e4de',
                  borderRadius: '4px', padding: '0.5rem 0.6rem',
                  fontSize: '0.72rem', fontFamily: 'inherit',
                  outline: 'none', color: '#1a1714',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = '#e8e4de'}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── КАТЕГОРИИ ── */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Коллекции
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, color: '#1a1714', margin: 0 }}>
                  Все категории
                </h2>
              </div>
              {selectedCategories.length > 0 && (
                <span style={{ fontSize: '0.68rem', color: '#999', letterSpacing: '0.06em' }}>
                  {filteredCategories.length} из {categories.length}
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#c9a96e', fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                Загрузка...
              </div>
            ) : filteredCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#bbb', fontSize: '0.85rem' }}>
                Категории не найдены
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.2rem',
              }}>
                {filteredCategories.map((cat, i) => (
                  <div
                    key={cat._id}
                    onClick={() => navigate(`/collections/${cat._id}`)}
                    style={{
                      background: '#fff',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      transition: 'transform 0.25s, box-shadow 0.25s',
                      animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                  >
                    <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#e8e4de', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      {cat.img ? (
                        <img src={cat.img} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span style={{ fontSize: '3rem', opacity: 0.2 }}>🪨</span>
                      )}
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(201,169,110,0)', transition: 'background 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,169,110,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,169,110,0)'}
                      />
                    </div>
                    <div style={{ padding: '1.1rem 1.3rem 1.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{cat.title}</div>
                        <div style={{ fontSize: '0.65rem', color: '#c9a96e', letterSpacing: '0.1em' }}>Смотреть коллекцию →</div>
                      </div>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', border: '1px solid #e8e4de', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e', fontSize: '0.9rem', flexShrink: 0, transition: 'background 0.2s, border-color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#c9a96e'; e.currentTarget.style.borderColor = '#c9a96e'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e8e4de'; e.currentTarget.style.color = '#c9a96e'; }}
                      >→</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── DIVIDER ── */}
          <div style={{ borderTop: '1px solid #e0dcd5', margin: '1rem 0 2.5rem' }} />

          {/* ── PRODUCTS ── */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Каталог
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 300, color: '#1a1714', margin: 0 }}>
                  Все продукты
                </h2>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#999', letterSpacing: '0.08em' }}>
                {productsLoading ? '' : `${products.length} найдено`}
              </span>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
                {selectedColor && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fff', border: '1px solid #e8e4de', borderRadius: '50px', padding: '0.3rem 0.75rem', fontSize: '0.65rem', color: '#555', letterSpacing: '0.06em' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLOR_OPTIONS.find(c => c.value === selectedColor)?.hex, border: '1px solid rgba(0,0,0,0.1)', flexShrink: 0 }} />
                    {COLOR_OPTIONS.find(c => c.value === selectedColor)?.label}
                    <button onClick={() => setSelectedColor('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '0.7rem', padding: 0, lineHeight: 1 }}>✕</button>
                  </span>
                )}
                {selectedCategories.map(catId => {
                  const cat = categories.find(c => c._id === catId);
                  return cat ? (
                    <span key={catId} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fff', border: '1px solid #e8e4de', borderRadius: '50px', padding: '0.3rem 0.75rem', fontSize: '0.65rem', color: '#555', letterSpacing: '0.06em' }}>
                      {cat.title}
                      <button onClick={() => toggleCategory(catId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '0.7rem', padding: 0, lineHeight: 1 }}>✕</button>
                    </span>
                  ) : null;
                })}
                {(minPrice || maxPrice) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#fff', border: '1px solid #e8e4de', borderRadius: '50px', padding: '0.3rem 0.75rem', fontSize: '0.65rem', color: '#555', letterSpacing: '0.06em' }}>
                    {minPrice && `от ${minPrice}`}{minPrice && maxPrice && ' '}{maxPrice && `до ${maxPrice}`} сум
                  </span>
                )}
              </div>
            )}

            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: '#c9a96e', fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                Загрузка...
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: '#bbb', fontSize: '0.85rem' }}>
                Продукты не найдены
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.2rem' }}>
                {products.map((product, i) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    style={{
                      background: '#fff', borderRadius: '4px',
                      overflow: 'hidden', cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      transition: 'transform 0.25s, box-shadow 0.25s',
                      animation: `fadeUp 0.4s ease ${i * 0.04}s both`,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.11)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                  >
                    <div style={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden', background: '#e8e4de', position: 'relative' }}>
                      {product.img ? (
                        <img src={product.img} alt={product.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.07)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '2.5rem', opacity: 0.2 }}>🪨</span>
                        </div>
                      )}
                      {/* Цвет бейдж */}
                      {product.color && (
                        <div style={{
                          position: 'absolute', top: '0.6rem', right: '0.6rem',
                          width: '18px', height: '18px', borderRadius: '50%',
                          background: COLOR_OPTIONS.find(c => c.value === product.color)?.hex || product.color,
                          border: '2px solid rgba(255,255,255,0.8)',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                        }} />
                      )}
                      {/* Категория бейдж */}
                      {product.category && (
                        <div style={{
                          position: 'absolute', top: '0.6rem', left: '0.6rem',
                          background: 'rgba(26,23,20,0.75)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '2px',
                          padding: '0.25rem 0.55rem',
                          fontSize: '0.58rem', color: '#c9a96e',
                          letterSpacing: '0.15em', textTransform: 'uppercase',
                        }}>
                          {product.category.title}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '0.9rem 1rem 1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.title}
                      </div>
                      {product.desc && (
                        <div style={{ fontSize: '0.67rem', color: '#999', marginBottom: '0.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {product.desc}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#c9a96e', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                          {product.price?.toLocaleString()} сум
                        </div>
                        {product.color && !COLOR_OPTIONS.find(c => c.value === product.color) && (
                          <div style={{ fontSize: '0.62rem', color: '#bbb', letterSpacing: '0.06em' }}>
                            {product.color}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(255,255,255,0.35); }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  );
};

export default CategoriesPage;
