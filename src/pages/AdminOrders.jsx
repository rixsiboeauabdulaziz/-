import { useState, useEffect } from "react"
import axios from "../axios"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [search, setSearch] = useState("")

  // ─── Fetch all orders ─────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get("/orders")
      setOrders(data)
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  // ─── Delete ───────────────────────────────────────────────────────
  const confirmDelete = (id) => setDeleteId(id)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`/orders/${deleteId}`)
      setOrders((prev) => prev.filter((o) => o._id !== deleteId && o.id !== deleteId))
      setDeleteId(null)
    } catch (e) {
      alert("Ошибка удаления: " + (e.response?.data?.message || e.message))
    } finally {
      setDeleting(false)
    }
  }

  // ─── Filter ───────────────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    const productTitle = typeof o.product === "object" ? o.product?.title : ""
    return [o.name, o.phone, productTitle]
      .join(" ").toLowerCase()
      .includes(search.toLowerCase())
  })

  // ─── Helpers ──────────────────────────────────────────────────────
  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleString("ru-RU", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    })
  }

  const totalPrice = (order) => {
    const price = typeof order.product === "object" ? order.product?.price : 0
    return price ? Number(price) * Number(order.quantity) : null
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ao-root {
          min-height: 100vh;
          background: #080808;
          color: #e8e0d0;
          font-family: 'Montserrat', sans-serif;
          padding: 48px 32px;
        }

        /* ── Header ── */
        .ao-header {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap; gap: 20px;
          margin-bottom: 40px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }
        .ao-eyebrow {
          font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: #D4AF37; margin-bottom: 8px;
        }
        .ao-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem; font-weight: 600;
          color: #fff; letter-spacing: 0.05em;
        }
        .ao-count {
          display: inline-block; margin-left: 14px;
          font-family: 'Montserrat', sans-serif; font-size: 0.75rem;
          color: rgba(255,255,255,0.35); vertical-align: middle;
        }

        /* ── Search ── */
        .ao-search-wrap { position: relative; }
        .ao-search {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e8e0d0; font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem; letter-spacing: 0.08em;
          padding: 10px 16px 10px 38px;
          border-radius: 2px; width: 260px;
          transition: border-color 0.2s;
          outline: none;
        }
        .ao-search::placeholder { color: rgba(255,255,255,0.25); }
        .ao-search:focus { border-color: rgba(212,175,55,0.4); }
        .ao-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.3); font-size: 0.85rem; pointer-events: none;
        }

        /* ── Table ── */
        .ao-table-wrap {
          overflow-x: auto;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 3px;
        }
        table { width: 100%; border-collapse: collapse; font-size: 0.75rem; }
        thead tr {
          background: rgba(212,175,55,0.06);
          border-bottom: 1px solid rgba(212,175,55,0.15);
        }
        th {
          padding: 14px 16px; text-align: left;
          font-size: 0.6rem; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(212,175,55,0.7); white-space: nowrap;
        }
        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.15s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: rgba(255,255,255,0.03); }
        td { padding: 14px 16px; vertical-align: middle; color: rgba(255,255,255,0.75); }

        /* ── Cells ── */
        .ao-img {
          width: 48px; height: 48px; object-fit: cover;
          border-radius: 2px; border: 1px solid rgba(255,255,255,0.08);
          background: #111;
        }
        .ao-img-placeholder {
          width: 48px; height: 48px; background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px; display: flex; align-items: center;
          justify-content: center; color: rgba(255,255,255,0.15);
          font-size: 1.1rem;
        }
        .ao-product-name { font-weight: 500; color: #fff; }
        .ao-customer-name { font-weight: 500; color: #fff; }
        .ao-phone { color: rgba(255,255,255,0.5); font-size: 0.72rem; }
        .ao-qty {
          display: inline-block;
          min-width: 28px; text-align: center;
          background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.2);
          color: rgba(212,175,55,0.85);
          border-radius: 2px; padding: 3px 10px;
          font-weight: 600; font-size: 0.75rem;
        }
        .ao-price { color: #D4AF37; font-weight: 600; }
        .ao-date { color: rgba(255,255,255,0.35); font-size: 0.68rem; white-space: nowrap; }

        /* ── Order number badge ── */
        .ao-num {
          font-size: 0.6rem; letter-spacing: 0.12em;
          color: rgba(255,255,255,0.25);
        }

        /* ── Actions ── */
        .ao-actions { display: flex; gap: 8px; }
        .ao-btn-del {
          background: transparent; border: 1px solid rgba(200,50,50,0.3);
          color: rgba(200,80,80,0.7); font-family: 'Montserrat', sans-serif;
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; padding: 6px 14px; border-radius: 2px;
          cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .ao-btn-del:hover { border-color: #c83232; color: #e05555; background: rgba(200,50,50,0.08); }

        /* ── States ── */
        .ao-state {
          display: flex; align-items: center; justify-content: center;
          min-height: 260px; flex-direction: column; gap: 14px;
          color: rgba(255,255,255,0.3); font-size: 0.8rem; letter-spacing: 0.1em;
        }
        .ao-state-icon { font-size: 2rem; opacity: 0.3; }
        .ao-retry {
          background: transparent; border: 1px solid rgba(212,175,55,0.3);
          color: #D4AF37; font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 8px 20px; border-radius: 2px; cursor: pointer;
          transition: background 0.2s;
        }
        .ao-retry:hover { background: rgba(212,175,55,0.1); }

        /* ── Overlay ── */
        .ao-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: aoFadeIn 0.2s ease;
        }
        @keyframes aoFadeIn { from { opacity: 0 } to { opacity: 1 } }

        /* ── Delete confirm ── */
        .ao-confirm {
          background: #0f0f0f; border: 1px solid rgba(200,50,50,0.25);
          border-radius: 3px; width: 100%; max-width: 400px;
          padding: 32px 28px; text-align: center;
          animation: aoSlideUp 0.2s ease;
        }
        @keyframes aoSlideUp {
          from { opacity: 0; transform: translateY(20px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        .ao-confirm-icon { font-size: 2.4rem; margin-bottom: 16px; }
        .ao-confirm-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; color: #fff; margin-bottom: 10px;
        }
        .ao-confirm-text { font-size: 0.75rem; color: rgba(255,255,255,0.4); line-height: 1.6; }
        .ao-confirm-actions { display: flex; gap: 10px; justify-content: center; margin-top: 24px; }
        .ao-btn-cancel {
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5); font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; padding: 10px 22px; border-radius: 2px;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .ao-btn-cancel:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .ao-btn-confirm-del {
          background: #c83232; border: 1px solid #c83232; color: #fff;
          font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 10px 24px; border-radius: 2px; cursor: pointer;
          transition: opacity 0.2s;
        }
        .ao-btn-confirm-del:hover:not(:disabled) { opacity: 0.85; }
        .ao-btn-confirm-del:disabled { opacity: 0.4; cursor: not-allowed; }

        .ao-spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: aoSpin 0.7s linear infinite;
          margin-right: 6px; vertical-align: middle;
        }
        @keyframes aoSpin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .ao-root { padding: 28px 16px; }
          .ao-search { width: 100%; }
          .ao-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="ao-root">
        {/* ── Header ── */}
        <div className="ao-header">
          <div>
            <div className="ao-eyebrow">Панель администратора</div>
            <div className="ao-title">
              Заказы
              <span className="ao-count">
                {filtered.length}{filtered.length !== orders.length && ` / ${orders.length}`}
              </span>
            </div>
          </div>
          <div className="ao-search-wrap">
            <span className="ao-search-icon">⌕</span>
            <input
              className="ao-search"
              placeholder="Поиск по имени, телефону…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="ao-state">
            <div className="ao-state-icon">◌</div>
            <span>Загрузка заказов…</span>
          </div>
        ) : error ? (
          <div className="ao-state">
            <div className="ao-state-icon">✕</div>
            <span>{error}</span>
            <button className="ao-retry" onClick={fetchOrders}>Повторить</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ao-state">
            <div className="ao-state-icon">◻</div>
            <span>Заказы не найдены</span>
          </div>
        ) : (
          <div className="ao-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Фото</th>
                  <th>Товар</th>
                  <th>Клиент</th>
                  <th>Телефон</th>
                  <th>Кол-во</th>
                  <th>Сумма</th>
                  <th>Дата</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, idx) => {
                  const id = o._id || o.id
                  const product = typeof o.product === "object" ? o.product : null
                  const total = totalPrice(o)

                  return (
                    <tr key={id}>
                      <td><span className="ao-num">#{idx + 1}</span></td>
                      <td>
                        {product?.img
                          ? <img src={product.img} alt={product.title} className="ao-img" />
                          : <div className="ao-img-placeholder">◻</div>
                        }
                      </td>
                      <td>
                        <span className="ao-product-name">
                          {product?.title || (typeof o.product === "string" ? o.product : "—")}
                        </span>
                      </td>
                      <td><span className="ao-customer-name">{o.name}</span></td>
                      <td><span className="ao-phone">{o.phone}</span></td>
                      <td><span className="ao-qty">{o.quantity}</span></td>
                      <td>
                        {total !== null
                          ? <span className="ao-price">{total.toLocaleString()} ₽</span>
                          : <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                        }
                      </td>
                      <td><span className="ao-date">{formatDate(o.createdAt)}</span></td>
                      <td>
                        <div className="ao-actions">
                          <button className="ao-btn-del" onClick={() => confirmDelete(id)}>
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="ao-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="ao-confirm">
            <div className="ao-confirm-icon">⚠</div>
            <div className="ao-confirm-title">Удалить заказ?</div>
            <div className="ao-confirm-text">
              Это действие необратимо.<br />Заказ будет удалён из базы данных.
            </div>
            <div className="ao-confirm-actions">
              <button className="ao-btn-cancel" onClick={() => setDeleteId(null)}>Отмена</button>
              <button className="ao-btn-confirm-del" onClick={handleDelete} disabled={deleting}>
                {deleting && <span className="ao-spinner" />}
                {deleting ? "Удаление…" : "Да, удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
