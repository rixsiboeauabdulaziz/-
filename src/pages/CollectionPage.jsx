import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Добавлено
import axios from '../axios';

const COLOR_OPTIONS = [
  { labelKey: 'catalog.colors.white', value: 'white', hex: '#f5f5f0' },
  { labelKey: 'catalog.colors.gray', value: 'gray', hex: '#9e9e9e' },
  { labelKey: 'catalog.colors.black', value: 'black', hex: '#2a2a2a' },
  { labelKey: 'catalog.colors.beige', value: 'beige', hex: '#d4b896' },
  { labelKey: 'catalog.colors.brown', value: 'brown', hex: '#7b5230' },
  { labelKey: 'catalog.colors.green', value: 'green', hex: '#4a8c5c' },
  { labelKey: 'catalog.colors.blue', value: 'blue', hex: '#3a6ea5' },
  { labelKey: 'catalog.colors.red', value: 'red', hex: '#b94040' },
  { labelKey: 'catalog.colors.pink', value: 'pink', hex: '#d47fa6' },
  { labelKey: 'catalog.colors.yellow', value: 'yellow', hex: '#c9a630' },
];

const CategoriesPage = () => {
  const { t } = useTranslation(); // Инициализация перевода
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const debounceRef = useRef(null);

  const currentCategory = categories.find(cat => cat._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get('/categories')
      .then(({ data }) => setCategories(data))
      .catch(err => console.error('Error loading categories:', err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchProducts, 400);
    return () => clearTimeout(debounceRef.current);
  }, [search, selectedCategories, minPrice, maxPrice, selectedColor, id]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const params = {};
      if (search) params.title = search;
      if (id) params.category = id;
      if (selectedCategories.length === 1) params.category = selectedCategories[0];
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (selectedColor) params.color = selectedColor;

      const { data } = await axios.get('/products', { params });
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
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
          onClick={() => navigate('/')}
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
            zIndex: 10
          }}
        >
          ← &nbsp; {t('catalog.backToHome')}
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
            {currentCategory ? currentCategory.title : t('catalog.heroTitle')}
          </h1>

          {/* ПОИСК */}
          <div style={{ maxWidth: '420px', margin: '0 auto', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', opacity: 0.4 }} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder={t('catalog.searchPlaceholder')}
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
            />
          </div>
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 5rem', display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

        {/* ── FILTER SIDEBAR ── */}
        <div style={{
          width: '220px', flexShrink: 0,
          background: '#fff', borderRadius: '4px',
          padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          position: 'sticky', top: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1714' }}>
              {t('catalog.filtersTitle')}
            </span>
            {hasFilters && (
              <button onClick={resetFilters} style={{
                background: 'none', border: 'none', color: '#c9a96e',
                fontSize: '0.62rem', cursor: 'pointer', letterSpacing: '0.1em',
                textTransform: 'uppercase', fontFamily: 'inherit', padding: 0,
              }}>
                {t('catalog.reset')}
              </button>
            )}
          </div>

          {/* Categories filter */}
          <div style={{ marginBottom: '1.8rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.8rem' }}>
              {t('catalog.categories')}
            </p>
            {categories.map(cat => (
              <label key={cat._id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.55rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => toggleCategory(cat._id)}
                  style={{ accentColor: '#c9a96e', width: '14px', height: '14px' }}
                />
                <span style={{
                  fontSize: '0.75rem',
                  color: selectedCategories.includes(cat._id) ? '#c9a96e' : '#333',
                  fontWeight: selectedCategories.includes(cat._id) ? 600 : 400,
                }}>
                  {cat.title}
                </span>
              </label>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #f0ece6', marginBottom: '1.8rem' }} />

          {/* Color filter */}
          <div style={{ marginBottom: '1.8rem' }}>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.9rem' }}>
              {t('catalog.color')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color.value}
                  title={t(color.labelKey)}
                  onClick={() => setSelectedColor(selectedColor === color.value ? '' : color.value)}
                  style={{
                    width: '26px', height: '26px', borderRadius: '50%', background: color.hex,
                    border: selectedColor === color.value ? '2px solid #c9a96e' : '2px solid #e0dcd5',
                    cursor: 'pointer', transform: selectedColor === color.value ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f0ece6', marginBottom: '1.8rem' }} />

          {/* Price filter */}
          <div>
            <p style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888', marginBottom: '0.8rem' }}>
              {t('catalog.price')}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number" placeholder={t('catalog.priceFrom')} value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={{ width: '50%', border: '1px solid #e8e4de', borderRadius: '4px', padding: '0.5rem', fontSize: '0.72rem' }}
              />
              <input
                type="number" placeholder={t('catalog.priceTo')} value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={{ width: '50%', border: '1px solid #e8e4de', borderRadius: '4px', padding: '0.5rem', fontSize: '0.72rem' }}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          
          {/* Коллекции */}
          <div style={{ marginBottom: '3rem' }}>
            <p style={{ color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
              {t('catalog.collectionsLabel')}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 300, marginBottom: '1.5rem' }}>
              {currentCategory ? currentCategory.title : t('catalog.heroTitle')}
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#c9a96e' }}>{t('catalog.loading')}</div>
            ) : filteredCategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>{t('catalog.notFound')}</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.2rem' }}>
                {filteredCategories.map((cat) => (
                  <div key={cat._id} onClick={() => navigate(`/collections/${cat._id}`)} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#e8e4de' }}>
                      {cat.img && <img src={cat.img} alt={cat.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{cat.title}</div>
                      <div style={{ fontSize: '0.65rem', color: '#c9a96e' }}>{t('catalog.viewCollection')} →</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ borderTop: '1px solid #e0dcd5', margin: '2rem 0' }} />

          {/* Продукты */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ color: '#c9a96e', letterSpacing: '0.4em', fontSize: '0.65rem', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {t('catalog.catalogLabel')}
                </p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '2rem', fontWeight: 300 }}>
                  {t('catalog.allProducts')}
                </h2>
              </div>
              <span style={{ fontSize: '0.72rem', color: '#999' }}>
                {!productsLoading && `${products.length} ${t('catalog.found')}`}
              </span>
            </div>

            {productsLoading ? (
              <div style={{ textAlign: 'center', padding: '5rem', color: '#c9a96e' }}>{t('catalog.loading')}</div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem' }}>{t('catalog.notFound')}</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
                {products.map((product) => (
                  <div key={product._id} onClick={() => navigate(`/product/${product._id}`)} style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ aspectRatio: '1/1', background: '#e8e4de', position: 'relative' }}>
                      {product.img && <img src={product.img} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>{product.title}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#c9a96e' }}>
                        {product.price?.toLocaleString()} {t('catalog.currency')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;