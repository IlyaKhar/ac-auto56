import { useCallback, useEffect, useState } from "react";
import { adminCategories } from "../api/adminApi.js";
import { ErrBox, apiErr, btnDanger, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

const emptyForm = { title: "", slug: "", sort_order: 0, is_active: true };

/** CRUD категорий услуг. */
export default function AdminCategories() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const data = await adminCategories.list();
      setList(Array.isArray(data) ? data : []);
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
      slug: row.slug,
      sort_order: row.sort_order,
      is_active: row.is_active,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function onCreate(e) {
    e.preventDefault();
    setErr("");
    try {
      await adminCategories.create(form);
      cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onSaveEdit(e) {
    e.preventDefault();
    setErr("");
    try {
      await adminCategories.patch(editingId, {
        title: form.title,
        slug: form.slug,
        sort_order: form.sort_order,
        is_active: form.is_active,
      });
      cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Удалить категорию? Услуг внутри быть не должно.")) return;
    setErr("");
    try {
      await adminCategories.remove(id);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Категории</h1>
      <ErrBox msg={err} />

      <form
        onSubmit={editingId ? onSaveEdit : onCreate}
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-w-lg"
      >
        <h2 className="text-sm font-medium text-slate-300">
          {editingId ? `Редактировать #${editingId}` : "Новая категория"}
        </h2>
        <label className="block text-xs text-slate-500">
          Название
          <input
            className={fieldClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Slug
          <input
            className={fieldClass}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Порядок
          <input
            type="number"
            className={fieldClass}
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
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
                <th className="p-3">Slug</th>
                <th className="p-3">Порядок</th>
                <th className="p-3">Активна</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-800">
                  <td className="p-3 text-slate-500">{row.id}</td>
                  <td className="p-3 text-white">{row.title}</td>
                  <td className="p-3 text-slate-400">{row.slug}</td>
                  <td className="p-3">{row.sort_order}</td>
                  <td className="p-3">{row.is_active ? "да" : "нет"}</td>
                  <td className="p-3 flex gap-2">
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
