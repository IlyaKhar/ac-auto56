import { useCallback, useEffect, useState } from "react";
import { adminCategories, adminServices } from "../api/adminApi.js";
import { ErrBox, apiErr, btnDanger, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

const empty = {
  title: "",
  description: "",
  price: "",
  duration: "",
  category_id: "",
  is_active: true,
};

/** CRUD услуг (категория — выпадающий список). */
export default function AdminServices() {
  const [list, setList] = useState([]);
  const [cats, setCats] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const [s, c] = await Promise.all([adminServices.list(), adminCategories.list()]);
      setList(Array.isArray(s) ? s : []);
      setCats(Array.isArray(c) ? c : []);
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      title: row.title,
      description: row.description ?? "",
      price: row.price ?? "",
      duration: row.duration ?? "",
      category_id: String(row.category_id),
      is_active: row.is_active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
  }

  function numCatId() {
    const n = Number(form.category_id);
    return Number.isFinite(n) ? n : 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const catId = numCatId();
    const price = form.price.trim() ? form.price.trim() : null;
    const duration = form.duration.trim() ? form.duration.trim() : null;
    try {
      if (editingId) {
        await adminServices.patch(editingId, {
          title: form.title,
          description: form.description,
          price,
          duration,
          category_id: catId,
          is_active: form.is_active,
        });
      } else {
        await adminServices.create({
          title: form.title,
          description: form.description,
          price,
          duration,
          category_id: catId,
          is_active: form.is_active,
        });
      }
      cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Удалить услугу?")) return;
    setErr("");
    try {
      await adminServices.remove(id);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Услуги</h1>
      <ErrBox msg={err} />

      <form
        onSubmit={onSubmit}
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-w-lg"
      >
        <h2 className="text-sm font-medium text-slate-300">
          {editingId ? `Редактировать #${editingId}` : "Новая услуга"}
        </h2>
        <label className="block text-xs text-slate-500">
          Название *
          <input
            className={fieldClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Описание
          <textarea
            className={fieldClass}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Цена (строка)
          <input
            className={fieldClass}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Длительность
          <input
            className={fieldClass}
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Категория *
          <select
            className={fieldClass}
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            required
          >
            <option value="">—</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          Активна
        </label>
        <div className="flex gap-2">
          <button type="submit" className={btnPrimary}>
            {editingId ? "Сохранить" : "Создать"}
          </button>
          {editingId && (
            <button type="button" className={btnGhost} onClick={cancelEdit}>
              Отмена
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-slate-500">Загрузка…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-slate-400 text-left">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Название</th>
                <th className="p-3">Категория</th>
                <th className="p-3">Активна</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-800">
                  <td className="p-3 text-slate-500">{row.id}</td>
                  <td className="p-3 text-white">{row.title}</td>
                  <td className="p-3 text-slate-400">{row.category_title || row.category_id}</td>
                  <td className="p-3">{row.is_active ? "да" : "нет"}</td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button type="button" className={btnGhost} onClick={() => startEdit(row)}>
                      Изменить
                    </button>
                    <button type="button" className={btnDanger} onClick={() => onDelete(row.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
