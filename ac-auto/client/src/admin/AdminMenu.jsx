import { useCallback, useEffect, useState } from "react";
import { adminMenu, adminPages } from "../api/adminApi.js";
import { ErrBox, apiErr, btnDanger, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

const empty = {
  label: "",
  href: "",
  page_id: "",
  parent_id: "",
  sort_order: 0,
  is_visible: true,
};

/** Пункты меню: CRUD + поле порядка id через запятую. */
export default function AdminMenu() {
  const [list, setList] = useState([]);
  const [pages, setPages] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [reorderIds, setReorderIds] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const [m, p] = await Promise.all([adminMenu.list(), adminPages.list()]);
      setList(Array.isArray(m) ? m : []);
      setPages(Array.isArray(p) ? p : []);
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function optInt(s) {
    const t = String(s).trim();
    if (!t) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      label: row.label,
      href: row.href ?? "",
      page_id: row.page_id != null ? String(row.page_id) : "",
      parent_id: row.parent_id != null ? String(row.parent_id) : "",
      sort_order: row.sort_order ?? 0,
      is_visible: row.is_visible !== false,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const body = {
      label: form.label,
      href: form.href.trim() ? form.href.trim() : null,
      page_id: optInt(form.page_id),
      parent_id: optInt(form.parent_id),
      sort_order: Number(form.sort_order) || 0,
      is_visible: form.is_visible,
    };
    try {
      if (editingId) {
        await adminMenu.patch(editingId, body);
      } else {
        await adminMenu.create(body);
      }
      cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Удалить пункт меню?")) return;
    setErr("");
    try {
      await adminMenu.remove(id);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onReorder(e) {
    e.preventDefault();
    const ids = reorderIds
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
    if (!ids.length) {
      setErr("Укажи id через запятую");
      return;
    }
    setErr("");
    try {
      await adminMenu.reorder(ids);
      setReorderIds("");
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Меню</h1>
      <ErrBox msg={err} />

      <form onSubmit={onReorder} className="mb-6 flex flex-wrap gap-2 items-end max-w-xl">
        <label className="flex-1 min-w-[200px] text-xs text-slate-500">
          Порядок (id через запятую)
          <input
            className={fieldClass}
            value={reorderIds}
            onChange={(e) => setReorderIds(e.target.value)}
            placeholder="1, 2, 3"
          />
        </label>
        <button type="submit" className={btnGhost}>
          Применить порядок
        </button>
      </form>

      <form
        onSubmit={onSubmit}
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-w-lg"
      >
        <h2 className="text-sm font-medium text-slate-300">
          {editingId ? `Пункт #${editingId}` : "Новый пункт"}
        </h2>
        <label className="block text-xs text-slate-500">
          Подпись *
          <input
            className={fieldClass}
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          href (внешняя или /page/slug)
          <input className={fieldClass} value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
        </label>
        <label className="block text-xs text-slate-500">
          page_id (если ссылка на страницу в БД)
          <select
            className={fieldClass}
            value={form.page_id}
            onChange={(e) => setForm({ ...form, page_id: e.target.value })}
          >
            <option value="">—</option>
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.slug})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-slate-500">
          parent_id
          <input
            className={fieldClass}
            value={form.parent_id}
            onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            placeholder="пусто = корень"
          />
        </label>
        <label className="block text-xs text-slate-500">
          sort_order
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
            checked={form.is_visible}
            onChange={(e) => setForm({ ...form, is_visible: e.target.checked })}
          />
          Видим
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
                <th className="p-3">Label</th>
                <th className="p-3">href</th>
                <th className="p-3">page</th>
                <th className="p-3">Порядок</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-800">
                  <td className="p-3 text-slate-500">{row.id}</td>
                  <td className="p-3 text-white">{row.label}</td>
                  <td className="p-3 text-slate-400 max-w-[140px] truncate">{row.href ?? "—"}</td>
                  <td className="p-3 text-slate-500">{row.page_slug ?? row.page_id ?? "—"}</td>
                  <td className="p-3">{row.sort_order}</td>
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
