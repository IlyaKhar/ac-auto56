import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchService } from "../api/publicApi.js";
import { openLeadCaptureModal } from "../utils/leadModalEvents.js";

/** Карточка услуги с API */
export default function ServicePage() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchService(id)
      .then((data) => {
        if (!cancelled) {
          setS(data);
          setErr("");
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setS(null);
          setErr(e.response?.data?.error || "Услуга не найдена");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="px-4 py-10 text-neutral-500">Загрузка…</p>;
  }
  if (err || !s) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="mb-4 text-red-600">{err || "Нет данных"}</p>
        <Link to="/uslugi" className="text-sm text-ac-red hover:underline">
          ← К услугам
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/uslugi" className="mb-4 inline-block text-sm text-neutral-500 hover:text-ac-red">
        ← Услуги
      </Link>
      <h1 className="mt-2 text-3xl font-bold text-neutral-900">{s.title}</h1>
      {s.category_title && <p className="mt-1 text-sm text-neutral-500">{s.category_title}</p>}
      <div className="mt-6 space-y-4 text-neutral-800">
        {s.price && (
          <p>
            <span className="text-neutral-500">Цена: </span>
            <span className="font-semibold text-ac-red">{s.price}</span>
          </p>
        )}
        {s.duration && (
          <p>
            <span className="text-neutral-500">Длительность: </span>
            {s.duration}
          </p>
        )}
        {s.description && <p className="whitespace-pre-wrap">{s.description}</p>}
      </div>
      <div className="mt-10">
        <button
          type="button"
          className="ac-btn-primary inline-flex items-center justify-center px-6 py-3 text-sm font-semibold uppercase tracking-wide"
          onClick={() => openLeadCaptureModal({ serviceId: s.id })}
        >
          Заявка на услугу
        </button>
      </div>
    </article>
  );
}
