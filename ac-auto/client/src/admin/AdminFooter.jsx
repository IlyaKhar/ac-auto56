import { useCallback, useEffect, useState } from "react";
import { adminFooter } from "../api/adminApi.js";
import { ErrBox, apiErr, btnDanger, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

const empty = { title: "", content: "", sort_order: 0 };

/** Секции футера (HTML) + порядок. */
export default function AdminFooter() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [reorderIds, setReorderIds] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const data = await adminFooter.list();
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
      title: row.title ?? "",
      content: row.content ?? "",
      sort_order: row.sort_order ?? 0,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      if (editingId) {
        await adminFooter.patch(editingId, {
          title: form.title.trim() ? form.title.trim() : null,
          content: form.content,
          sort_order: Number(form.sort_order) || 0,
        });
      } else {
        await adminFooter.create({
          title: form.title.trim() ? form.title.trim() : null,
          content: form.content,
          sort_order: Number(form.sort_order) || 0,
        });
      }
      cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Удалить секцию?")) return;
    setErr("");
    try {
      await adminFooter.remove(id);
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
      await adminFooter.reorder(ids);
      setReorderIds("");
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Футер</h1>
      <ErrBox msg={err} />

      <form onSubmit={onReorder} className="mb-6 flex flex-wrap gap-2 items-end max-w-xl">
        <label className="flex-1 min-w-[200px] text-xs text-slate-500">
          Порядок (id через запятую)
          <input
            className={fieldClass}
            value={reorderIds}
            onChange={(e) => setReorderIds(e.target.value)}
          />
        </label>
        <button type="submit" className={btnGhost}>
          Применить порядок
        </button>
      </form>

      <form
        onSubmit={onSubmit}
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-w-2xl"
      >
        <h2 className="text-sm font-medium text-slate-300">
          {editingId ? `Секция #${editingId}` : "Новая секция"}
        </h2>
        <label className="block text-xs text-slate-500">
          Заголовок (опционально)
          <input className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="block text-xs text-slate-500">
          HTML контент *
          <textarea
            className={fieldClass}
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            spellCheck={false}
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
        <ul className="space-y-3">
          {list.map((row) => (
            <li key={row.id} className="rounded-xl border border-slate-800 p-4 flex flex-wrap justify-between gap-2">
              <div>
                <div className="text-white font-medium">{row.title || "(без заголовка)"}</div>
                <div className="text-xs text-slate-500 mt-1">id={row.id} · order={row.sort_order}</div>
                <div
                  className="text-xs text-slate-600 mt-2 max-h-20 overflow-hidden border border-slate-800/50 rounded p-2"
                  dangerouslySetInnerHTML={{ __html: row.content }}
                />
              </div>
              <div className="flex gap-2 shrink-0">
                <button type="button" className={btnGhost} onClick={() => startEdit(row)}>
                  Изменить
                </button>
                <button type="button" className={btnDanger} onClick={() => onDelete(row.id)}>
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
