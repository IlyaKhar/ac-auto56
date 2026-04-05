import { useCallback, useEffect, useState } from "react";
import { formatRub } from "../utils/formatRub.js";

function HeartIcon({ filled }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      className={filled ? "text-red-500" : "text-neutral-600"}
      aria-hidden
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/**
 * Полноэкранная карточка авто (макет: галерея слева, текст справа).
 */
export function CarDetailModal({ open, vehicle, onClose, onConsult, favoriteIds, onToggleFavorite }) {
  const [idx, setIdx] = useState(0);

  const images = Array.isArray(vehicle?.images) ? vehicle.images.filter(Boolean) : [];
  const safeIdx = images.length ? Math.min(idx, images.length - 1) : 0;
  const mainSrc = images[safeIdx] || "";

  useEffect(() => {
    if (open) {
      setIdx(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dismiss = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && dismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open || !vehicle) return null;

  const fav = favoriteIds?.has(vehicle.id);

  function prev() {
    setIdx((i) => (images.length ? (i - 1 + images.length) % images.length : 0));
  }
  function next() {
    setIdx((i) => (images.length ? (i + 1) % images.length : 0));
  }

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-white">
      <header className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-3 md:px-8">
        <button
          type="button"
          onClick={dismiss}
          className="text-sm font-medium text-neutral-700 transition hover:text-ac-bright-orange"
        >
          ← Вернуться
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-neutral-500 hover:bg-neutral-100"
          aria-label="Закрыть"
        >
          ×
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 md:grid-cols-2 md:gap-12 md:px-8 lg:py-10">
          {/* Галерея */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
              {mainSrc ? (
                <img src={mainSrc} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-400">Нет фото</div>
              )}
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Предыдущее фото"
                    className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-md hover:bg-white"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Следующее фото"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-md hover:bg-white"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>
            {images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      i === safeIdx ? "border-ac-bright-orange" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Текст */}
          <div>
            <h1 className="text-xl font-bold leading-snug text-neutral-900 md:text-2xl">{vehicle.title}</h1>
            {vehicle.brand_label ? (
              <p className="mt-1 text-sm text-neutral-500">{vehicle.brand_label}</p>
            ) : null}
            <p className="mt-2 text-sm font-medium text-neutral-700">
              {vehicle.is_new ? "Новый" : "С пробегом"}
            </p>
            <p className="mt-4 text-2xl font-bold text-neutral-900 md:text-3xl">{formatRub(vehicle.price_rub)}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  dismiss();
                  onConsult?.();
                }}
                className="rounded-lg bg-ac-bright-orange px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
              >
                Узнать больше
              </button>
              <button
                type="button"
                onClick={() => onToggleFavorite?.(vehicle.id)}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-white transition hover:border-neutral-300"
                aria-label={fav ? "Убрать из избранного" : "В избранное"}
              >
                <HeartIcon filled={fav} />
              </button>
            </div>

            {vehicle.description ? (
              <p className="mt-8 text-sm leading-relaxed text-neutral-700 whitespace-pre-wrap">{vehicle.description}</p>
            ) : null}

            {Array.isArray(vehicle.features) && vehicle.features.length > 0 ? (
              <ul className="mt-6 space-y-2 text-sm text-neutral-800">
                {vehicle.features.map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 text-green-600" aria-hidden>
                      ✓
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <p className="mt-8 text-xs text-neutral-400">*Не является публичной офертой</p>
          </div>
        </div>
      </div>
    </div>
  );
}
