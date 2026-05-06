import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../axios"

function MyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { navigate("/login"); return }

    // Сначала берём текущего юзера, потом все заказы — фильтруем по phone
    Promise.all([
      axios.get("/me"),
      axios.get("/orders")
    ])
      .then(([{ data: user }, { data: allOrders }]) => {
        const mine = allOrders.filter(o => o.phone === user.phone)
        setOrders(mine)
      })
      .catch(() => setError("Не удалось загрузить заказы"))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) return (
    <div style={styles.page}>
      <p style={{ color: "rgba(255,255,255,.3)", letterSpacing: ".2em", fontSize: ".7rem" }}>
        ЗАГРУЗКА...
      </p>
    </div>
  )

  if (error) return (
    <div style={styles.page}>
      <p style={{ color: "#e05555", fontSize: ".85rem" }}>{error}</p>
    </div>
  )

  return (
    <>
      <style>{css}</style>
      <div style={styles.page}>
        <div style={styles.container}>

          {/* Заголовок */}
          <div style={{ marginBottom: 36 }}>
            <p className="ord-overline">Мой аккаунт</p>
            <h1 className="ord-title">Мои заказы</h1>
          </div>

          {orders.length === 0 ? (
            <div className="ord-empty">
              <div className="ord-empty-icon">◻</div>
              <p className="ord-empty-text">У вас пока нет заказов</p>
              <button className="ord-btn-solid" onClick={() => navigate("/collections")}>
                Перейти к коллекциям
              </button>
            </div>
          ) : (
            <div className="ord-list">
              {orders.map((order) => (
                <div key={order._id} className="ord-card">

                  {/* Шапка карточки */}
                  <div className="ord-card-header">
                    <div>
                      <p className="ord-id">Заказ #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="ord-date">
                        {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </p>
                    </div>
                    <span className="ord-status">Принят</span>
                  </div>

                  <hr className="ord-sep" />

                  {/* Товар */}
                  <div className="ord-product">
                    {order.product?.img && (
                      <img
                        src={order.product.img}
                        alt={order.product.name}
                        className="ord-product-img"
                      />
                    )}
                    <div className="ord-product-info">
                      <p className="ord-product-name">
                        {order.product?.name || "Товар удалён"}
                      </p>
                      {order.product?.price && (
                        <p className="ord-product-price">
                          {Number(order.product.price).toLocaleString("ru-RU")} сум
                        </p>
                      )}
                      <p className="ord-product-qty">Количество: {order.quantity} шт.</p>
                    </div>
                    {order.product?.price && (
                      <div className="ord-total">
                        <p className="ord-total-label">Итого</p>
                        <p className="ord-total-value">
                          {(order.product.price * order.quantity).toLocaleString("ru-RU")} сум
                        </p>
                      </div>
                    )}
                  </div>

                  <hr className="ord-sep" />

                  {/* Контакты */}
                  <div className="ord-contacts">
                    <div className="ord-contact-item">
                      <span className="ord-contact-label">Получатель</span>
                      <span className="ord-contact-value">{order.name}</span>
                    </div>
                    <div className="ord-contact-item">
                      <span className="ord-contact-label">Телефон</span>
                      <span className="ord-contact-value">{order.phone}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    padding: "48px 24px",
    fontFamily: "'Montserrat', sans-serif",
    color: "#fff",
  },
  container: { maxWidth: 800, margin: "0 auto" },
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap');

  .ord-overline { font-size:.6rem; letter-spacing:.25em; text-transform:uppercase; color:#D4AF37; margin:0 0 8px }
  .ord-title { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:600; letter-spacing:.08em; margin:0; color:#fff }

  .ord-list { display:flex; flex-direction:column; gap:16px }

  .ord-card {
    background:#111; border:1px solid rgba(255,255,255,.07);
    border-radius:4px; padding:28px;
    transition: border-color .2s;
  }
  .ord-card:hover { border-color: rgba(212,175,55,.2) }

  .ord-card-header { display:flex; align-items:flex-start; justify-content:space-between }
  .ord-id { font-size:.65rem; letter-spacing:.2em; color:#D4AF37; margin:0 0 4px; text-transform:uppercase }
  .ord-date { font-size:.75rem; color:rgba(255,255,255,.4); margin:0 }

  .ord-status {
    font-size:.55rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase;
    background:rgba(29,158,117,.12); border:1px solid rgba(29,158,117,.3);
    color:#5dcaa5; padding:4px 12px; border-radius:2px; white-space:nowrap;
  }

  .ord-sep { border:none; border-top:1px solid rgba(255,255,255,.06); margin:20px 0 }

  .ord-product { display:flex; align-items:center; gap:20px }
  .ord-product-img {
    width:72px; height:72px; object-fit:cover; border-radius:2px;
    border:1px solid rgba(255,255,255,.08); flex-shrink:0;
  }
  .ord-product-info { flex:1 }
  .ord-product-name { font-size:.9rem; font-weight:500; margin:0 0 6px; color:#fff }
  .ord-product-price { font-size:.75rem; color:rgba(255,255,255,.4); margin:0 0 4px }
  .ord-product-qty { font-size:.7rem; color:rgba(255,255,255,.3); margin:0; letter-spacing:.05em }

  .ord-total { text-align:right; flex-shrink:0 }
  .ord-total-label { font-size:.55rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.3); margin:0 0 4px }
  .ord-total-value { font-size:1rem; font-weight:600; color:#D4AF37; margin:0 }

  .ord-contacts { display:flex; gap:40px; flex-wrap:wrap }
  .ord-contact-item { display:flex; flex-direction:column; gap:4px }
  .ord-contact-label { font-size:.55rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.3) }
  .ord-contact-value { font-size:.8rem; color:rgba(255,255,255,.7) }

  /* Пустое состояние */
  .ord-empty {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:80px 24px; text-align:center;
    border:1px solid rgba(255,255,255,.06); border-radius:4px; background:#111;
  }
  .ord-empty-icon { font-size:2.5rem; color:rgba(255,255,255,.1); margin-bottom:20px }
  .ord-empty-text { font-size:.85rem; color:rgba(255,255,255,.3); letter-spacing:.05em; margin:0 0 28px }
  .ord-btn-solid {
    background:#D4AF37; border:1px solid #D4AF37; color:#0a0a0a;
    font-family:'Montserrat',sans-serif; font-size:.65rem; font-weight:600;
    letter-spacing:.18em; text-transform:uppercase; padding:12px 28px;
    border-radius:2px; cursor:pointer; transition:opacity .2s;
  }
  .ord-btn-solid:hover { opacity:.85 }

  @media(max-width:600px) {
    .ord-product { flex-wrap:wrap }
    .ord-total { text-align:left }
    .ord-card-header { flex-direction:column; gap:12px }
  }
`

export default MyOrders