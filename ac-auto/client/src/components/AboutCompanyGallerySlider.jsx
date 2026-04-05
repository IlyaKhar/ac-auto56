import { useCallback, useEffect, useMemo, useState } from "react";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

function resolveSrc(url) {
  if (!url || typeof url !== "string") return "";
  const u = url.trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return u;
  return `${base}${u.replace(/^\//, "")}`;
}

/** Слайдер страницы «О компании»: боковые превью, стрелки, точки. */
export function AboutCompanyGallerySlider({ imageUrls = [] }) {
  const slides = useMemo(
    () => (Array.isArray(imageUrls) ? imageUrls.map((u) => resolveSrc(u)).filter(Boolean) : []),
    [imageUrls],
  );
  const n = slides.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [n]);

  const go = useCallback(
    (delta) => {
      if (n < 1) return;
      setActive((i) => (i + delta + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (n < 2) return undefined;
    const t = window.setInterval(() => go(1), 6000);
    return () => window.clearInterval(t);
  }, [n, go]);

  if (n === 0) {
    return (
      <section className="bg-white py-12 md:py-16" aria-label="Галерея салона">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex aspect-[21/9] w-full items-center justify-center rounded-xl bg-neutral-100 text-center text-sm text-neutral-500 md:text-base">
            Добавьте до 5 фото в админке: «О компании — слайдер»
          </div>
        </div>
      </section>
    );
  }

  const prev = (active - 1 + n) % n;
  const next = (active + 1) % n;

  return (
    <section className="bg-white py-12 md:py-16" aria-label="Галерея салона">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          {n > 1 ? (
            <button
              type="button"
              onClick={() => go(-1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xl text-neutral-800 shadow-sm transition hover:bg-neutral-300 md:flex"
              aria-label="Предыдущий слайд"
            >
              ‹
            </button>
          ) : null}

          <div className="flex min-w-0 flex-1 items-stretch gap-2 md:gap-4">
            {n > 1 ? (
              <button
                type="button"
                onClick={() => go(-1)}
                className="hidden w-[15%] max-w-[140px] shrink-0 overflow-hidden rounded-lg opacity-45 sm:block"
                aria-hidden
              >
                <img src={slides[prev]} alt="" className="h-full min-h-[120px] w-full object-cover md:min-h-[180px]" />
              </button>
            ) : null}

            <div className="relative min-w-0 flex-1 overflow-hidden rounded-xl bg-neutral-100 shadow-md">
              <img src={slides[active]} alt="" className="aspect-[21/9] w-full object-cover" />
              {n > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-lg text-neutral-800 shadow md:hidden"
                    aria-label="Назад"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-lg text-neutral-800 shadow md:hidden"
                    aria-label="Вперёд"
                  >
                    ›
                  </button>
                </>
              ) : null}
            </div>

            {n > 1 ? (
              <button
                type="button"
                onClick={() => go(1)}
                className="hidden w-[15%] max-w-[140px] shrink-0 overflow-hidden rounded-lg opacity-45 sm:block"
                aria-hidden
              >
                <img src={slides[next]} alt="" className="h-full min-h-[120px] w-full object-cover md:min-h-[180px]" />
              </button>
            ) : null}
          </div>

          {n > 1 ? (
            <button
              type="button"
              onClick={() => go(1)}
              className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xl text-neutral-800 shadow-sm transition hover:bg-neutral-300 md:flex"
              aria-label="Следующий слайд"
            >
              ›
            </button>
          ) : null}
        </div>

        {n > 1 ? (
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`h-2 w-2 rounded-full transition ${i === active ? "bg-neutral-800" : "bg-neutral-300"}`}
                aria-label={`Слайд ${i + 1}`}
                aria-current={i === active}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
