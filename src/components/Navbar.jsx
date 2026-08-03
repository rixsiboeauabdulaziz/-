import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Navbar() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [role, setRole] = useState(localStorage.getItem("role"))
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [favCount, setFavCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const changeLang = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('lang', lang)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const updateCount = () => {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
      setFavCount(favs.length)
    }
    updateCount()
    window.addEventListener('favoritesUpdated', updateCount)
    return () => window.removeEventListener('favoritesUpdated', updateCount)
  }, [])

  useEffect(() => {
    const syncAuth = () => {
      setToken(localStorage.getItem("token"))
      setRole(localStorage.getItem("role"))
    }
    window.addEventListener("authChanged", syncAuth)
    return () => window.removeEventListener("authChanged", syncAuth)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    setToken(null)
    setRole(null)
    setDropdownOpen(false)
    window.dispatchEvent(new Event("authChanged"))
    navigate("/login")
  }

  const userLinks = [
    { label: t('nav.home'), to: "/" },
    { label: t('nav.collections'), to: "/collections" },
    { label: t('nav.about'), to: "/about" },
    { label: t('nav.delivery'), to: "/delivery" },
    { label: t('nav.contacts'), to: "/contacts" },
  ]

  const adminLinks = [
    { label: t('nav.home'), to: "/" },
    { label: t('nav.collections'), to: "/collections" },
    { label: t('nav.categories'), to: "/AdminCategories" },
    { label: t('nav.products'), to: "/AdminProducts" },
    { label: t('nav.orders'), to: "/AdminOrders" },
  ]

  const navLinks = role === "ADMIN" ? adminLinks : userLinks
  const avatarLetter = role === "ADMIN" ? "A" : "U"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
  
        .nb-root {
          position: sticky; top: 0; z-index: 1000;
          background: #0a0a0a;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          font-family: 'Montserrat', sans-serif;
          width: 100%;
        }
        
        .nb-inner {
          max-width: 1440px; margin: 0 auto; padding: 0 20px;
          height: 80px;
          display: flex; align-items: center; justify-content: space-between;
        }
  
        /* Группа логотипа */
        .nb-left-sec { display: flex; align-items: center; gap: 15px; flex-shrink: 0; }
        .nb-logo-img { height: 60px; width: auto; object-fit: contain; }
  
        /* Центральное меню - исправляем наслоение текста */
        .nb-links {
          display: flex; 
          align-items: center; 
          gap: 25px; /* Расстояние между пунктами */
          list-style: none; margin: 0; padding: 0;
          flex-grow: 1;
          justify-content: center;
        }
        .nb-link {
          font-size: 11px; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
          text-decoration: none; transition: 0.2s;
          white-space: nowrap; /* Запрещаем перенос слова */
        }
        .nb-link:hover { color: #D4AF37; }
  
        /* Правая часть (языки, избранное, вход) */
        .nb-right-sec { 
          display: flex; align-items: center; gap: 15px; flex-shrink: 0; 
        }
  
        /* Переключатель языков */
        .nb-lang-box {
          display: flex; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px; overflow: hidden; height: 32px;
        }
        .nb-lang-btn {
          background: none; border: none; padding: 0 12px;
          color: rgba(255,255,255,0.4); font-size: 10px; font-weight: 700;
          cursor: pointer; transition: 0.2s;
        }
        .nb-lang-btn.active { background: #D4AF37; color: #000; }
  
        /* Кнопка избранного иконкой (чтобы не ломать верстку длинным словом) */
        .nb-fav-circle {
          position: relative; width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;
          color: #fff; text-decoration: none; transition: 0.2s;
        }
        .nb-fav-circle:hover { border-color: #D4AF37; color: #D4AF37; }
        .nb-badge {
          position: absolute; top: -6px; right: -6px;
          background: #D4AF37; color: #000; font-size: 9px; font-weight: 800;
          min-width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
  
        /* Кнопки авторизации */
        .nb-auth-btns { display: flex; align-items: center; gap: 10px; }
        .nb-btn {
          padding: 10px 18px; font-size: 11px; font-weight: 600;
          text-transform: uppercase; border-radius: 4px; border: none;
          cursor: pointer; text-decoration: none; transition: 0.2s;
          white-space: nowrap;
        }
        .nb-btn-login { color: #fff; border: 1px solid rgba(255,255,255,0.2); background: none; }
        .nb-btn-login:hover { border-color: #D4AF37; color: #D4AF37; }
        .nb-btn-reg { background: #D4AF37; color: #000; }
        .nb-btn-reg:hover { background: #c09d31; }
  
        /* Аватар и выпадашка */
        .nb-user-wrap { position: relative; }
        .nb-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: #D4AF37; color: #000; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: none; cursor: pointer;
        }
        .nb-drop {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #111; border: 1px solid #222; width: 200px;
          border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .nb-drop-item {
          display: block; width: 100%; padding: 12px 15px;
          color: #ccc; text-decoration: none; font-size: 13px;
          text-align: left; background: none; border: none; cursor: pointer;
        }
        .nb-drop-item:hover { background: #1a1a1a; color: #fff; }
  
        /* Мобильный гамбургер (скрыт на ПК) */
        .nb-hamb { display: none; background: none; border: none; cursor: pointer; }
  
        @media (max-width: 1024px) {
          .nb-links { display: none; }
          .nb-auth-btns { display: none; }
          .nb-hamb { display: block; }
        }
      `}</style>
  
      <nav className="nb-root">
        <div className="nb-inner">
          
          {/* Лево: Лого */}
          <div className="nb-left-sec">
            <Link to="/">
              <img src="/src/ChatGPT Image 6 мая 2026 г., 10_18_57.png" alt="Logo" className="nb-logo-img" />
            </Link>
          </div>
  
          {/* Центр: Ссылки */}
          <ul className="nb-links">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="nb-link">{l.label}</Link>
              </li>
            ))}
          </ul>
  
          {/* Право: Инструменты */}
          <div className="nb-right-sec">
            {/* Переключатель RU/UZ */}
            <div className="nb-lang-box">
              <button onClick={() => changeLang('ru')} className={`nb-lang-btn ${i18n.language === 'ru' ? 'active' : ''}`}>RU</button>
              <button onClick={() => changeLang('uz')} className={`nb-lang-btn ${i18n.language === 'uz' ? 'active' : ''}`}>UZ</button>
            </div>
  
            {/* Избранное (Иконкой, чтобы не ломать верстку) */}
            {role !== "ADMIN" && (
              <Link to="/favorites" className="nb-fav-circle">
                <span style={{fontSize: '18px'}}>♡</span>
                {favCount > 0 && <span className="nb-badge">{favCount}</span>}
              </Link>
            )}
  
            {/* Юзер / Кнопки */}
            {token ? (
              <div className="nb-user-wrap" ref={dropdownRef}>
                <button className="nb-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {avatarLetter}
                </button>
                {dropdownOpen && (
                  <div className="nb-drop">
                    <div style={{padding: '10px 15px', borderBottom: '1px solid #222', fontSize: '11px', color: '#666'}}>
                      {role === 'ADMIN' ? 'АДМИНИСТРАТОР' : 'ПОЛЬЗОВАТЕЛЬ'}
                    </div>
                    <Link to="/profile" className="nb-drop-item" onClick={() => setDropdownOpen(false)}>Профиль</Link>
                    <Link to="/orders" className="nb-drop-item" onClick={() => setDropdownOpen(false)}>Мои заказы</Link>
                    <button className="nb-drop-item" style={{color: '#ff4d4d'}} onClick={handleLogout}>Выйти</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nb-auth-btns">
                <Link to="/login" className="nb-btn nb-btn-login">Войти</Link>
                <Link to="/register" className="nb-btn nb-btn-reg">Регистрация</Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar