import { useState } from "react";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

/** Фон: public/avtomobili-hero.jpg или VITE_AVTOBILI_HERO_IMAGE (URL/путь). */
const bgSrc =
  (import.meta.env.VITE_AVTOBILI_HERO_IMAGE || "").trim() || `${base}services/tild6430-6163-4962-a163-363565663537_____2.jpg`;

/** Нижняя красная полоса: VITE_AVTOBILI_HERO_ACCENT (hex), иначе ярко-красный как на макете */
const accentColor = (import.meta.env.VITE_AVTOBILI_HERO_ACCENT || "").trim() || "#e30613";

/**
 * Полноэкранный герой каталога: /katalog и /avtomobili.
 * @param {string} [catalogAnchorId] — id блока с сеткой для шеврона (#…)
 * @param {() => void} [onLearnMore] — если задан, показываем кнопку «Узнать подробнее» (модалка trade-in)
 */
export function AvtomobiliHeroSection({ catalogAnchorId = "katalog-catalog", onLearnMore }) {
  const [imgBroken, setImgBroken] = useState(false);

  return (
    <section className="relative isolate min-h-[min(56vh,520px)] w-full md:min-h-[min(60vh,600px)]" aria-label="Каталог автомобилей">
      {!imgBroken ? (
        <img
          src={bgSrc}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          onError={() => setImgBroken(true)}
        />
      ) : (
        <div
          className="absolute inset-0 -z-20 bg-neutral-800 bg-[length:cover] bg-center"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 -z-10 bg-black/55" aria-hidden />

      <div className="relative flex min-h-[min(56vh,520px)] flex-col md:min-h-[min(60vh,600px)]">
        <div className="flex flex-1 flex-col items-center justify-center px-4 pb-24 pt-16 text-center md:pb-28 md:pt-20">
          <h1 className="font-montserrat text-2xl font-extrabold uppercase leading-tight tracking-[0.08em] text-white md:text-4xl md:tracking-[0.1em] lg:text-5xl">
            <span className="block">Каталог автомобилей с пробегом</span>
            <span className="mt-2 block md:mt-3">в наличии</span>
          </h1>
          {typeof onLearnMore === "function" ? (
            <button
              type="button"
              onClick={onLearnMore}
              className="mt-8 rounded-sm bg-ac-bright-orange px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
            >
              Узнать подробнее
            </button>
          ) : null}
        </div>

        <a
          href={`#${catalogAnchorId}`}
          className="absolute bottom-10 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center text-white/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:bottom-12"
          aria-label="Перейти к списку автомобилей"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div className="h-[3px] w-full shrink-0 md:h-1" style={{ backgroundColor: accentColor }} aria-hidden />
      </div>
    </section>
  );
}
