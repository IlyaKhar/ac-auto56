import { useState } from "react";
import { Link } from "react-router-dom";
import { OUR_SERVICES_CARDS } from "../data/staticServices.js";

function ServiceCard({ title, subtitle, href, image, fallbackClass }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link
      to={href}
      className="group relative block aspect-[3/4] min-h-[200px] overflow-hidden rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition hover:shadow-[0_12px_40px_rgba(0,0,0,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2"
    >
      {/* Фон: фото или градиент, если файла нет в public/services */}
      {imgOk ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          onError={() => setImgOk(false)}
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${fallbackClass}`}
          aria-hidden
        />
      )}
      {/* Затемнение как на макете: читаемый белый текст */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25"
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="max-w-[85%] text-left text-base font-bold leading-snug text-white drop-shadow md:text-lg">
            {title}
          </h3>
          <span
            className="shrink-0 text-xl font-light leading-none text-white opacity-95 transition group-hover:translate-x-0.5"
            aria-hidden
          >
            ›
          </span>
        </div>
        <p className="mt-auto max-w-[95%] text-left text-sm leading-snug text-white/95 drop-shadow md:text-[0.9375rem]">
          {subtitle}
        </p>
      </div>
    </Link>
  );
}

/**
 * Блок «НАШИ УСЛУГИ»; omitSlugs — скрыть карточки (напр. avtoservis на странице автосервиса).
 */
export function OurServicesSection({ omitSlugs = [] }) {
  const skip = new Set(omitSlugs);
  const cards = OUR_SERVICES_CARDS.filter((c) => !skip.has(c.slug));

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-base font-bold uppercase tracking-[0.12em] text-neutral-900 md:text-lg">
          Наши услуги
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <ServiceCard key={card.slug} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
