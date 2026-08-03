import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import instance from '../axios';
 
const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24"
    fill={filled ? '#c9a96e' : 'none'}
    stroke={filled ? '#c9a96e' : 'currentColor'} strokeWidth="1.8">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
 
const s = {
  page: { minHeight: '100vh', background: '#f5f3ef', fontFamily: "'Montserrat', sans-serif", color: '#2a2a2a' },
  nav: { padding: '1.2rem 2.5rem', background: '#fff', borderBottom: '1px solid #e8e4de', display: 'flex', alignItems: 'center' },
  backBtn: { background: 'none', border: 'none', color: '#aaa', fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'inherit', transition: 'color 0.2s' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' },
  imgWrap: { position: 'relative', borderRadius: '4px', overflow: 'hidden', background: '#e8e4de' },
  imgMain: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' },
  catBadge: { position: 'absolute', top: '1rem', left: '1rem', background: '#c9a96e', color: '#fff', fontSize: '0.6rem', padding: '0.3rem 0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '2px' },
  thumbs: { display: 'flex', gap: '0.6rem', marginTop: '0.8rem' },
  info: { display: 'flex', flexDirection: 'column', paddingTop: '0.5rem' },
  catLabel: { fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c9a96e', marginBottom: '0.6rem' },
  title: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, color: '#1a1a1a', lineHeight: 1.2, marginBottom: '0.5rem' },
  divider: { width: '40px', height: '2px', background: '#c9a96e', margin: '1rem 0 1.2rem' },
  price: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.9rem', color: '#c9a96e', fontWeight: 400, marginBottom: '1.4rem' },
  desc: { fontSize: '0.82rem', color: '#888', lineHeight: 1.85, marginBottom: '1.6rem' },
  specs: { borderTop: '1px solid #e8e4de', marginBottom: '2rem' },
  specRow: { display: 'flex', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid #e8e4de' },
  specKey: { fontSize: '0.66rem', color: '#bbb', letterSpacing: '0.2em', textTransform: 'uppercase' },
  specVal: { fontSize: '0.8rem', color: '#555' },
  btnMain: { width: '100%', background: '#d4a853', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.9rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', marginBottom: '0.8rem' },
  favBtn: { background: 'none', border: 'none', color: '#bbb', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s', padding: 0 },
  sectionBlock: { maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem', borderTop: '1px solid #e8e4de' },
  sectionLabel: { fontSize: '0.65rem', color: '#c9a96e', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.4rem' },
  sectionTitle: { fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.8rem', fontWeight: 300, color: '#1a1a1a', marginBottom: '2rem' },
  commentsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' },
  commentItem: { padding: '1.3rem 0', borderBottom: '1px solid #e8e4de' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: '#c9a96e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, flexShrink: 0 },
  formInput: { width: '100%', background: '#fff', border: '1px solid #e0dbd2', color: '#444', padding: '0.75rem 1rem', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none', borderRadius: '4px', transition: 'border-color 0.2s', marginBottom: '0.8rem', boxSizing: 'border-box' },
  btnSubmit: { width: '100%', background: 'transparent', border: '1px solid #d4a853', borderRadius: '50px', color: '#c9a96e', padding: '0.75rem', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' },
  relGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' },
  relCard: { background: '#fff', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: 'transform 0.25s, box-shadow 0.25s' },
  relImg: { width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block', background: '#e8e4de' },
  relBody: { padding: '0.9rem' },
  relBtn: { width: '100%', background: '#d4a853', border: 'none', borderRadius: '50px', color: '#fff', padding: '0.5rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit', marginTop: '0.6rem', transition: 'background 0.2s' },
};
 
const ProductPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
 
  const [product, setProduct]       = useState(null);
  const [related, setRelated]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeImg, setActiveImg]   = useState(0);
  const [comments, setComments]     = useState([]);
  const [commentUser, setCommentUser]   = useState('');
  const [commentText, setCommentText]   = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess]       = useState(false);
  const [orderModal, setOrderModal] = useState(false);
  const [orderQty, setOrderQty]     = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderDone, setOrderDone]   = useState(false);
  const [orderName, setOrderName]   = useState('');
  const [orderPhone, setOrderPhone] = useState('');
 
  const [currentUser, setCurrentUser] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');
 
  useEffect(() => {
    if (!isLoggedIn) return;
    instance.get('/me')
      .then(({ data }) => {
        setCurrentUser(data);
        setCommentUser(data.username || '');
      })
      .catch(() => setCurrentUser(null));
  }, [isLoggedIn]);
 
  const [fav, setFav] = useState(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favs.some(f => f._id === id);
  });
 
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: prod } = await instance.get(`/products/${id}`);
        setProduct(prod);
        setComments(prod.comments || []);
        const { data: all } = await instance.get('/products');
        setRelated(all.filter(p => p._id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
 
  const openModal = () => {
    if (currentUser) {
      setOrderName(currentUser.username || '');
      setOrderPhone(currentUser.phone ? String(currentUser.phone) : '');
    } else {
      setOrderName('');
      setOrderPhone('');
    }
    setOrderModal(true);
  };
 
  const handleOrder = async () => {
    if (!orderName.trim() || !orderPhone.trim()) {
      alert(t('product.order_alert'));
      return;
    }
    setOrderLoading(true);
    try {
      await instance.post('/orders', {
        name: orderName.trim(),
        phone: orderPhone.trim(),
        product: id,
        quantity: orderQty,
      });
      setOrderDone(true);
      setOrderModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setOrderLoading(false);
    }
  };
 
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setCommentSubmitting(true);
    try {
      const userName = currentUser?.username || commentUser.trim() || t('product.anon');
      const payload = { user: userName, text: commentText.trim() };
      const { data } = await instance.patch(`/products/${id}/comment`, payload);
      setComments(data?.comments || []);
      setCommentText('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setCommentSubmitting(false);
    }
  };
 
  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f5f3ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a96e', fontSize: '0.75rem', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
      {t('loading')}
    </div>
  );
  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#f5f3ef', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
      {t('product.not_found')}
    </div>
  );
 
  const images = product.images?.length ? product.images : product.img ? [product.img] : [];
  const specs = [
    product.color    && { label: t('catalog.color'),      value: product.color },
    product.material && { label: t('product.material'),  value: product.material },
    product.size     && { label: t('product.size'),      value: product.size },
    product.sku      && { label: t('popular.art'),   value: product.sku },
    product.category?.title && { label: t('nav.categories'), value: product.category.title },
  ].filter(Boolean);
 
  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@300;400;500&display=swap" rel="stylesheet" />
 
      {/* NAV */}
      <div style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate(-1)}
          onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
          onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
          ← &nbsp; {t('product.back_to_catalog')}
        </button>
      </div>
 
      {/* MAIN */}
      <div style={s.main}>
        {/* IMAGE */}
        <div>
          <div style={s.imgWrap}>
            {images[activeImg]
              ? <img src={images[activeImg]} alt={product.title} style={s.imgMain} />
              : <div style={{ aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', opacity: 0.3 }}>🪨</div>}
            {product.category?.title && <span style={s.catBadge}>{product.category.title}</span>}
          </div>
          {images.length > 1 && (
            <div style={s.thumbs}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{
                  width: '66px', height: '66px', borderRadius: '3px', overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${i === activeImg ? '#c9a96e' : 'transparent'}`, transition: 'border-color 0.2s', flexShrink: 0,
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
 
        {/* INFO */}
        <div style={s.info}>
          {product.category?.title && <div style={s.catLabel}>{product.category.title}</div>}
          <h1 style={s.title}>{product.title}</h1>
          {comments.length > 0 && (
            <div style={{ fontSize: '0.72rem', color: '#aaa', marginBottom: '0.5rem' }}>
              💬 {comments.length} {t('product.reviews_count')}
            </div>
          )}
          <div style={s.divider} />
          <div style={s.price}>{product.price?.toLocaleString('ru-RU')} <span style={{ fontSize: '1rem', fontFamily: 'inherit' }}>{t('catalog.currency')}</span></div>
          {product.desc && <p style={s.desc}>{product.desc}</p>}
          {specs.length > 0 && (
            <div style={s.specs}>
              {specs.map(({ label, value }) => (
                <div key={label} style={s.specRow}>
                  <span style={s.specKey}>{label}</span>
                  <span style={s.specVal}>{value}</span>
                </div>
              ))}
            </div>
          )}
 
          <button
            style={{ ...s.btnMain, background: orderDone ? '#e8f5e9' : '#d4a853', color: orderDone ? '#4caf50' : '#fff' }}
            onClick={() => !orderDone && openModal()}
            onMouseEnter={e => { if (!orderDone) e.currentTarget.style.background = '#b8913e'; }}
            onMouseLeave={e => { if (!orderDone) e.currentTarget.style.background = orderDone ? '#e8f5e9' : '#d4a853'; }}
          >
            {orderDone ? t('product.order_success') : t('product.leave_request')}
          </button>
 
          <button style={{ ...s.favBtn, color: fav ? '#c9a96e' : '#bbb' }} onClick={() => {
            const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
            const newFavs = fav
              ? favs.filter(f => f._id !== id)
              : [...favs, { _id: id, title: product.title, price: product.price, img: product.img }];
            localStorage.setItem('favorites', JSON.stringify(newFavs));
            setFav(!fav);
            window.dispatchEvent(new Event('favoritesUpdated'));
          }}>
            <HeartIcon filled={fav} /> {fav ? t('popular.inFav') : t('popular.toFav')}
          </button>
        </div>
      </div>
 
      {/* COMMENTS */}
      <div style={s.sectionBlock}>
        <div style={s.sectionLabel}>{t('product.opinions')}</div>
        <h3 style={s.sectionTitle}>{t('product.reviews')} {comments.length > 0 && <span style={{ fontSize: '1rem', color: '#bbb', fontFamily: 'Montserrat, sans-serif' }}>({comments.length})</span>}</h3>
        <div style={s.commentsGrid}>
 
          {/* ── СПИСОК КОММЕНТАРИЕВ СО СКРОЛЛОМ ── */}
          <div style={{ maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {comments.length === 0 ? (
              <div style={{ padding: '2.5rem', background: '#fff', borderRadius: '4px', textAlign: 'center', color: '#ccc', fontSize: '0.82rem' }}>
                {t('product.no_reviews')}
              </div>
            ) : [...comments].reverse().map((c, i) => (
              <div key={c._id || i} style={s.commentItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                  <div style={s.avatar}>{(c.user || 'А')[0].toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: '#333', fontWeight: 600 }}>{c.user || t('product.anon')}</div>
                    {c.createdAt && <div style={{ fontSize: '0.65rem', color: '#bbb' }}>{new Date(c.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>}
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#777', lineHeight: 1.7, paddingLeft: '44px' }}>{c.text}</p>
              </div>
            ))}
          </div>
 
          {/* ── ФОРМА ОТЗЫВА ── */}
          <div>
            <h4 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.2rem', fontWeight: 300, color: '#555', marginBottom: '1.5rem' }}>{t('product.leave_review')}</h4>
            <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>{t('contacts.name')}</div>
            <input
              style={{ ...s.formInput, background: currentUser ? '#f9f9f9' : '#fff', color: currentUser ? '#aaa' : '#444' }}
              value={commentUser}
              onChange={e => setCommentUser(e.target.value)}
              placeholder={t('product.optional')}
              readOnly={!!currentUser}
              onFocus={e => e.target.style.borderColor = '#c9a96e'}
              onBlur={e => e.target.style.borderColor = '#e0dbd2'}
            />
            <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.45rem' }}>{t('product.comment')}</div>
            <textarea style={{ ...s.formInput, resize: 'none', lineHeight: 1.6, marginBottom: '1.2rem' }} rows={5} value={commentText}
              onChange={e => setCommentText(e.target.value)} placeholder={t('product.comment_placeholder')}
              onFocus={e => e.target.style.borderColor = '#c9a96e'} onBlur={e => e.target.style.borderColor = '#e0dbd2'} />
            <button style={{ ...s.btnSubmit, background: commentSuccess ? '#d4a853' : 'transparent', color: commentSuccess ? '#fff' : '#c9a96e' }}
              onClick={handleCommentSubmit} disabled={commentSubmitting || !commentText.trim()}
              onMouseEnter={e => { if (!commentSuccess) { e.currentTarget.style.background = '#d4a853'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (!commentSuccess) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c9a96e'; } }}>
              {commentSuccess ? t('product.comment_success') : commentSubmitting ? t('product.sending') : t('product.publish_review')}
            </button>
          </div>
        </div>
      </div>
 
      {/* RELATED */}
      {related.length > 0 && (
        <div style={{ ...s.sectionBlock, paddingBottom: '5rem' }}>
          <div style={s.sectionLabel}>{t('product.see_also')}</div>
          <h3 style={s.sectionTitle}>{t('product.similar_products')}</h3>
          <div style={s.relGrid}>
            {related.map(p => (
              <div key={p._id} style={s.relCard}
                onClick={() => navigate(`/product/${p._id}`)}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)'; }}>
                {p.img
                  ? <img src={p.img} alt={p.title} style={s.relImg} />
                  : <div style={{ ...s.relImg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', opacity: 0.3 }}>🪨</div>}
                <div style={s.relBody}>
                  <div style={{ fontSize: '0.72rem', color: '#333', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{p.title}</div>
                  {p.sku && <div style={{ fontSize: '0.65rem', color: '#bbb', marginBottom: '0.3rem' }}>{t('popular.art')}: {p.sku}</div>}
                  <div style={{ fontSize: '0.85rem', color: '#c9a96e', fontWeight: 600 }}>{p.price?.toLocaleString('ru-RU')} {t('catalog.currency')}</div>
                  <button style={s.relBtn} onMouseEnter={e => e.target.style.background = '#b8913e'} onMouseLeave={e => e.target.style.background = '#d4a853'}>
                    {t('popular.more')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* МОДАЛКА ЗАЯВКИ */}
      {orderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}
          onClick={e => { if (e.target === e.currentTarget) setOrderModal(false); }}>
 
          <div style={{ background: '#fff', borderRadius: '8px', padding: '2.5rem', width: '380px', fontFamily: "'Montserrat', sans-serif" }}>
            <div style={{ fontSize: '0.65rem', color: '#c9a96e', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              {t('product.order_title')}
            </div>
            <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem', fontWeight: 300, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              {product.title}
            </h3>
 
            {!isLoggedIn ? (
              <div style={{ background: '#fdf8f0', border: '1px solid #e8d9b8', borderRadius: '6px', padding: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', marginBottom: '0.6rem' }}>👤</div>
                <div style={{ fontSize: '0.78rem', color: '#7a6a4e', lineHeight: 1.6, marginBottom: '1.2rem' }}>
                  {t('product.login_hint')}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <Link to="/login" style={{ flex: 1, background: '#d4a853', borderRadius: '50px', color: '#fff', padding: '0.65rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" style={{ flex: 1, background: 'transparent', border: '1px solid #d4a853', borderRadius: '50px', color: '#c9a96e', padding: '0.65rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {t('auth.register')}
                  </Link>
                </div>
                <button onClick={() => { setOrderModal(false); setTimeout(() => setOrderModal('manual'), 10); }}
                  style={{ marginTop: '0.8rem', background: 'none', border: 'none', color: '#bbb', fontSize: '0.65rem', cursor: 'pointer', letterSpacing: '0.1em', fontFamily: 'inherit' }}>
                  {t('product.continue_no_login')}
                </button>
              </div>
            ) : (
              <div style={{ background: '#f9f9f9', border: '1px solid #e8e4de', borderRadius: '6px', padding: '1rem 1.2rem', marginBottom: '1.4rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#c9a96e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 600, flexShrink: 0 }}>
                  {(orderName || '?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', color: '#333', fontWeight: 600 }}>{orderName || '—'}</div>
                  <div style={{ fontSize: '0.72rem', color: '#aaa' }}>{orderPhone || '—'}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '0.6rem', color: '#c9a96e', letterSpacing: '0.1em' }}>✓ {t('product.autofill')}</div>
              </div>
            )}
 
            {orderModal === 'manual' && (
              <>
                <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{t('contacts.name')}</div>
                <input style={{ ...s.formInput, marginBottom: '1rem' }} value={orderName} onChange={e => setOrderName(e.target.value)} placeholder={t('product.name_placeholder')}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'} onBlur={e => e.target.style.borderColor = '#e0dbd2'} />
                <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{t('contacts.phone')}</div>
                <input style={{ ...s.formInput, marginBottom: '1.5rem' }} value={orderPhone} onChange={e => setOrderPhone(e.target.value)} placeholder="+998 __ ___ __ __"
                  onFocus={e => e.target.style.borderColor = '#c9a96e'} onBlur={e => e.target.style.borderColor = '#e0dbd2'} />
              </>
            )}
 
            {(isLoggedIn || orderModal === 'manual') && (
              <>
                <div style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{t('product.quantity')}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.8rem' }}>
                  <button onClick={() => setOrderQty(q => Math.max(1, q - 1))}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e0dbd2', background: '#fff', cursor: 'pointer', fontSize: '1.2rem', color: '#888' }}>−</button>
                  <span style={{ fontSize: '1.2rem', fontWeight: 600, minWidth: '24px', textAlign: 'center' }}>{orderQty}</span>
                  <button onClick={() => setOrderQty(q => q + 1)}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e0dbd2', background: '#fff', cursor: 'pointer', fontSize: '1.2rem', color: '#888' }}>+</button>
                  <span style={{ fontSize: '0.82rem', color: '#c9a96e', marginLeft: 'auto', fontWeight: 600 }}>
                    {(product.price * orderQty).toLocaleString('ru-RU')} {t('catalog.currency')}
                  </span>
                </div>
 
                <button style={{ ...s.btnMain, marginBottom: '0.6rem', opacity: orderLoading ? 0.7 : 1 }}
                  onClick={handleOrder} disabled={orderLoading}>
                  {orderLoading ? t('product.sending') : t('product.confirm_order')}
                </button>
              </>
            )}
 
            <button style={{ ...s.favBtn, width: '100%', justifyContent: 'center', color: '#bbb' }}
              onClick={() => setOrderModal(false)}>
              {t('product.cancel')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default ProductPage;