import { openLeadCaptureModal } from "../utils/leadModalEvents.js";

/** Блок «Не нашли ответа?» на главной (рис. 78). */
export function HomeNotFoundSection() {
  return (
    <section id="home-not-found" className="bg-neutral-950 px-4 py-14 text-center text-white md:py-20" aria-labelledby="home-not-found-title">
      <div className="mx-auto max-w-2xl">
        <h2 id="home-not-found-title" className="text-lg font-bold uppercase tracking-[0.08em] md:text-xl">
          Не нашли ответа?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
          Оставьте заявку — специалист свяжется с вами и поможет подобрать автомобиль или услугу.
        </p>
        <button
          type="button"
          onClick={() => openLeadCaptureModal({ contextLabel: "Не нашли ответа — главная" })}
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-ac-vykup-cta px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-white"
        >
          Написать нам
        </button>
      </div>
    </section>
  );
}
