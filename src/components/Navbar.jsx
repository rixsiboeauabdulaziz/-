import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [role, setRole] = useState(localStorage.getItem("role"))
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [favCount, setFavCount] = useState(0)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

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
    { label: "Главная", to: "/" },
    { label: "Коллекции", to: "/collections" },
    { label: "О компании", to: "/about" },
    { label: "Доставка", to: "/delivery" },
    { label: "Контакты", to: "/contacts" },
  ]

  const adminLinks = [
    { label: "Главная", to: "/" },
    { label: "Коллекции", to: "/collections" },
    { label: "Категории", to: "/AdminCategories" },
    { label: "Товары", to: "/AdminProducts" },
    { label: "Пользователи", to: "/admin/users" },
    { label: "Заказы", to: "/AdminOrders" },
  ]

  const navLinks = role === "ADMIN" ? adminLinks : userLinks
  const avatarLetter = role === "ADMIN" ? "A" : "U"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap');

        .nb-root {
          position: sticky; top: 0; z-index: 100;
          background: #0a0a0a;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          font-family: 'Montserrat', sans-serif;
        }
        .nb-root.nb-scrolled {
          box-shadow: 0 4px 40px rgba(0,0,0,0.7);
          border-color: rgba(212,175,55,0.15);
        }
        .nb-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 28px;
          height: 90px;
          display: flex; align-items: center; justify-content: space-between;
        }

        .nb-logo-container {
          display: flex; align-items: center;
          text-decoration: none; transition: opacity 0.2s;
        }
        .nb-logo-container:hover { opacity: 0.8; }

        .nb-logo-img {
          height: 80px;
          width: auto;
          display: block;
          filter: brightness(1.1);
        }

        .nb-admin-badge {
          font-family: 'Montserrat', sans-serif; font-size: 0.55rem;
          font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
          background: #D4AF37; color: #0a0a0a; padding: 2px 7px; border-radius: 2px;
          margin-left: 10px; vertical-align: middle;
        }
        .nb-links {
          display: flex; align-items: center; gap: 32px;
          list-style: none; margin: 0; padding: 0;
        }
        .nb-link {
          font-size: 0.7rem; font-weight: 400; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(255,255,255,0.5);
          text-decoration: none; transition: color 0.2s; position: relative;
        }
        .nb-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          width: 0; height: 1px; background: #D4AF37; transition: width 0.25s ease;
        }
        .nb-link:hover { color: #D4AF37; }
        .nb-link:hover::after { width: 100%; }

        .nb-auth { display: flex; align-items: center; gap: 10px; }
        .nb-divider { width: 1px; height: 18px; background: rgba(255,255,255,0.1); margin: 0 4px; }

        .nb-fav-btn {
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7); font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 8px 18px; border-radius: 2px;
          cursor: pointer; text-decoration: none; display: inline-flex;
          align-items: center; gap: 6px; transition: border-color 0.2s, color 0.2s;
        }
        .nb-fav-btn:hover { border-color: #D4AF37; color: #D4AF37; }
        .nb-fav-count {
          background: #D4AF37; color: #0a0a0a; font-size: 0.6rem; font-weight: 700;
          width: 16px; height: 16px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .nb-btn-ghost {
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.7); font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.18em;
          text-transform: uppercase; padding: 8px 18px; border-radius: 2px;
          cursor: pointer; text-decoration: none; display: inline-flex;
          align-items: center; transition: border-color 0.2s, color 0.2s;
        }
        .nb-btn-ghost:hover { border-color: #D4AF37; color: #D4AF37; }
        .nb-btn-solid {
          background: #D4AF37; border: 1px solid #D4AF37; color: #0a0a0a;
          font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase; padding: 8px 18px;
          border-radius: 2px; cursor: pointer; text-decoration: none;
          display: inline-flex; align-items: center; transition: opacity 0.2s;
        }
        .nb-btn-solid:hover { opacity: 0.85; }

        .nb-account-wrap { position: relative; }
        .nb-account-btn {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #D4AF37, #a07d1c);
          border: 2px solid rgba(212,175,55,0.4);
          color: #0a0a0a; font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .nb-account-btn:hover {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.15);
        }
        .nb-account-btn.open {
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.2);
        }

        .nb-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          background: #111; border: 1px solid rgba(212,175,55,0.2);
          border-radius: 4px; width: 200px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.6);
          animation: dropIn 0.15s ease;
          overflow: hidden;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        .nb-dropdown-header {
          padding: 14px 16px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nb-dropdown-role {
          font-size: 0.55rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: #D4AF37; margin-bottom: 2px;
        }
        .nb-dropdown-label {
          font-size: 0.75rem; color: rgba(255,255,255,0.7); font-weight: 500;
        }
        .nb-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; font-size: 0.7rem; letter-spacing: 0.08em;
          color: rgba(255,255,255,0.55); text-decoration: none;
          transition: background 0.15s, color 0.15s;
          cursor: pointer; border: none; background: none;
          width: 100%; text-align: left; font-family: 'Montserrat', sans-serif;
        }
        .nb-dropdown-item:hover { background: rgba(255,255,255,0.04); color: #fff; }
        .nb-dropdown-item svg { opacity: 0.5; flex-shrink: 0; }
        .nb-dropdown-item:hover svg { opacity: 1; }
        .nb-dropdown-sep { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 0; }
        .nb-dropdown-item.logout { color: rgba(220,80,80,0.7); }
        .nb-dropdown-item.logout:hover { background: rgba(200,50,50,0.08); color: #e05555; }
        .nb-dropdown-item.logout svg { opacity: 0.6; }

        .nb-hamburger {
          display: none; flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer; padding: 4px;
        }
        .nb-hamburger span {
          display: block; width: 22px; height: 1px;
          background: rgba(255,255,255,0.6);
          transition: transform 0.25s, opacity 0.25s;
        }
        .nb-hamburger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .nb-hamburger.open span:nth-child(2) { opacity: 0; }
        .nb-hamburger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .nb-mobile {
          display: none; flex-direction: column; background: #0d0d0d;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 16px 28px 24px; gap: 12px;
        }
        .nb-mobile.open { display: flex; }
        .nb-mobile .nb-link { font-size: 0.75rem; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .nb-mobile-auth { display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; }

        @media (max-width: 768px) {
          .nb-links { display: none; }
          .nb-auth  { display: none; }
          .nb-hamburger { display: flex; }
          .nb-logo-img { height: 60px; }
          .nb-inner { height: 75px; }
        }
      `}</style>

      <nav className={`nb-root${scrolled ? " nb-scrolled" : ""}`}>
        <div className="nb-inner">

          {/* Логотип */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link to="/" className="nb-logo-container">
              <img
                src="/src/ChatGPT Image 6 мая 2026 г., 10_18_57.png"
                alt="Керамогранит"
                className="nb-logo-img"
              />
            </Link>
            {role === "ADMIN" && <span className="nb-admin-badge">Admin</span>}
          </div>

          {/* Ссылки */}
          <ul className="nb-links">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="nb-link">{l.label}</Link>
              </li>
            ))}
          </ul>

          {/* Auth блок */}
          <div className="nb-auth">
            {role !== "ADMIN" && (
              <Link to="/favorites" className="nb-fav-btn">
                ♡ Избранное
                {favCount > 0 && <span className="nb-fav-count">{favCount}</span>}
              </Link>
            )}

            <div className="nb-divider" />

            {token ? (
              <div className="nb-account-wrap" ref={dropdownRef}>
                <button
                  className={`nb-account-btn${dropdownOpen ? " open" : ""}`}
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-label="Аккаунт"
                >
                  {avatarLetter}
                </button>

                {dropdownOpen && (
                  <div className="nb-dropdown">
                    <div className="nb-dropdown-header">
                      <div className="nb-dropdown-role">{role === "ADMIN" ? "Администратор" : "Пользователь"}</div>
                      <div className="nb-dropdown-label">Мой аккаунт</div>
                    </div>

                    <Link to="/profile" className="nb-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                      Профиль
                    </Link>

                    {role === "ADMIN" && (
                      <Link to="/AdminProducts" className="nb-dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                          <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                        </svg>
                        Панель админа
                      </Link>
                    )}

                    <Link to="/orders" className="nb-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                      Мои заказы
                    </Link>

                    <hr className="nb-dropdown-sep" />

                    <button className="nb-dropdown-item logout" onClick={handleLogout}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nb-btn-ghost">Войти</Link>
                <Link to="/register" className="nb-btn-solid">Регистрация</Link>
              </>
            )}
          </div>

          <button
            className={`nb-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Мобильное меню */}
        <div className={`nb-mobile${menuOpen ? " open" : ""}`}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="nb-link" onClick={() => setMenuOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="nb-mobile-auth">
            {token ? (
              <button className="nb-btn-ghost" onClick={handleLogout}>Выход</button>
            ) : (
              <>
                <Link to="/login" className="nb-btn-ghost" onClick={() => setMenuOpen(false)}>Войти</Link>
                <Link to="/register" className="nb-btn-solid" onClick={() => setMenuOpen(false)}>Регистрация</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar