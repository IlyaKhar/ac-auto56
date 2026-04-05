import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminPages } from "../api/adminApi.js";
import { ErrBox, apiErr, btnDanger, btnPrimary, fieldClass } from "./shared.jsx";

const empty = { slug: "", title: "", status: "draft", seo_title: "", seo_description: "", og_image_url: "" };

/** Список страниц + создание; редактирование и блоки — /admin/pages/:id */
export default function AdminPagesList() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const data = await adminPages.list();
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

  async function onCreate(e) {
    e.preventDefault();
    setErr("");
    try {
      await adminPages.create({
        slug: form.slug,
        title: form.title,
        status: form.status,
        seo_title: form.seo_title.trim() || null,
        seo_description: form.seo_description.trim() || null,
        og_image_url: form.og_image_url.trim() || null,
      });
      setForm(empty);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Удалить страницу и блоки?")) return;
    setErr("");
    try {
      await adminPages.remove(id);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Страницы</h1>
      <ErrBox msg={err} />

      <form
        onSubmit={onCreate}
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-w-lg"
      >
        <h2 className="text-sm font-medium text-slate-300">Новая страница</h2>
        <label className="block text-xs text-slate-500">
          Slug *
          <input
            className={fieldClass}
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Заголовок *
          <input
            className={fieldClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Статус *
          <select
            className={fieldClass}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="block text-xs text-slate-500">
          SEO title
          <input
            className={fieldClass}
            value={form.seo_title}
            onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          SEO description
          <input
            className={fieldClass}
            value={form.seo_description}
            onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          OG image URL
          <input
            className={fieldClass}
            value={form.og_image_url}
            onChange={(e) => setForm({ ...form, og_image_url: e.target.value })}
          />
        </label>
        <button type="submit" className={btnPrimary}>
          Создать
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500">Загрузка…</p>
      ) : (
        <ul className="space-y-2">
          {list.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3"
            >
              <div>
                <Link
                  to={`/admin/pages/${p.id}`}
                  className="text-white font-medium hover:text-emerald-400"
                >
                  {p.title}
                </Link>
                <span className="text-slate-500 text-sm ml-2">
                  /{p.slug} · {p.status}
                </span>
              </div>
              <div className="flex gap-2">
                <Link to={`/admin/pages/${p.id}`} className="text-sm text-emerald-400 hover:underline">
                  Редактор
                </Link>
                <button type="button" className="text-sm text-red-400 hover:underline" onClick={() => onDelete(p.id)}>
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
