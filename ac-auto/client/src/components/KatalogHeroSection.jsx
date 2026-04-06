import { useState } from "react";

const base = import.meta.env.BASE_URL || "/";

/** Картинка справа: положи katalog-hero-man.png в public/ или задай VITE_KATALOG_HERO_IMAGE. */
const heroImg =
  (import.meta.env.VITE_KATALOG_HERO_IMAGE || "").trim() || `${base}katalog-hero-man.png`;

/**
 * Статичный герой главной (каталог): градиент, текст слева, фото справа, кнопка открывает модалку.
 */
export function KatalogHeroSection({ onLearnMore }) {
  const [imgBroken, setImgBroken] = useState(false);

  return (
    <section className="relative overflow-hidden bg-slate-200">
      {!imgBroken ? (
        <img
          src={heroImg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-right"
          onError={() => setImgBroken(true)}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-[#eceff3]/95 via-[#eceff3]/85 to-[#eceff3]/10" aria-hidden />

      <div className="relative mx-auto min-h-[28rem] max-w-7xl px-4 py-10 md:py-14 lg:min-h-[32rem] lg:py-16">
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold leading-tight text-neutral-800 md:text-3xl lg:text-4xl lg:leading-snug">
            Более{" "}
            <span className="text-ac-hero-accent">250 проверенных автомобилей</span> с гарантией юридической
            чистоты!
          </h1>
          <ul className="mt-6 space-y-2 text-sm text-neutral-600 md:text-base">
            <li className="flex gap-2">
              <span className="text-ac-bright-orange" aria-hidden>
                •
              </span>
              <span>Техническая гарантия</span>
            </li>
            <li className="flex gap-2">
              <span className="text-ac-bright-orange" aria-hidden>
                •
              </span>
              <span>Юридическая чистота</span>
            </li>
            <li className="flex gap-2">
              <span className="text-ac-bright-orange" aria-hidden>
                •
              </span>
              <span>Обслуживание в течение 6 месяцев в сервисе автосалона</span>
            </li>
            <li className="flex gap-2">
              <span className="text-ac-bright-orange" aria-hidden>
                •
              </span>
              <span>Большой выбор гибких программ автокредитования</span>
            </li>
          </ul>
          <button
            type="button"
            onClick={onLearnMore}
            className="mt-8 rounded-sm bg-ac-bright-orange px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-ac-bright-orange focus:ring-offset-2"
          >
            Узнать подробнее
          </button>
        </div>
      </div>
      {imgBroken ? (
        <div className="pointer-events-none absolute right-4 top-4 rounded bg-white/85 px-3 py-2 text-xs text-neutral-500">
          Добавьте <code className="rounded bg-white px-1">public/katalog-hero-man.png</code>
        </div>
      ) : null}
    </section>
  );
}
