import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GOLD = '#B8874A';
const DARK = '#0D0B09';
const CREAM = '#F5F0E8';
const WARM_GRAY = '#8C8680';

const PHONE = '+998 87 807 10 12';
const PHONE_HREF = 'tel:+998878071012';
const PHONE_WA   = 'https://wa.me/998878071012';

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

const Reveal = ({ children, delay = 0, style = {} }) => {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(24px)' : 'translateY(0)', // Исправлена логика анимации
      transform: vis ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
};

const channels = [
  {
    label: 'Телефон',
    value: PHONE,
    hint: 'Пн–Пт 9:00–18:00',
    href: PHONE_HREF,
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7 4C7 4 5 4 4 6.5C3 9 4.5 11.5 6.5 13.5C8.5 15.5 11 17 13.5 16.5C16 16 16.5 14.5 16.5 14.5L13.5 11.5L12 12.5C12 12.5 10.5 11.5 9 10C7.5 8.5 6.5 7 6.5 7L8 5.5L6 3.5L7 4Z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    value: PHONE,
    hint: 'Ответим быстро',
    href: PHONE_WA,
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C7.03 3 3 7.03 3 12c0 1.68.46 3.25 1.26 4.6L3 21l4.54-1.22A8.96 8.96 0 0012 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 10.5c.5 1 1.5 2.5 2.5 3s2-.5 2-.5l1.5 1.5c0 0-1 2-3 1.5S8.5 14.5 8 13s.5-3 .5-3L9 10.5z" stroke={GOLD} strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'info@zarstone.ru',
    hint: 'Ответим за 1 час',
    href: 'mailto:info@zarstone.ru',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke={GOLD} strokeWidth="1.5"/>
        <path d="M3 8l9 6 9-6" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Telegram',
    value: '@zarstone',
    hint: 'Пишите в любое время',
    href: 'https://t.me/zarstone',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 4L3 11l7 3 9-8-7 9 3 7 6-18z" stroke={GOLD} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const ContactUs = () => {
  const navigate = useNavigate();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const [focused, setFocused] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80&fit=crop';
    img.onload = () => setHeroLoaded(true);
  }, []);

  const inputStyle = (field) => ({
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${focused === field ? GOLD : 'rgba(0,0,0,0.13)'}`,
    outline: 'none', padding: '0.85rem 0', fontSize: '0.9rem',
    fontFamily: "'DM Sans', sans-serif", color: DARK,
    transition: 'border-color 0.3s', letterSpacing: '0.02em',
  });

  const handleSend = () => {
    if (!form.name || !form.contact) return;
    const text = `Имя: ${form.name}%0AКонтакт: ${form.contact}%0AСообщение: ${form.message}`;
    window.open(`${PHONE_WA}?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <div style={{ background: CREAM, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-track{background:${CREAM};}
        ::-webkit-scrollbar-thumb{background:${GOLD};border-radius:2px;}
        ::placeholder{color:${WARM_GRAY};opacity:0.55;font-family:'DM Sans',sans-serif;font-size:0.88rem;}
        .back-btn:hover{color:${GOLD} !important;border-color:rgba(184,135,74,0.4) !important;}
        .channel-card{transition:transform 0.3s,box-shadow 0.3s,border-color 0.3s;cursor:pointer;}
        .channel-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,0.08);border-color:${GOLD} !important;}
        .send-btn{transition:all 0.3s;}
        .send-btn:hover{background:#C9964E !important;letter-spacing:0.34em !important;}
        @keyframes checkmark{from{stroke-dashoffset:40}to{stroke-dashoffset:0}}
        @media(max-width:768px){.grid-2{grid-template-columns:1fr !important;}.channels{grid-template-columns:1fr 1fr !important;}}
      `}</style>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '60vh', minHeight: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80&fit=crop)',
          backgroundSize: 'cover', backgroundPosition: 'center 40%',
          opacity: heroLoaded ? 1 : 0, transition: 'opacity 1.2s ease',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,6,0.93) 0%, rgba(10,8,6,0.4) 55%, rgba(10,8,6,0.18) 100%)' }} />

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
            fontSize: 'clamp(3rem, 6.5vw, 5rem)',
            fontWeight: 400, color: '#fff', lineHeight: 1.05,
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.1s cubic-bezier(0.22,1,0.36,1) 0.2s',
          }}>
            Как с нами<br /><em style={{ color: GOLD }}>связаться</em>
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.42)', fontSize: '0.88rem', maxWidth: '360px',
            lineHeight: 1.85, marginTop: '1.2rem', fontWeight: 300,
            opacity: heroLoaded ? 1 : 0, transition: 'opacity 1s 0.6s',
          }}>
            Выберите удобный способ — ответим быстро и по делу
          </p>
        </div>
      </section>

      {/* ── CHANNELS ── */}
      <section style={{ background: '#fff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2.5rem' }}>
          <div className="channels" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(0,0,0,0.06)' }}>
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.07}>
                <a 
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <div className="channel-card" style={{ background: '#fff', padding: '2.8rem 2rem', border: '1px solid transparent' }}>
                    <div style={{ marginBottom: '1.3rem' }}>{c.svg}</div>
                    <div style={{ fontSize: '0.62rem', color: GOLD, letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '0.5rem' }}>{c.label}</div>
                    <div style={{ fontSize: '0.92rem', color: DARK, fontWeight: 400, marginBottom: '0.3rem' }}>{c.value}</div>
                    <div style={{ fontSize: '0.73rem', color: WARM_GRAY, fontWeight: 300 }}>{c.hint}</div>
                    <div style={{ width: '18px', height: '1.5px', background: GOLD, marginTop: '1.4rem', borderRadius: '1px' }} />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + INFO ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '7rem 2.5rem' }}>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7rem', alignItems: 'start' }}>

          {/* FORM */}
          <Reveal>
            <p style={{ color: GOLD, letterSpacing: '0.45em', fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '0.6rem', fontWeight: 500 }}>Оставить заявку</p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, color: DARK, lineHeight: 1.2, marginBottom: '2.8rem' }}>
              Напишите нам —<br /><em style={{ color: GOLD }}>ответим за час</em>
            </h2>

            {sent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ marginBottom: '1.5rem' }}>
                  <circle cx="30" cy="30" r="28" stroke={GOLD} strokeWidth="1.5"/>
                  <path d="M18 30l9 9 15-18" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ strokeDasharray: 40, animation: 'checkmark 0.6s ease forwards' }}/>
                </svg>
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', color: DARK, marginBottom: '0.5rem' }}>Сообщение отправлено</p>
                <p style={{ color: WARM_GRAY, fontSize: '0.83rem', fontWeight: 300 }}>Свяжемся с вами в ближайшее время</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <input type="text" placeholder="Ваше имя" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
                  style={inputStyle('name')} />
                <input type="text" placeholder="Телефон или email" value={form.contact}
                  onChange={e => setForm({ ...form, contact: e.target.value })}
                  onFocus={() => setFocused('contact')} onBlur={() => setFocused('')}
                  style={inputStyle('contact')} />
                <textarea rows={4} placeholder="Ваш вопрос или комментарий..." value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  onFocus={() => setFocused('message')} onBlur={() => setFocused('')}
                  style={{ ...inputStyle('message'), resize: 'none' }} />
                <div>
                  <button className="send-btn" onClick={handleSend} style={{
                    background: GOLD, color: '#fff', border: 'none',
                    padding: '1rem 2.8rem', fontSize: '0.68rem',
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                    cursor: 'pointer', borderRadius: '100px',
                    fontFamily: 'inherit', fontWeight: 500,
                  }}>Отправить</button>
                  <p style={{ color: WARM_GRAY, fontSize: '0.68rem', marginTop: '0.9rem', fontWeight: 300, lineHeight: 1.6 }}>
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </div>
              </div>
            )}
          </Reveal>

          {/* RIGHT INFO */}
          <Reveal delay={0.18}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <div>
                <p style={{ color: GOLD, fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '1rem' }}>Шоурум</p>
                <p style={{ fontSize: '1.05rem', color: DARK, fontWeight: 400, marginBottom: '0.4rem' }}>Москва, ул. Промышленная, 18</p>
                <p style={{ color: WARM_GRAY, fontSize: '0.83rem', fontWeight: 300, lineHeight: 1.7 }}>Пн–Пт: 9:00–18:00<br />Суббота: 10:00–15:00</p>
              </div>

              <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }} />

              <div>
                <p style={{ color: GOLD, fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '1.2rem' }}>Мы в социальных сетях</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {[
                    { name: 'Instagram', handle: '@zarstone_official' },
                    { name: 'ВКонтакте', handle: 'vk.com/zarstone' },
                    { name: 'YouTube', handle: 'ZarStone Channel' },
                  ].map(s => (
                    <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.9rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '0.83rem', color: WARM_GRAY, fontWeight: 300 }}>{s.name}</span>
                      <span style={{ fontSize: '0.8rem', color: DARK, fontWeight: 400 }}>{s.handle}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }} />

              <div style={{ background: DARK, borderRadius: '2px', padding: '2rem' }}>
                <p style={{ color: GOLD, fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '0.8rem' }}>Время ответа</p>
                {[
                  ['Телефон / WhatsApp', 'моментально'],
                  ['Telegram', '~15 минут'],
                  ['Email / форма', '~1 час'],
                ].map(([ch, time]) => (
                  <div key={ch} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontWeight: 300 }}>{ch}</span>
                    <span style={{ fontSize: '0.78rem', color: GOLD, fontWeight: 400 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER STRIP ── */}
      <div style={{ background: DARK, padding: '2.5rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>© 2026 ZarStone — Всё о природном камне</p>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Каталог', 'О нас', 'Доставка'].map(link => (
            <button key={link} onClick={() => navigate(`/${link.toLowerCase()}`)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'inherit', transition: 'color 0.25s' }}
              onMouseEnter={e => e.currentTarget.style.color = GOLD}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >{link}</button>
          ))}
        </div>
      </div>
    </div>
  );
}; // ← Закрывающая скобка компонента теперь здесь

export default ContactUs;