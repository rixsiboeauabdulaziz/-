import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

const GOLD = '#B8874A';
const DARK = '#0D0B09';
const CREAM = '#F5F0E8';
const WARM_GRAY = '#8C8680';

const stats = [
  { value: '20+', label: 'лет на рынке', sub: 'с 2005 года' },
  { value: '5 000+', label: 'реализованных проектов', sub: 'по всей России' },
  { value: '120', label: 'видов материалов', sub: 'в нашем каталоге' },
  { value: '47', label: 'регионов доставки', sub: 'по всей стране' },
];

const timeline = [
  { year: '2005', text: 'Основание компании. Первый склад в Москве площадью 500 м².' },
  { year: '2010', text: 'Открытие собственного цеха по резке и обработке камня.' },
  { year: '2015', text: 'Выход на рынки СНГ. Партнёрство с европейскими поставщиками.' },
  { year: '2020', text: 'Запуск онлайн-каталога. Доставка в 47 регионов России.' },
  { year: '2026', text: 'Более 5 000 реализованных проектов. Лидер рынка.' },
];

const IMG = {
  hero:    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1800&q=80&fit=crop',
  story:   'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80&fit=crop',
  divider: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=75&fit=crop',
  g1:      'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=700&q=75&fit=crop',
  g2:      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=75&fit=crop',
  g3:      'https://images.unsplash.com/photo-1604693175663-cf3234c5e7ad?w=700&q=75&fit=crop',
  g4:      'https://images.unsplash.com/photo-1565343715-5fb6ddc7f3c1?w=700&q=75&fit=crop',
  cta:     'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=1800&q=70&fit=crop',
};

const Reveal = ({ children, delay = 0, style = {}, className = '' }) => {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const About = () => {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = IMG.hero;
    img.onload = () => setHeroLoaded(true);
  }, []);

  const handleGalleryEnter = (e) => {
    setShowCursor(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handleGalleryMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div style={{ background: CREAM, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:${CREAM};}
        ::-webkit-scrollbar-thumb{background:${GOLD};border-radius:2px;}
        .gallery-item img { transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94); }
        .gallery-item:hover img { transform: scale(1.06); }
        .btn-primary { transition: all 0.3s; }
        .btn-primary:hover { background: #C9964E !important; letter-spacing: 0.32em !important; }
        .btn-ghost:hover { border-color: ${GOLD} !important; color: ${GOLD} !important; }
        .timeline-dot { transition: transform 0.3s; }
        .timeline-row:hover .timeline-dot { transform: scale(1.6); }
        .stat-card { transition: transform 0.3s, box-shadow 0.3s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .back-btn:hover { color: ${GOLD} !important; border-color: rgba(201,169,110,0.5) !important; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @media(max-width:768px){
          .hero-title{font-size:clamp(2.8rem,10vw,4rem) !important;}
          .story-grid{grid-template-columns:1fr !important;}
          .stats-grid{grid-template-columns:1fr 1fr !important;}
          .gallery-grid{grid-template-areas:none !important; grid-template-columns:1fr 1fr !important;}
          .gallery-grid>*{grid-area:auto !important;}
        }
      `}</style>

      {/* ──── HERO ──── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        {/* bg image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG.hero})`,
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
          opacity: heroLoaded ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }} />
        {/* gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.45) 50%, rgba(10,8,6,0.25) 100%)' }} />

        {/* back btn */}
        <button
          className="back-btn"
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: '2rem', left: '2.5rem',
            background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px',
            color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem', letterSpacing: '0.28em',
            textTransform: 'uppercase', cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: '0.6rem', fontFamily: 'inherit',
            padding: '0.6rem 1.4rem', transition: 'all 0.25s',
          }}
        >
          ← На главную
        </button>

        {/* brand badge */}
        <div style={{
          position: 'absolute', top: '2rem', right: '2.5rem',
          color: GOLD, fontSize: '0.6rem', letterSpacing: '0.5em',
          textTransform: 'uppercase', fontWeight: 500,
        }}>ZarStone</div>

        {/* hero text */}
        <div style={{ position: 'relative', padding: '0 2.5rem 5rem', maxWidth: '900px' }}>
          <div style={{
            display: 'inline-block',
            width: '32px', height: '1px', background: GOLD,
            marginBottom: '1.2rem', opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }} />
          <h1
            className="hero-title"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(3.5rem, 7vw, 6rem)',
              fontWeight: 400, color: '#fff', lineHeight: 1.05,
              letterSpacing: '-0.01em',
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s',
            }}
          >
            Рождённые<br />
            <em style={{ color: GOLD }}>из камня</em>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', maxWidth: '440px',
            lineHeight: 1.8, marginTop: '1.4rem', fontWeight: 300,
            opacity: heroLoaded ? 1 : 0,
            transition: 'opacity 1s ease 0.6s',
          }}>
            Двадцать лет мы создаём пространства из природного камня — от частных домов до крупных архитектурных объектов
          </p>

          {/* scroll hint */}
          <div style={{
            position: 'absolute', right: '-40vw', bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
            color: 'rgba(255,255,255,0.3)', fontSize: '0.58rem', letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s ease 1s',
            animation: 'float 2.5s ease-in-out infinite 1s',
          }}>
            <span>Scroll</span>
            <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }} />
          </div>
        </div>
      </section>

      {/* ──── STATS ──── */}
      <section style={{ background: '#fff', padding: '0' }}>
        <Reveal>
          <div
            className="stats-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              borderBottom: `1px solid rgba(0,0,0,0.07)`,
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="stat-card"
                style={{
                  padding: '3.5rem 2rem',
                  borderRight: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
                  cursor: 'default',
                }}
              >
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2.4rem, 3.5vw, 3.5rem)',
                  fontWeight: 400, color: DARK, lineHeight: 1,
                  marginBottom: '0.5rem',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: DARK, letterSpacing: '0.08em', marginBottom: '0.25rem', fontWeight: 500 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.68rem', color: WARM_GRAY, letterSpacing: '0.05em' }}>
                  {s.sub}
                </div>
                <div style={{ width: '24px', height: '2px', background: GOLD, marginTop: '1.2rem', borderRadius: '1px' }} />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ──── STORY ──── */}
      <section style={{ maxWidth: '1300px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <div className="story-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* image side */}
          <Reveal delay={0.1}>
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '2px', overflow: 'hidden',
                aspectRatio: '3/4', boxShadow: '0 30px 80px rgba(0,0,0,0.14)',
              }}>
                <img src={IMG.story} alt="О компании" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              {/* floating badge */}
              <div style={{
                position: 'absolute', bottom: '-1.5rem', right: '-1.5rem',
                background: GOLD, color: '#fff',
                padding: '2rem 1.8rem', borderRadius: '2px',
                fontFamily: "'Playfair Display', Georgia, serif",
                textAlign: 'center', boxShadow: '0 12px 30px rgba(184,135,74,0.35)',
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 400, lineHeight: 1 }}>20</div>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', marginTop: '0.2rem', opacity: 0.85, textTransform: 'uppercase' }}>лет</div>
              </div>
            </div>
          </Reveal>

          {/* text side */}
          <Reveal delay={0.25}>
            <div>
              <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 500 }}>
                Наша история
              </p>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400,
                color: DARK, lineHeight: 1.2, marginBottom: '2rem',
              }}>
                Пространства, созданные с душой
              </h2>
              <p style={{ color: WARM_GRAY, lineHeight: 1.95, marginBottom: '1.4rem', fontSize: '0.92rem', fontWeight: 300 }}>
                В 2005 году основатель компании открыл небольшой склад в Москве с мечтой — сделать натуральный камень доступным для каждого. Сегодня ZarStone — это 3 000 м² выставочных залов, собственное производство и команда из 80 специалистов.
              </p>
              <p style={{ color: WARM_GRAY, lineHeight: 1.95, fontSize: '0.92rem', fontWeight: 300 }}>
                Мы работаем с лучшими карьерами Италии, Испании, Индии и России. Каждый материал проходит многоступенчатый контроль качества перед тем, как попасть к покупателю.
              </p>
              <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2.5rem' }}>
                {[['Италия', 'Каррарский мрамор'], ['Испания', 'Травертин'], ['Россия', 'Гранит']].map(([country, material]) => (
                  <div key={country}>
                    <div style={{ fontSize: '0.65rem', color: GOLD, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '0.25rem' }}>{country}</div>
                    <div style={{ fontSize: '0.78rem', color: DARK }}>{material}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──── FULL-WIDTH DIVIDER IMAGE ──── */}
      <div style={{ position: 'relative', height: '55vh', overflow: 'hidden' }}>
        <img src={IMG.divider} alt="Мрамор" style={{ width: '100%', height: '130%', objectFit: 'cover', objectPosition: 'center', display: 'block', position: 'absolute', top: '-15%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,6,0.55)' }} />
        <Reveal style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <p style={{ color: GOLD, letterSpacing: '0.5em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Наша философия</p>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              color: '#fff', fontWeight: 400, fontStyle: 'italic',
              maxWidth: '700px', margin: '0 auto', lineHeight: 1.5,
            }}>
              «Камень — это время, застывшее в форме. Мы лишь помогаем ему найти своё место»
            </p>
          </div>
        </Reveal>
      </div>

      {/* ──── GALLERY ──── */}
      <section style={{ background: DARK, padding: '6rem 2.5rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
              <div>
                <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Наши материалы</p>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15 }}>
                  Галерея<br /><em style={{ color: GOLD }}>работ</em>
                </h2>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', maxWidth: '240px', textAlign: 'right', lineHeight: 1.7 }}>
                Каждый материал — это уникальное творение природы
              </p>
            </div>
          </Reveal>

          {/* asymmetric masonry grid */}
          <div
            className="gallery-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gridTemplateRows: 'auto auto',
              gridTemplateAreas: `"a a b" "c d b"`,
              gap: '12px',
            }}
          >
            {[
              { src: IMG.g1, label: 'Гранит', area: 'a', ratio: '16/7' },
              { src: IMG.g2, label: 'Мрамор', area: 'b', ratio: '3/4' },
              { src: IMG.g3, label: 'Керамика', area: 'c', ratio: '4/3' },
              { src: IMG.g4, label: 'Интерьер', area: 'd', ratio: '4/3' },
            ].map((g) => (
              <Reveal
                key={g.label}
                delay={0.05}
                style={{ gridArea: g.area, borderRadius: '2px', overflow: 'hidden', position: 'relative', aspectRatio: g.ratio }}
                className="gallery-item"
              >
                <img src={g.src} alt={g.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.55))',
                  display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
                  padding: '1.2rem',
                }}>
                  <span style={{
                    color: '#fff', fontSize: '0.65rem', letterSpacing: '0.2em',
                    textTransform: 'uppercase', fontWeight: 500,
                    borderBottom: `1px solid ${GOLD}`, paddingBottom: '3px',
                  }}>{g.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── TIMELINE ──── */}
      <section style={{ background: '#fff', padding: '7rem 2.5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Reveal>
            <div style={{ marginBottom: '4rem' }}>
              <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '0.6rem' }}>История роста</p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 400, color: DARK }}>
                Хронология
              </h2>
            </div>
          </Reveal>

          <div style={{ position: 'relative' }}>
            {/* vertical line */}
            <div style={{ position: 'absolute', left: '80px', top: '8px', bottom: '8px', width: '1px', background: `linear-gradient(to bottom, transparent, ${GOLD}55, transparent)` }} />

            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.08} className="timeline-row">
                <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2.8rem', alignItems: 'flex-start', cursor: 'default' }}>
                  <div style={{
                    minWidth: '80px', textAlign: 'right',
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1rem', color: GOLD, fontWeight: 400, paddingTop: '3px',
                  }}>{t.year}</div>
                  <div style={{ position: 'relative', paddingLeft: '2.2rem' }}>
                    <div
                      className="timeline-dot"
                      style={{
                        position: 'absolute', left: '-4px', top: '8px',
                        width: '8px', height: '8px', background: GOLD, borderRadius: '50%',
                        boxShadow: `0 0 0 3px #fff, 0 0 0 4px ${GOLD}55`,
                      }}
                    />
                    <p style={{ color: WARM_GRAY, lineHeight: 1.85, fontSize: '0.9rem', fontWeight: 300 }}>{t.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── VALUES ──── */}
      <section style={{ background: CREAM, padding: '5rem 2.5rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <Reveal>
            <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '0.6rem', textAlign: 'center' }}>Наши принципы</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 400, color: DARK, textAlign: 'center', marginBottom: '4rem' }}>
              Почему выбирают нас
            </h2>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2px', background: 'rgba(0,0,0,0.06)' }}>
            {[
              { icon: '◈', title: 'Качество', desc: 'Многоступенчатый контроль каждого камня от карьера до укладки' },
              { icon: '◉', title: 'Экспертиза', desc: '20 лет работы с природным камнем и 80 специалистов в команде' },
              { icon: '◐', title: 'Выбор', desc: '120 видов материалов из лучших карьеров Европы, Азии и России' },
              { icon: '◎', title: 'Сервис', desc: 'Замер, проект, доставка и монтаж под ключ в 47 регионах' },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div style={{ background: '#fff', padding: '3rem 2.5rem', cursor: 'default' }}>
                  <div style={{ fontSize: '1.4rem', color: GOLD, marginBottom: '1.2rem', lineHeight: 1 }}>{v.icon}</div>
                  <h3 style={{ fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: DARK, marginBottom: '0.8rem' }}>
                    {v.title}
                  </h3>
                  <p style={{ color: WARM_GRAY, fontSize: '0.85rem', lineHeight: 1.8, fontWeight: 300 }}>{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '520px', display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG.cta})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,8,6,0.8)' }} />

        <div style={{ position: 'relative', width: '100%', maxWidth: '1300px', margin: '0 auto', padding: '5rem 2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Reveal>
            <p style={{ color: GOLD, letterSpacing: '0.5em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Готовы начать?</p>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 400, color: '#fff', marginBottom: '1rem', lineHeight: 1.15,
            }}>
              Обсудим<br /><em style={{ color: GOLD }}>ваш проект</em>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.8, margin: '0 auto 2.5rem', fontWeight: 300 }}>
              Наши специалисты подберут материал и воплотят любую идею в жизнь
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => navigate('/collections')}
                style={{
                  background: GOLD, color: '#fff', border: 'none',
                  padding: '1rem 2.8rem', fontSize: '0.68rem',
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: '100px',
                  fontFamily: 'inherit', fontWeight: 500,
                }}
              >
                Смотреть каталог
              </button>
              <button
                className="btn-ghost"
                onClick={() => navigate('/contacts')}
                style={{
                  background: 'transparent', color: 'rgba(255,255,255,0.75)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '1rem 2.8rem', fontSize: '0.68rem',
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                  cursor: 'pointer', borderRadius: '100px',
                  fontFamily: 'inherit', transition: 'all 0.3s',
                }}
              >
                Связаться
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default About;
