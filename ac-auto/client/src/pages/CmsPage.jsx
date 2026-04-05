import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPublishedPage } from "../api/publicApi.js";
import { BlockRenderer } from "../components/BlockRenderer.jsx";

/** Опубликованная страница CMS: /page/:slug */
export default function CmsPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchPublishedPage(slug)
      .then((v) => {
        if (!cancelled) {
          setData(v);
          setErr("");
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setData(null);
          setErr(e.response?.data?.error || "Страница не найдена");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <p className="px-4 py-10 text-neutral-500" aria-busy="true">
        Загрузка…
      </p>
    );
  }
  if (err || !data?.page) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="mb-4 text-red-600">{err}</p>
        <Link to="/" className="text-sm text-ac-red hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  const { page, blocks } = data;

  return (
    <article className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold uppercase tracking-wide text-neutral-900">{page.title}</h1>
      {page.seo_description && (
        <p className="mb-8 text-sm text-neutral-600">{page.seo_description}</p>
      )}
      <BlockRenderer blocks={blocks} theme="light" />
    </article>
  );
}
