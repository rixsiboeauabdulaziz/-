import { useState, useEffect } from "react"
import axios from "../axios"

const EMPTY_FORM = { img: "", title: "", desc: "" }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [editCategory, setEditCategory] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [search, setSearch] = useState("")

  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState(null)

  // ─── Fetch ────────────────────────────────────────────────────────
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axios.get("/categories")
      setCategories(data)
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  // ─── Add ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setAddForm(EMPTY_FORM)
    setAddError(null)
    setAddOpen(true)
  }

  const handleAdd = async () => {
    if (!addForm.title.trim()) { setAddError("Название обязательно"); return }
    setAdding(true)
    setAddError(null)
    try {
      await axios.post("/categories", addForm)
      await fetchCategories() // перезагружаем список — надёжнее чем push
      setAddOpen(false)
    } catch (e) {
      setAddError("Ошибка создания: " + (e.response?.data?.message || e.message))
    } finally {
      setAdding(false)
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────
  const confirmDelete = (id) => setDeleteId(id)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`/categories/${deleteId}`)
      setCategories((prev) => prev.filter((c) => c._id !== deleteId && c.id !== deleteId))
      setDeleteId(null)
    } catch (e) {
      alert("Ошибка удаления: " + (e.response?.data?.message || e.message))
    } finally {
      setDeleting(false)
    }
  }

  // ─── Edit ─────────────────────────────────────────────────────────
  const openEdit = (category) => {
    setEditCategory(category)
    setForm({
      img: category.img || "",
      title: category.title || "",
      desc: category.desc || "",
    })
    setFormError(null)
  }

  const handleSave = async () => {
    if (!form.title.trim()) { setFormError("Название обязательно"); return }
    setSaving(true)
    setFormError(null)
    const id = editCategory._id || editCategory.id
    try {
      await axios.put(`/categories/${id}`, form)
      await fetchCategories() // перезагружаем — гарантированно актуальные данные
      setEditCategory(null)
    } catch (e) {
      setFormError("Ошибка сохранения: " + (e.response?.data?.message || e.message))
    } finally {
      setSaving(false)
    }
  }

  // ─── Filter ───────────────────────────────────────────────────────
  const filtered = categories.filter((c) =>
    [c.title, c.desc].join(" ").toLowerCase().includes(search.toLowerCase())
  )

 

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Montserrat:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ap-root {
          min-height: 100vh;
          background: #080808;
          color: #e8e0d0;
          font-family: 'Montserrat', sans-serif;
          padding: 48px 32px;
        }

        .ap-header {
          display: flex; align-items: flex-end;
          justify-content: space-between; flex-wrap: wrap; gap: 20px;
          margin-bottom: 40px;
          padding-bottom: 28px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }
        .ap-eyebrow {
          font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: #D4AF37; margin-bottom: 8px;
        }
        .ap-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem; font-weight: 600;
          color: #fff; letter-spacing: 0.05em;
        }
        .ap-count {
          display: inline-block; margin-left: 14px;
          font-family: 'Montserrat', sans-serif; font-size: 0.75rem;
          color: rgba(255,255,255,0.35); vertical-align: middle;
        }
        .ap-header-controls {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
        }
        .ap-btn-add {
          background: #D4AF37; border: 1px solid #D4AF37; color: #0a0a0a;
          font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 10px 24px; border-radius: 2px; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: opacity 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .ap-btn-add:hover { opacity: 0.88; box-shadow: 0 0 20px rgba(212,175,55,0.25); }
        .ap-btn-add-icon { font-size: 1rem; line-height: 1; }
        .ap-search-wrap { position: relative; }
        .ap-search {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e8e0d0; font-family: 'Montserrat', sans-serif;
          font-size: 0.75rem; letter-spacing: 0.08em;
          padding: 10px 16px 10px 38px;
          border-radius: 2px; width: 260px;
          transition: border-color 0.2s;
          outline: none;
        }
        .ap-search::placeholder { color: rgba(255,255,255,0.25); }
        .ap-search:focus { border-color: rgba(212,175,55,0.4); }
        .ap-search-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: rgba(255,255,255,0.3); font-size: 0.85rem; pointer-events: none;
        }
        .ap-table-wrap {
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
        .ap-img {
          width: 48px; height: 48px; object-fit: cover;
          border-radius: 2px; border: 1px solid rgba(255,255,255,0.08); background: #111;
        }
        .ap-img-placeholder {
          width: 48px; height: 48px; background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 2px; display: flex; align-items: center;
          justify-content: center; color: rgba(255,255,255,0.15); font-size: 1.1rem;
        }
        .ap-name { font-weight: 500; color: #fff; }
        .ap-desc-cell {
          max-width: 260px; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
          color: rgba(255,255,255,0.4);
        }
        .ap-actions { display: flex; gap: 8px; }
        .ap-btn-edit {
          background: transparent; border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6); font-family: 'Montserrat', sans-serif;
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; padding: 6px 14px; border-radius: 2px;
          cursor: pointer; transition: border-color 0.2s, color 0.2s; white-space: nowrap;
        }
        .ap-btn-edit:hover { border-color: #D4AF37; color: #D4AF37; }
        .ap-btn-del {
          background: transparent; border: 1px solid rgba(200,50,50,0.3);
          color: rgba(200,80,80,0.7); font-family: 'Montserrat', sans-serif;
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; padding: 6px 14px; border-radius: 2px;
          cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s; white-space: nowrap;
        }
        .ap-btn-del:hover { border-color: #c83232; color: #e05555; background: rgba(200,50,50,0.08); }
        .ap-state {
          display: flex; align-items: center; justify-content: center;
          min-height: 260px; flex-direction: column; gap: 14px;
          color: rgba(255,255,255,0.3); font-size: 0.8rem; letter-spacing: 0.1em;
        }
        .ap-state-icon { font-size: 2rem; opacity: 0.3; }
        .ap-retry {
          background: transparent; border: 1px solid rgba(212,175,55,0.3);
          color: #D4AF37; font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;
          padding: 8px 20px; border-radius: 2px; cursor: pointer; transition: background 0.2s;
        }
        .ap-retry:hover { background: rgba(212,175,55,0.1); }
        .ap-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px; animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .ap-modal {
          background: #0f0f0f; border: 1px solid rgba(212,175,55,0.2);
          border-radius: 3px; width: 100%; max-width: 520px;
          animation: slideUp 0.25s ease; max-height: 90vh; overflow-y: auto;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        .ap-modal-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; background: #0f0f0f; z-index: 1;
        }
        .ap-modal-eyebrow {
          font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase;
          color: #D4AF37; margin-bottom: 5px;
        }
        .ap-modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; color: #fff; letter-spacing: 0.05em;
        }
        .ap-modal-close {
          background: none; border: none; color: rgba(255,255,255,0.3);
          font-size: 1.2rem; cursor: pointer; line-height: 1; transition: color 0.2s;
        }
        .ap-modal-close:hover { color: #fff; }
        .ap-modal-body { padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; }
        .ap-field { display: flex; flex-direction: column; gap: 6px; }
        .ap-field label {
          font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(212,175,55,0.7); font-weight: 600;
        }
        .ap-field--required label::after { content: ' *'; color: rgba(200,80,80,0.8); }
        .ap-field input, .ap-field textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e8e0d0; font-family: 'Montserrat', sans-serif;
          font-size: 0.8rem; padding: 10px 12px; border-radius: 2px;
          outline: none; transition: border-color 0.2s; width: 100%;
        }
        .ap-field input:focus, .ap-field textarea:focus { border-color: rgba(212,175,55,0.4); }
        .ap-field textarea { resize: vertical; min-height: 80px; }
        .ap-img-preview-wrap {
          margin-top: 6px; border: 1px dashed rgba(212,175,55,0.2);
          border-radius: 2px; height: 110px;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; background: rgba(255,255,255,0.02);
        }
        .ap-img-preview { width: 100%; height: 110px; object-fit: cover; display: block; }
        .ap-img-preview-empty {
          font-size: 0.65rem; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.18); text-align: center; padding: 0 16px;
        }
        .ap-divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 4px 0; }
        .ap-form-error {
          font-size: 0.7rem; color: #e05555;
          padding: 10px 14px; background: rgba(200,50,50,0.08);
          border: 1px solid rgba(200,50,50,0.2); border-radius: 2px;
        }
        .ap-modal-footer {
          padding: 20px 28px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex; justify-content: space-between; align-items: center; gap: 10px;
          position: sticky; bottom: 0; background: #0f0f0f;
        }
        .ap-footer-note { font-size: 0.58rem; color: rgba(255,255,255,0.2); letter-spacing: 0.08em; }
        .ap-footer-note span { color: rgba(200,80,80,0.6); }
        .ap-footer-btns { display: flex; gap: 10px; }
        .ap-btn-cancel {
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5); font-family: 'Montserrat', sans-serif;
          font-size: 0.65rem; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; padding: 10px 22px; border-radius: 2px;
          cursor: pointer; transition: border-color 0.2s, color 0.2s;
        }
        .ap-btn-cancel:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .ap-btn-save {
          background: #D4AF37; border: 1px solid #D4AF37; color: #0a0a0a;
          font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 10px 28px; border-radius: 2px; cursor: pointer; transition: opacity 0.2s;
        }
        .ap-btn-save:hover:not(:disabled) { opacity: 0.85; }
        .ap-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }
        .ap-confirm {
          background: #0f0f0f; border: 1px solid rgba(200,50,50,0.25);
          border-radius: 3px; width: 100%; max-width: 400px;
          padding: 32px 28px; text-align: center; animation: slideUp 0.2s ease;
        }
        .ap-confirm-icon { font-size: 2.4rem; margin-bottom: 16px; }
        .ap-confirm-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; color: #fff; margin-bottom: 10px;
        }
        .ap-confirm-text { font-size: 0.75rem; color: rgba(255,255,255,0.4); line-height: 1.6; }
        .ap-confirm-actions { display: flex; gap: 10px; justify-content: center; margin-top: 24px; }
        .ap-btn-confirm-del {
          background: #c83232; border: 1px solid #c83232; color: #fff;
          font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 10px 24px; border-radius: 2px; cursor: pointer; transition: opacity 0.2s;
        }
        .ap-btn-confirm-del:hover:not(:disabled) { opacity: 0.85; }
        .ap-btn-confirm-del:disabled { opacity: 0.4; cursor: not-allowed; }
        .ap-spinner {
          display: inline-block; width: 12px; height: 12px;
          border: 2px solid rgba(0,0,0,0.3); border-top-color: #0a0a0a;
          border-radius: 50%; animation: spin 0.7s linear infinite;
          margin-right: 6px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .ap-root { padding: 28px 16px; }
          .ap-search { width: 100%; }
          .ap-header { flex-direction: column; align-items: flex-start; }
          .ap-header-controls { width: 100%; }
          .ap-btn-add { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="ap-root">
        {/* ── Header ── */}
        <div className="ap-header">
          <div className="ap-title-block">
            <div className="ap-eyebrow">Панель администратора</div>
            <div className="ap-title">
              Категории
              <span className="ap-count">
                {filtered.length} {filtered.length !== categories.length && `/ ${categories.length}`}
              </span>
            </div>
          </div>
          <div className="ap-header-controls">
            <div className="ap-search-wrap">
              <span className="ap-search-icon">⌕</span>
              <input
                className="ap-search"
                placeholder="Поиск по названию…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="ap-btn-add" onClick={openAdd}>
              <span className="ap-btn-add-icon">＋</span>
              Добавить категорию
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="ap-state">
            <div className="ap-state-icon">◌</div>
            <span>Загрузка категорий…</span>
          </div>
        ) : error ? (
          <div className="ap-state">
            <div className="ap-state-icon">✕</div>
            <span>{error}</span>
            <button className="ap-retry" onClick={fetchCategories}>Повторить</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ap-state">
            <div className="ap-state-icon">◻</div>
            <span>Категории не найдены</span>
          </div>
        ) : (
          <div className="ap-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Фото</th>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const id = c._id || c.id
                  return (
                    <tr key={id}>
                      <td>
                        {c.img
                          ? <img src={c.img} alt={c.title} className="ap-img" />
                          : <div className="ap-img-placeholder">◻</div>
                        }
                      </td>
                      <td><span className="ap-name">{c.title}</span></td>
                      <td><div className="ap-desc-cell">{c.desc}</div></td>
                      <td>
                        <div className="ap-actions">
                          <button className="ap-btn-edit" onClick={() => openEdit(c)}>Изменить</button>
                          <button className="ap-btn-del" onClick={() => confirmDelete(id)}>Удалить</button>
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

      {/* ── Add Category Modal ── */}
      {addOpen && (
        <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && setAddOpen(false)}>
          <div className="ap-modal">
            <div className="ap-modal-header">
              <div>
                <div className="ap-modal-eyebrow">Новая позиция</div>
                <div className="ap-modal-title">Добавить категорию</div>
              </div>
              <button className="ap-modal-close" onClick={() => setAddOpen(false)}>✕</button>
            </div>

            <div className="ap-modal-body">
              {/* Title */}
              <div className="ap-field ap-field--required">
                <label>Название</label>
                <input
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  placeholder="Название категории"
                />
              </div>

              {/* Image URL + preview */}
              <div className="ap-field">
                <label>Ссылка на изображение</label>
                <input
                  value={addForm.img}
                  onChange={(e) => setAddForm({ ...addForm, img: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div className="ap-img-preview-wrap">
                {addForm.img.trim()
                  ? <img src={addForm.img} alt="preview" className="ap-img-preview"
                      onError={(e) => { e.target.style.display = "none" }} />
                  : <div className="ap-img-preview-empty">Предпросмотр изображения появится здесь</div>
                }
              </div>

              <hr className="ap-divider" />

              {/* Description */}
              <div className="ap-field">
                <label>Описание</label>
                <textarea
                  value={addForm.desc}
                  onChange={(e) => setAddForm({ ...addForm, desc: e.target.value })}
                  placeholder="Описание категории…"
                />
              </div>

              {addError && <div className="ap-form-error">{addError}</div>}
            </div>

            <div className="ap-modal-footer">
              <div className="ap-footer-note"><span>*</span> Обязательные поля</div>
              <div className="ap-footer-btns">
                <button className="ap-btn-cancel" onClick={() => setAddOpen(false)}>Отмена</button>
                <button className="ap-btn-save" onClick={handleAdd} disabled={adding}>
                  {adding && <span className="ap-spinner" />}
                  {adding ? "Создание…" : "Создать категорию"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editCategory && (
        <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && setEditCategory(null)}>
          <div className="ap-modal">
            <div className="ap-modal-header">
              <div className="ap-modal-title">Редактировать категорию</div>
              <button className="ap-modal-close" onClick={() => setEditCategory(null)}>✕</button>
            </div>
            <div className="ap-modal-body">
              <div className="ap-field">
                <label>Название</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Название категории"
                />
              </div>
              <div className="ap-field">
                <label>Ссылка на изображение</label>
                <input
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  placeholder="https://…"
                />
              </div>
              <div className="ap-field">
                <label>Описание</label>
                <textarea
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  placeholder="Описание категории…"
                />
              </div>
              {formError && <div className="ap-form-error">{formError}</div>}
            </div>
            <div className="ap-modal-footer">
              <div />
              <div className="ap-footer-btns">
                <button className="ap-btn-cancel" onClick={() => setEditCategory(null)}>Отмена</button>
                <button className="ap-btn-save" onClick={handleSave} disabled={saving}>
                  {saving && <span className="ap-spinner" />}
                  {saving ? "Сохранение…" : "Сохранить"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="ap-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="ap-confirm">
            <div className="ap-confirm-icon">⚠</div>
            <div className="ap-confirm-title">Удалить категорию?</div>
            <div className="ap-confirm-text">
              Это действие необратимо.<br />Категория будет удалена из базы данных.
            </div>
            <div className="ap-confirm-actions">
              <button className="ap-btn-cancel" onClick={() => setDeleteId(null)}>Отмена</button>
              <button className="ap-btn-confirm-del" onClick={handleDelete} disabled={deleting}>
                {deleting && <span className="ap-spinner" style={{ borderTopColor: "#fff" }} />}
                {deleting ? "Удаление…" : "Да, удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
