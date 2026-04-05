import { Link } from "react-router-dom";
import { STATIC_SERVICE_LANDING } from "../data/staticServices.js";

/**
 * Статичная страница услуги (без CMS). slug — ключ из STATIC_SERVICE_LANDING.
 */
export default function StaticServiceLandingPage({ slug }) {
  const data = STATIC_SERVICE_LANDING[slug];
  if (!data) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-neutral-600">Страница не найдена.</p>
        <Link to="/katalog" className="mt-4 inline-block text-ac-bright-orange hover:underline">
          На главную
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <Link
        to="/katalog"
        className="text-sm font-medium text-ac-bright-orange underline-offset-2 hover:underline"
      >
        ← На главную
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-neutral-900 md:text-3xl">{data.title}</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-neutral-700 md:text-base">
        {data.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
