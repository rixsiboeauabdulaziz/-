import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Импортируем хук

// Цвета проекта (оставляем без изменений)
const GOLD = '#B8874A';
const DARK = '#0D0B09';
const CREAM = '#F5F0E8';
const WARM_GRAY = '#8C8680';

// Хук для анимации (оставляем без изменений)
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const Reveal = ({ children, delay = 0, style = {}, className = '' }) => {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

// Иконки (оставляем без изменений)
const IconTruck = () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M2 6h13v11H2V6z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/><path d="M15 9h4.5L22 13v4h-7V9z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/><circle cx="6.5" cy="18.5" r="1.5" stroke={GOLD} strokeWidth="1.5"/><circle cx="18.5" cy="18.5" r="1.5" stroke={GOLD} strokeWidth="1.5"/></svg>;
const IconBox = () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3L22 8v10l-9 5-9-5V8l9-5z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/><path d="M13 3v15M4 8l9 5 9-5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IconShield = () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 3l8 3v6c0 5-4 9-8 11C9 21 5 17 5 12V6l8-3z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 13l3 3 5-5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconClock = () => <svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="9" stroke={GOLD} strokeWidth="1.5"/><path d="M13 8v5l3.5 2" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-7" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const Delivery = () => {
  const { t } = useTranslation(); // Инициализация t
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [calcWeight, setCalcWeight] = useState(500);
  const [calcZone, setCalcZone] = useState(0);

  // Данные зон (можно вынести в i18n, но оставим логику цен здесь)
  const zones = [
    { zone: t('delivery.calc_zone_moscow') || 'Москва (МКАД)', price: 2500 },
    { zone: t('delivery.calc_zone_suburbs_50') || 'Подмосковье до 50 км', price: 4500 },
    { zone: t('delivery.calc_zone_suburbs_100') || 'Подмосковье до 100 км', price: 7000 },
    { zone: t('delivery.calc_zone_regions') || 'Регионы России', price: 12000 },
  ];

  const calcResult = zones[calcZone]?.price > 0 
    ? Math.round(zones[calcZone].price + calcWeight * 4.5) 
    : null;

  useEffect(() => {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&q=80&fit=crop';
    img.onload = () => setHeroLoaded(true);
  }, []);

  // Получаем массивы из переводов
  const steps_data = t('delivery.steps_data', { returnObjects: true });
  const faqs_data = t('delivery.faqs_data', { returnObjects: true });
  const badges = t('delivery.badges', { returnObjects: true });

  return (
    <div style={{ background: CREAM, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .back-btn:hover{color:${GOLD} !important; border-color:rgba(184,135,74,0.4) !important;}
        .faq-item{border-bottom:1px solid rgba(0,0,0,0.08);cursor:pointer;}
        .faq-item:hover .faq-q{color:${GOLD} !important;}
        .cta-btn:hover{background:#C9964E !important;letter-spacing:0.32em !important;}
        .ghost-btn:hover{border-color:${GOLD} !important;color:${GOLD} !important;}
        input[type=range]{-webkit-appearance:none; height:2px; background:rgba(0,0,0,0.12); outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:${GOLD}; cursor:pointer; box-shadow:0 2px 8px rgba(184,135,74,0.4);}
        @media(max-width:768px){ .two-col{grid-template-columns:1fr !important; gap: 3rem !important;} }
      `}</style>

      {/* HERO SECTION */}
      <section style={{ position: 'relative', height: '65vh', minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&q=80&fit=crop)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          opacity: heroLoaded ? 1 : 0, transition: 'opacity 1.2s ease',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,0.93) 0%, rgba(10,8,6,0.45) 55%, rgba(10,8,6,0.2) 100%)' }} />

        <button className="back-btn" onClick={() => navigate(-1)} style={{
          position: 'absolute', top: '2rem', left: '2.5rem',
          background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px',
          color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', letterSpacing: '0.28em',
          textTransform: 'uppercase', cursor: 'pointer', padding: '0.6rem 1.4rem', transition: 'all 0.25s',
          zIndex: 10
        }}>{t('delivery.back_to_main')}</button>

        <div style={{ position: 'relative', padding: '0 2.5rem 5rem' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
            fontWeight: 400, color: '#fff', lineHeight: 1.05,
            opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s',
          }}>
            {t('delivery.hero_title')}<br /><em style={{ color: GOLD }}>{t('delivery.hero_subtitle')}</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', maxWidth: '400px', marginTop: '1.2rem', fontWeight: 300 }}>
            {t('delivery.hero_desc')}
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '2rem' }}>
            {Array.isArray(badges) && badges.map(b => (
              <div key={b} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px',
                padding: '0.45rem 1rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.68rem',
              }}>
                <IconCheck /> {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1px', background: 'rgba(0,0,0,0.06)' }}>
          {[
            { icon: <IconTruck />, label: t('whyUs.reasons.2.title'), sub: 'ZarStone Fleet' },
            { icon: <IconBox />, label: t('whyUs.reasons.1.title'), sub: t('delivery.steps_data.1.title') },
            { icon: <IconShield />, label: t('whyUs.reasons.3.title'), sub: '100% Security' },
            { icon: <IconClock />, label: t('delivery.steps_data.2.title'), sub: 'Express' },
          ].map((p, i) => (
            <Reveal key={i} delay={i * 0.07} style={{ background: '#fff', padding: '3rem 2rem' }}>
              <div style={{ marginBottom: '1.4rem' }}>{p.icon}</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 500, color: DARK }}>{p.label}</div>
              <div style={{ fontSize: '0.75rem', color: WARM_GRAY, marginTop: '0.4rem' }}>{p.sub}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <Reveal>
          <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{t('delivery.process_label')}</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', color: DARK, marginBottom: '4rem' }}>{t('delivery.process_title')}</h2>
        </Reveal>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '28px', top: 0, bottom: 0, width: '1px', background: `${GOLD}33` }} />
          {Array.isArray(steps_data) && steps_data.map((s, i) => (
            <Reveal key={i} delay={i * 0.1} style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
              <div style={{ minWidth: '56px', height: '56px', borderRadius: '50%', border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: CREAM, color: GOLD, zIndex: 1 }}>
                {i + 1}
              </div>
              <div style={{ paddingTop: '0.8rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: DARK }}>{s.title}</h3>
                <p style={{ color: WARM_GRAY, fontSize: '0.88rem', marginTop: '0.5rem', lineHeight: 1.8 }}>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRINCIPLE SECTION */}
      <div style={{ position: 'relative', height: '40vh', overflow: 'hidden' }}>
        <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1800&q=70" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Stone" />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem' }}>
          <Reveal>
            <p style={{ color: GOLD, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5em' }}>{t('delivery.principle_label')}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '1.8rem', fontStyle: 'italic', maxWidth: '600px', marginTop: '1rem' }}>{t('delivery.principle_text')}</p>
          </Reveal>
        </div>
      </div>

      {/* CALCULATOR & FAQ SECTION */}
      <section style={{ padding: '7rem 2.5rem' }}>
        <div className="two-col" style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
          
          {/* CALCULATOR */}
          <Reveal>
            <div style={{ background: '#fff', padding: '3.5rem', borderRadius: '4px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', width: '100%' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: '2rem', color: DARK }}>
                {t('delivery.calc_title')} <br/><em style={{ color: GOLD }}>{t('delivery.calc_title_italic')}</em>
              </h3>
              
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: WARM_GRAY, marginBottom: '1rem' }}>{t('delivery.calc_zone_label')}</label>
                <select 
                  value={calcZone} 
                  onChange={(e) => setCalcZone(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '1rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '0', fontFamily: 'inherit', fontSize: '0.9rem', outline: 'none' }}
                >
                  {zones.map((z, i) => <option key={i} value={i}>{z.zone}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: WARM_GRAY }}>{t('delivery.calc_weight_label')}</label>
                  <span style={{ color: GOLD, fontSize: '0.9rem', fontWeight: 500 }}>{calcWeight} кг</span>
                </div>
                <input 
                  type="range" min="100" max="5000" step="100" 
                  value={calcWeight} 
                  onChange={(e) => setCalcWeight(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '0.65rem', color: WARM_GRAY, textTransform: 'uppercase', marginBottom: '0.4rem' }}>{t('delivery.calc_total')}</p>
                  <p style={{ fontSize: '1.8rem', color: DARK, fontWeight: 500 }}>
                    {calcResult ? calcResult.toLocaleString() : '—'} <span style={{ fontSize: '1rem' }}>{t('catalog.currency')}</span>
                  </p>
                </div>
                <button style={{ background: 'none', border: 'none', color: GOLD, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', paddingBottom: '0.5rem', fontWeight: 500 }}>
                  {t('delivery.calc_details')} →
                </button>
              </div>
            </div>
          </Reveal>

          {/* FAQ */}
          <Reveal>
            <p style={{ color: GOLD, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.45em', marginBottom: '0.6rem' }}>{t('delivery.faq_label')}</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', marginBottom: '2.5rem', color: DARK }}>
              {t('delivery.faq_title')} <em style={{ color: GOLD }}>{t('delivery.faq_title_italic')}</em>
            </h2>
            {Array.isArray(faqs_data) && faqs_data.map((f, i) => (
              <div key={i} className="faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="faq-q" style={{ padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'color 0.3s', fontSize: '0.95rem', color: openFaq === i ? GOLD : DARK }}>
                  <span>{f.q}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 300 }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                <div style={{ 
                  maxHeight: openFaq === i ? '200px' : '0', 
                  overflow: 'hidden', 
                  transition: 'max-height 0.4s ease-out, opacity 0.3s',
                  opacity: openFaq === i ? 1 : 0
                }}>
                  <p style={{ fontSize: '0.88rem', color: WARM_GRAY, paddingBottom: '1.5rem', lineHeight: 1.8 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ position: 'relative', background: DARK, color: '#fff', textAlign: 'center', padding: '7rem 2.5rem' }}>
        <Reveal>
          <p style={{ color: GOLD, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.4em' }}>{t('delivery.cta_label')}</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '1.5rem 0', fontWeight: 400 }}>
            {t('delivery.cta_title')} <br/><em style={{ color: GOLD }}>{t('delivery.cta_title_italic')}</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '450px', margin: '0 auto 3rem', fontSize: '0.9rem', lineHeight: 1.8 }}>
            {t('delivery.cta_desc')}
          </p>
          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="cta-btn" style={{ background: GOLD, color: '#fff', border: 'none', padding: '1.2rem 3rem', borderRadius: '100px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.25em', transition: 'all 0.3s' }}>
              {t('delivery.cta_btn_contact')}
            </button>
            <button className="ghost-btn" onClick={() => navigate('/catalog')} style={{ background: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '1.2rem 3rem', borderRadius: '100px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.25em', transition: 'all 0.3s' }}>
              {t('delivery.cta_btn_catalog')}
            </button>
          </div>
        </Reveal>
      </section>

      {/* FOOTER MINI */}
      <footer style={{ background: '#000', padding: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>
            {t('delivery.footer_copy')}
          </span>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {['Instagram', 'WhatsApp', 'Telegram'].map(social => (
              <a key={social} href="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{social}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Delivery;