import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import instance from "../axios"

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", phone: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState("")

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await instance.post("/login", form)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)
      window.dispatchEvent(new Event("authChanged"))
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Неверный email или пароль")
    } finally {
      setLoading(false)
    }
  }

  const s = {
    page: {
      position: "fixed",
      inset: 0,
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Montserrat', sans-serif",
      overflow: "hidden",
    },
    orb1: {
      position: "absolute",
      width: "500px", height: "500px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
      top: "-120px", right: "-100px",
      pointerEvents: "none",
    },
    orb2: {
      position: "absolute",
      width: "400px", height: "400px",
      borderRadius: "50%",
      background: "radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)",
      bottom: "-80px", left: "-80px",
      pointerEvents: "none",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      margin: "0 1rem",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "2px",
      padding: "2rem 2.2rem 1.8rem",
      backdropFilter: "blur(20px)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
      position: "relative",
      zIndex: 1,
      boxSizing: "border-box",
    },
    cornerTL: {
      position: "absolute", top: 0, left: 0,
      width: "24px", height: "24px",
      borderTop: "1px solid #c9a96e",
      borderLeft: "1px solid #c9a96e",
    },
    cornerBR: {
      position: "absolute", bottom: 0, right: 0,
      width: "24px", height: "24px",
      borderBottom: "1px solid #c9a96e",
      borderRight: "1px solid #c9a96e",
    },
    eyebrow: {
      color: "#c9a96e",
      fontSize: "0.55rem",
      letterSpacing: "0.45em",
      textTransform: "uppercase",
      textAlign: "center",
      margin: "0 0 0.4rem",
    },
    heading: {
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      color: "#f0ebe3",
      fontSize: "2rem",
      fontWeight: 300,
      textAlign: "center",
      margin: 0,
      letterSpacing: "0.04em",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      margin: "1rem 0",
    },
    dividerLine: {
      flex: 1, height: "1px",
      background: "linear-gradient(to right, transparent, rgba(201,169,110,0.3), transparent)",
    },
    dividerDot: {
      width: "4px", height: "4px",
      borderRadius: "50%",
      background: "#c9a96e",
      opacity: 0.6,
    },
    errorBox: {
      background: "rgba(220,50,50,0.12)",
      border: "1px solid rgba(220,50,50,0.3)",
      borderRadius: "2px",
      color: "#ff8080",
      fontSize: "0.7rem",
      padding: "0.6rem 0.8rem",
      textAlign: "center",
      marginBottom: "1rem",
    },
    fieldWrap: { marginBottom: "1.1rem" },
    label: {
      display: "block",
      color: "#6b6560",
      fontSize: "0.55rem",
      letterSpacing: "0.35em",
      textTransform: "uppercase",
      marginBottom: "0.4rem",
      transition: "color 0.2s",
    },
    input: {
      width: "100%",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      color: "#f0ebe3",
      fontSize: "0.85rem",
      padding: "0.5rem 0",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
      fontFamily: "'Montserrat', sans-serif",
    },
    btn: {
      width: "100%",
      background: "linear-gradient(135deg, #c9a96e, #b8913e)",
      border: "none",
      borderRadius: "1px",
      color: "#0a0a0a",
      padding: "0.8rem",
      fontSize: "0.6rem",
      fontWeight: 700,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "'Montserrat', sans-serif",
      marginTop: "0.8rem",
      transition: "opacity 0.2s",
    },
    footer: {
      textAlign: "center",
      marginTop: "1rem",
      color: "#4a4540",
      fontSize: "0.65rem",
      letterSpacing: "0.06em",
    },
    link: { color: "#c9a96e", textDecoration: "none" },
  }

  const fields = [
    { name: "email",    label: "Email",   type: "email" },
    { name: "phone",    label: "Телефон", type: "tel" },
    { name: "password", label: "Пароль",  type: "password" },
  ]

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Cormorant+Garamond:wght@300;400&display=swap" rel="stylesheet" />
      <div style={s.orb1} />
      <div style={s.orb2} />

      <div style={s.card}>
        <div style={s.cornerTL} />
        <div style={s.cornerBR} />

        <p style={s.eyebrow}>Добро пожаловать</p>
        <h1 style={s.heading}>Вход</h1>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <div style={s.dividerDot} />
          <div style={s.dividerLine} />
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type }) => (
            <div key={name} style={s.fieldWrap}>
              <label style={{ ...s.label, ...(focused === name ? { color: "#c9a96e" } : {}) }}>
                {label}
              </label>
              <input
                name={name}
                type={type}
                onChange={handleChange}
                onFocus={() => setFocused(name)}
                onBlur={() => setFocused("")}
                style={{
                  ...s.input,
                  borderBottom: focused === name
                    ? "1px solid #c9a96e"
                    : "1px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{ ...s.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.8" }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p style={s.footer}>
          Нет аккаунта?{" "}
          <Link to="/register" style={s.link}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
