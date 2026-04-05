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
    <section className="bg-gradient-to-r from-slate-200/90 via-slate-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:gap-10 md:py-14 lg:grid-cols-2 lg:py-16">
        <div className="order-2 lg:order-1">
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

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          {!imgBroken ? (
            <img
              src={heroImg}
              alt=""
              className="max-h-[min(420px,55vh)] w-auto max-w-full object-contain object-bottom"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="flex min-h-[280px] w-full max-w-md items-center justify-center rounded-lg bg-neutral-200/80 px-4 text-center text-sm text-neutral-500">
              Добавьте фото в <code className="rounded bg-white px-1">public/katalog-hero-man.png</code>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
