import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#B8874A';
const DARK = '#0D0B09';
const CREAM = '#F5F0E8';
const WARM_GRAY = '#8C8680';

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

const IconTruck = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M2 6h13v11H2V6z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M15 9h4.5L22 13v4h-7V9z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="6.5" cy="18.5" r="1.5" stroke={GOLD} strokeWidth="1.5"/>
    <circle cx="18.5" cy="18.5" r="1.5" stroke={GOLD} strokeWidth="1.5"/>
  </svg>
);
const IconBox = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M13 3L22 8v10l-9 5-9-5V8l9-5z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M13 3v15M4 8l9 5 9-5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IconShield = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M13 3l8 3v6c0 5-4 9-8 11C9 21 5 17 5 12V6l8-3z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 13l3 3 5-5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconClock = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <circle cx="13" cy="13" r="9" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M13 8v5l3.5 2" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPin = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="9" r="3" stroke={GOLD} strokeWidth="1.5"/>
    <path d="M11 2C7.13 2 4 5.13 4 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z" stroke={GOLD} strokeWidth="1.5" fill="none"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8l4 4 6-7" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const steps = [
  { n: '01', title: 'Оформление заказа', text: 'Выбираете материал в каталоге или в шоуруме. Менеджер уточняет объём, адрес и удобное время доставки.' },
  { n: '02', title: 'Упаковка и маркировка', text: 'Каждая плита упаковывается в защитную плёнку и пенополистирол. Хрупкие изделия — в деревянные ящики с маркировкой.' },
  { n: '03', title: 'Отгрузка со склада', text: 'Отгрузка в день подтверждения заказа (при наличии на складе) или в согласованную дату.' },
  { n: '04', title: 'Доставка', text: 'Собственный автопарк доставит груз в Москве и МО. Для регионов — надёжные транспортные партнёры.' },
  { n: '05', title: 'Разгрузка и подъём', text: 'Бригада разгрузит и при необходимости поднимет материал на нужный этаж. Камень — не лёгкий груз, мы знаем.' },
];

const zones = [
  { zone: 'Москва (МКАД)', time: '1–2 дня', price: 'от 2 500 ₽', free: '— от 150 000 ₽' },
  { zone: 'Подмосковье до 50 км', time: '2–3 дня', price: 'от 4 500 ₽', free: '— от 250 000 ₽' },
  { zone: 'Подмосковье до 100 км', time: '3–5 дней', price: 'от 7 000 ₽', free: '—' },
  { zone: 'Регионы России', time: '5–14 дней', price: 'по тарифу ТК', free: '—' },
  { zone: 'СНГ', time: 'по согласованию', price: 'по запросу', free: '—' },
];

const faqs = [
  { q: 'Можно ли самовывоз?', a: 'Да. Самовывоз со склада по адресу Москва, ул. Промышленная, 18. Режим работы склада: Пн–Пт 8:00–19:00, Сб 9:00–15:00. Погрузка в автомобиль включена.' },
  { q: 'Как рассчитывается стоимость доставки?', a: 'Стоимость зависит от адреса, веса и объёма заказа. Точную сумму менеджер назовёт после оформления заявки. Крупные заказы (от 150 000 ₽) доставляем по Москве бесплатно.' },
  { q: 'Что если материал повреждён при доставке?', a: 'Весь груз застрахован на полную стоимость. При обнаружении повреждений при получении — составляем акт, заменяем материал за наш счёт в течение 5 рабочих дней.' },
  { q: 'Возможна ли срочная доставка?', a: 'Да, срочная доставка по Москве доступна в день заказа при оформлении до 13:00. Стоимость рассчитывается индивидуально. Свяжитесь с менеджером.' },
  { q: 'Доставляете ли в другие страны?', a: 'Работаем со странами СНГ: Казахстан, Беларусь, Узбекистан, Армения. Для других стран — уточняйте у менеджера. Оформляем все сопроводительные документы.' },
];

const Delivery = () => {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [calcWeight, setCalcWeight] = useState(500);
  const [calcZone, setCalcZone] = useState(0);

  const calcPrices = [2500, 4500, 7000, 12000, 0];
  const calcResult = calcPrices[calcZone]
    ? Math.round(calcPrices[calcZone] + calcWeight * 4.5)
    : null;

  useEffect(() => {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&q=80&fit=crop';
    img.onload = () => setHeroLoaded(true);
  }, []);

  return (
    <div style={{ background: CREAM, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:${CREAM};}
        ::-webkit-scrollbar-thumb{background:${GOLD};border-radius:2px;}
        .back-btn:hover{color:${GOLD} !important;border-color:rgba(184,135,74,0.4) !important;}
        .faq-item{border-bottom:1px solid rgba(0,0,0,0.08);cursor:pointer;}
        .faq-item:hover .faq-q{color:${GOLD} !important;}
        .zone-row:hover{background:rgba(184,135,74,0.04);}
        .cta-btn:hover{background:#C9964E !important;letter-spacing:0.32em !important;}
        .ghost-btn:hover{border-color:${GOLD} !important;color:${GOLD} !important;}
        .step-card{transition:transform 0.35s,box-shadow 0.35s;}
        .step-card:hover{transform:translateY(-4px);box-shadow:0 20px 50px rgba(0,0,0,0.09);}
        select{-webkit-appearance:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23B8874A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 1rem center;}
        input[type=range]{-webkit-appearance:none;appearance:none;height:2px;background:rgba(0,0,0,0.12);outline:none;border-radius:2px;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${GOLD};cursor:pointer;box-shadow:0 2px 8px rgba(184,135,74,0.4);}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @media(max-width:768px){
          .two-col{grid-template-columns:1fr !important;}
          .zones-table th,.zones-table td{padding:0.9rem 0.8rem !important;font-size:0.75rem !important;}
        }
      `}</style>

      {/* ── HERO ── */}
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
          textTransform: 'uppercase', cursor: 'pointer', display: 'flex',
          alignItems: 'center', gap: '0.6rem', fontFamily: 'inherit',
          padding: '0.6rem 1.4rem', transition: 'all 0.25s',
        }}>← На главную</button>

        <div style={{ position: 'absolute', top: '2rem', right: '2.5rem', color: GOLD, fontSize: '0.6rem', letterSpacing: '0.5em', textTransform: 'uppercase', fontWeight: 500 }}>ZarStone</div>

        <div style={{ position: 'relative', padding: '0 2.5rem 5rem' }}>
          <div style={{ width: '32px', height: '1px', background: GOLD, marginBottom: '1.2rem', opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s 0.3s' }} />
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
            fontWeight: 400, color: '#fff', lineHeight: 1.05,
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s',
          }}>
            Доставка<br /><em style={{ color: GOLD }}>по всей России</em>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', maxWidth: '400px',
            lineHeight: 1.85, marginTop: '1.2rem', fontWeight: 300,
            opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s 0.6s',
          }}>
            Собственный автопарк в Москве и МО. Надёжные партнёры по всей стране. Весь груз застрахован.
          </p>

          {/* quick badges */}
          <div style={{
            display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '2rem',
            opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s 0.8s',
          }}>
            {['47 регионов', 'Страхование груза', 'Бесплатно от 150 000 ₽'].map(b => (
              <div key={b} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '100px',
                padding: '0.45rem 1rem', color: 'rgba(255,255,255,0.75)',
                fontSize: '0.68rem', letterSpacing: '0.08em',
              }}>
                <IconCheck />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 PILLARS ── */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(0,0,0,0.06)' }}>
            {[
              { icon: <IconTruck />, label: 'Собственный автопарк', sub: 'Москва и МО' },
              { icon: <IconBox />, label: 'Бережная упаковка', sub: 'Защита каждой плиты' },
              { icon: <IconShield />, label: 'Страхование', sub: 'На полную стоимость' },
              { icon: <IconClock />, label: 'Срочная доставка', sub: 'В день заказа до 13:00' },
            ].map((p, i) => (
              <Reveal key={p.label} delay={i * 0.07}>
                <div className="step-card" style={{ background: '#fff', padding: '3rem 2rem', cursor: 'default' }}>
                  <div style={{ marginBottom: '1.4rem' }}>{p.icon}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500, color: DARK, marginBottom: '0.4rem' }}>{p.label}</div>
                  <div style={{ fontSize: '0.75rem', color: WARM_GRAY, fontWeight: 300 }}>{p.sub}</div>
                  <div style={{ width: '20px', height: '1.5px', background: GOLD, marginTop: '1.5rem', borderRadius: '1px' }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <Reveal>
          <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 500 }}>Процесс</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 400, color: DARK, marginBottom: '4rem' }}>
            Как мы доставляем
          </h2>
        </Reveal>

        <div style={{ position: 'relative' }}>
          {/* vertical gold line */}
          <div style={{ position: 'absolute', left: '28px', top: '8px', bottom: '8px', width: '1px', background: `linear-gradient(to bottom, transparent, ${GOLD}66 20%, ${GOLD}66 80%, transparent)` }} />

          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.09}>
              <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem', alignItems: 'flex-start' }}>
                {/* number bubble */}
                <div style={{
                  minWidth: '56px', height: '56px', borderRadius: '50%',
                  border: `1px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '0.85rem', color: GOLD, background: CREAM, flexShrink: 0,
                  boxShadow: `0 0 0 6px ${CREAM}`,
                }}>
                  {s.n}
                </div>
                <div style={{ paddingTop: '0.8rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: DARK, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{s.title}</h3>
                  <p style={{ color: WARM_GRAY, fontSize: '0.88rem', lineHeight: 1.85, fontWeight: 300 }}>{s.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── DIVIDER IMAGE ── */}
      <div style={{ position: 'relative', height: '45vh', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1800&q=70&fit=crop"
          alt="Упаковка камня"
          style={{ width: '100%', height: '130%', objectFit: 'cover', position: 'absolute', top: '-15%', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,6,0.65)' }} />
        <Reveal style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: GOLD, letterSpacing: '0.5em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Наш принцип</p>
          <p style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.3rem, 3vw, 2rem)',
            color: '#fff', fontWeight: 400, fontStyle: 'italic',
            maxWidth: '650px', lineHeight: 1.6,
          }}>
            «Камень терпел миллионы лет — мы сделаем всё, чтобы он доехал целым»
          </p>
        </Reveal>
      </div>

    
      {/* ── CALCULATOR + FAQ ── */}
      <section style={{ background: CREAM, padding: '7rem 2.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="two-col" style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem',justifyItems: 'center', }}>

   
          

          {/* FAQ */}
          <Reveal delay={0.15}>
            <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 500 }}>Вопросы</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 2.5vw, 2.4rem)', fontWeight: 400, color: DARK, marginBottom: '2.5rem' }}>
              Частые<br /><em style={{ color: GOLD }}>вопросы</em>
            </h2>

            <div>
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="faq-item"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.3rem 0', gap: '1rem' }}>
                    <span className="faq-q" style={{ fontSize: '0.9rem', color: openFaq === i ? GOLD : DARK, fontWeight: openFaq === i ? 500 : 400, lineHeight: 1.4, transition: 'color 0.25s' }}>
                      {f.q}
                    </span>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      border: `1px solid ${openFaq === i ? GOLD : 'rgba(0,0,0,0.12)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, color: openFaq === i ? GOLD : WARM_GRAY,
                      fontSize: '1rem', lineHeight: 1, transition: 'all 0.25s',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    }}>+</div>
                  </div>
                  <div style={{
                    maxHeight: openFaq === i ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)',
                  }}>
                    <p style={{ color: WARM_GRAY, fontSize: '0.85rem', lineHeight: 1.85, fontWeight: 300, paddingBottom: '1.3rem' }}>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '480px', display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1800&q=70&fit=crop)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,6,0.82)' }} />
        <div style={{ position: 'relative', width: '100%', maxWidth: '1300px', margin: '0 auto', padding: '5rem 2.5rem', textAlign: 'center' }}>
          <Reveal>
            <p style={{ color: GOLD, letterSpacing: '0.5em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Оформить заказ</p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 400, color: '#fff', marginBottom: '1rem', lineHeight: 1.15,
            }}>
              Готовы к доставке?<br /><em style={{ color: GOLD }}>Позвоните нам</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', maxWidth: '380px', lineHeight: 1.85, margin: '0 auto 2.5rem', fontWeight: 300 }}>
              Менеджер рассчитает точную стоимость и согласует удобное время доставки
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="cta-btn"
                onClick={() => navigate('/contacts')}
                style={{
                  background: GOLD, color: '#fff', border: 'none',
                  padding: '1rem 2.8rem', fontSize: '0.68rem',
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: '100px',
                  fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.3s',
                }}
              >
                Связаться
              </button>
              <button
                className="ghost-btn"
                onClick={() => navigate('/collections')}
                style={{
                  background: 'transparent', color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '1rem 2.8rem', fontSize: '0.68rem',
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: '100px',
                  fontFamily: 'inherit', transition: 'all 0.3s',
                }}
              >
                Каталог
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER STRIP ── */}
      <div style={{ background: DARK, padding: '2.5rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>© 2026 ZarStone — Всё о природном камне</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Каталог', 'О нас', 'Контакты'].map(link => (
            <button key={link}
              onClick={() => navigate(`/${link.toLowerCase()}`)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'color 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >{link}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Delivery;
