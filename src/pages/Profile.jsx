import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../axios"   // ← твой инстанс

function Profile() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)
  const [message, setMessage] = useState(null)
  const [form, setForm]       = useState({ username: "", phone: "", email: "" })
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" })
  const [pwError, setPwError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }

    axios.get("/me")
      .then(({ data }) => {
        setUser(data)
        setForm({ username: data.username, phone: data.phone, email: data.email })
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false))
  }, [navigate])

  // ✅ ГАРДЫ — строго до любого обращения к user
  if (loading) return (
    <div style={styles.page}>
      <p style={{ color: "rgba(255,255,255,.3)", letterSpacing: ".2em", fontSize: ".7rem" }}>
        ЗАГРУЗКА...
      </p>
    </div>
  )

  if (!user) return (
    <div style={styles.page}>
      <p style={{ color: "#e05555", fontSize: ".85rem" }}>Не удалось загрузить профиль</p>
    </div>
  )

  // ✅ только здесь user точно не null
  const avatarLetter = user.username[0].toUpperCase()

  const handleSave = async () => {
    setSaving(true); setMessage(null)
    try {
      const { data } = await axios.put(`/users/${user._id}`, form)
      setUser(data.uProduct)
      setEditing(false)
      setMessage({ type: "ok", text: "Данные успешно обновлены" })
    } catch {
      setMessage({ type: "err", text: "Ошибка при сохранении" })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    setPwError("")
    if (pwForm.next.length < 6)        return setPwError("Минимум 6 символов")
    if (pwForm.next !== pwForm.confirm) return setPwError("Пароли не совпадают")
    try {
      await axios.put(`/users/${user._id}`, { password: pwForm.next })
      setPwForm({ current: "", next: "", confirm: "" })
      setMessage({ type: "ok", text: "Пароль изменён" })
    } catch {
      setPwError("Ошибка при изменении пароля")
    }
  }

  return (
    <>
      <style>{css}</style>
      <div style={styles.page}>
        <div style={styles.container}>

          <div style={{ marginBottom: 36 }}>
            <p className="pr-overline">Мой аккаунт</p>
            <h1 className="pr-title">Профиль</h1>
          </div>

          {message && (
            <div className={`pr-toast ${message.type === "ok" ? "pr-toast-ok" : "pr-toast-err"}`}>
              {message.text}
              <button className="pr-toast-close" onClick={() => setMessage(null)}>✕</button>
            </div>
          )}

          {/* Аватар */}
          <div className="pr-card pr-avatar-card">
            <div className="pr-avatar">{avatarLetter}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span className="pr-username">{user.username}</span>
              </div>
              <p className="pr-email-hint">{user.email}</p>
            </div>
            {!editing && (
              <button className="pr-btn-ghost" onClick={() => setEditing(true)}>
                Редактировать
              </button>
            )}
          </div>

          {/* Личные данные */}
          <div className="pr-card" style={{ marginBottom: 20 }}>
            <p className="pr-section-label">Личные данные</p>
            <div className="pr-grid">
              <div className="pr-field">
                <div className="pr-label">Имя пользователя</div>
                <input className="pr-input" value={form.username} disabled={!editing}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="pr-field">
                <div className="pr-label">Телефон</div>
                <input className="pr-input" value={form.phone} disabled={!editing}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div className="pr-field">
              <div className="pr-label">Email</div>
              <input className="pr-input" value={form.email} disabled={!editing}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            {editing && (
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
                <button className="pr-btn-ghost" onClick={() => {
                  setEditing(false)
                  setForm({ username: user.username, phone: user.phone, email: user.email })
                }}>Отмена</button>
                <button className="pr-btn-solid" onClick={handleSave} disabled={saving}>
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            )}
          </div>

          {/* Пароль */}
          <div className="pr-card">
            <p className="pr-section-label">Безопасность</p>
            <div className="pr-field">
              <div className="pr-label">Текущий пароль</div>
              <input className="pr-input" type="password" placeholder="••••••••"
                value={pwForm.current}
                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
            </div>
            <div className="pr-grid">
              <div className="pr-field">
                <div className="pr-label">Новый пароль</div>
                <input className="pr-input" type="password" placeholder="••••••••"
                  value={pwForm.next}
                  onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} />
              </div>
              <div className="pr-field">
                <div className="pr-label">Подтверждение</div>
                <input className="pr-input" type="password" placeholder="••••••••"
                  value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
              </div>
            </div>
            {pwError && <p className="pr-error">{pwError}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button className="pr-btn-solid" onClick={handleChangePassword}>
                Изменить пароль
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}


const styles = {
  page: { minHeight: "100vh", background: "#0a0a0a", padding: "48px 24px", fontFamily: "'Montserrat', sans-serif", color: "#fff" },
  container: { maxWidth: 760, margin: "0 auto" },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap');
  .pr-overline{font-size:.6rem;letter-spacing:.25em;text-transform:uppercase;color:#D4AF37;margin:0 0 8px}
  .pr-title{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;letter-spacing:.08em;margin:0;color:#fff}
  .pr-card{background:#111;border-radius:4px;padding:32px;margin-bottom:20px;border:1px solid rgba(255,255,255,.07)}
  .pr-avatar-card{display:flex;align-items:center;gap:24px;border-color:rgba(212,175,55,.15)}
  .pr-avatar{width:80px;height:80px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#D4AF37,#a07d1c);border:2px solid rgba(212,175,55,.4);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:#0a0a0a}
  .pr-username{font-size:1.1rem;font-weight:500;letter-spacing:.05em}
  .pr-badge{font-size:.55rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;background:#D4AF37;color:#0a0a0a;padding:3px 10px;border-radius:2px}
  .pr-email-hint{font-size:.75rem;color:rgba(255,255,255,.4);margin:0}
  .pr-section-label{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.3);margin:0 0 24px}
  .pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .pr-field{margin-bottom:20px}
  .pr-label{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:#D4AF37;margin-bottom:6px}
  .pr-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.12);color:#fff;font-family:'Montserrat',sans-serif;font-size:.8rem;padding:10px 14px;border-radius:2px;outline:none;box-sizing:border-box;transition:border-color .2s}
  .pr-input:focus{border-color:#D4AF37}
  .pr-input:disabled{opacity:.5;cursor:default}
  .pr-error{font-size:.7rem;color:#e05555;margin:8px 0 0;letter-spacing:.05em}
  .pr-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);font-family:'Montserrat',sans-serif;font-size:.65rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:10px 24px;border-radius:2px;cursor:pointer;transition:border-color .2s,color .2s}
  .pr-btn-ghost:hover{border-color:#D4AF37;color:#D4AF37}
  .pr-btn-solid{background:#D4AF37;border:1px solid #D4AF37;color:#0a0a0a;font-family:'Montserrat',sans-serif;font-size:.65rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;padding:10px 24px;border-radius:2px;cursor:pointer;transition:opacity .2s}
  .pr-btn-solid:hover{opacity:.85}
  .pr-btn-solid:disabled{opacity:.5;cursor:default}
  .pr-toast{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-radius:4px;margin-bottom:20px;font-size:.75rem;letter-spacing:.05em}
  .pr-toast-ok{background:rgba(29,158,117,.12);border:1px solid rgba(29,158,117,.3);color:#5dcaa5}
  .pr-toast-err{background:rgba(200,50,50,.1);border:1px solid rgba(200,50,50,.25);color:#e05555}
  .pr-toast-close{background:none;border:none;color:inherit;cursor:pointer;font-size:.9rem;opacity:.6}
  .pr-toast-close:hover{opacity:1}
  @media(max-width:600px){.pr-grid{grid-template-columns:1fr}.pr-avatar-card{flex-direction:column;align-items:flex-start}}
`

export default Profile