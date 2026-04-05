import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, fetchServices } from "../api/publicApi.js";

/** Каталог услуг с API — маршрут /uslugi */
export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [catId, setCatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCategories()
      .then((c) => {
        if (!cancelled) setCategories(Array.isArray(c) ? c : []);
      })
      .catch(() => {
        if (!cancelled) setErr("Не удалось загрузить категории");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = {};
    if (catId != null) params.category_id = catId;
    fetchServices(params)
      .then((list) => {
        if (!cancelled) {
          setServices(Array.isArray(list) ? list : []);
          setErr("");
        }
      })
      .catch(() => {
        if (!cancelled) setErr("Не удалось загрузить услуги");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [catId]);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active !== false),
    [categories],
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold uppercase tracking-wide text-neutral-900">Услуги</h1>
      <p className="mb-8 text-sm text-neutral-600">Категории и карточки с бэка.</p>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCatId(null)}
          className={`rounded-lg border px-3 py-1.5 text-sm transition ${
            catId === null
              ? "border-ac-red bg-red-50 text-ac-red"
              : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
          }`}
        >
          Все
        </button>
        {activeCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCatId(c.id)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              catId === c.id
                ? "border-ac-red bg-red-50 text-ac-red"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {err && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {err}
        </p>
      )}

      {loading ? (
        <p className="text-neutral-500">Загрузка…</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-ac-red/40"
            >
              <Link to={`/services/${s.id}`} className="group block">
                <span className="text-lg font-semibold text-neutral-900 group-hover:text-ac-red">{s.title}</span>
                {s.category_title && (
                  <span className="mt-1 block text-xs text-neutral-500">{s.category_title}</span>
                )}
                {s.price && <span className="mt-2 block text-sm font-medium text-ac-red">{s.price}</span>}
                {s.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{s.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!loading && !services.length && !err && (
        <p className="text-neutral-500">В этой категории пока нет услуг.</p>
      )}
    </div>
  );
}
