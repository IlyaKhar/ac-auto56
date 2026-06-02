import { useEffect, useState } from "react";

/** Кнопка «Вверх» — показывается после прокрутки вниз. */
export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      data-scroll-top
      aria-label="Вверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="pointer-events-auto fixed bottom-24 right-4 z-[55] flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-lg transition hover:bg-neutral-50 sm:bottom-28 sm:right-6"
    >
      <span className="text-xl font-bold leading-none" aria-hidden>
        ↑
      </span>
    </button>
  );
}
