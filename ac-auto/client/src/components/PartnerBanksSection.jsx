import { useCallback, useId, useState } from "react";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

/**
 * Собирает слайды логотипов: папка public/{folder}/01.jpg …
 * @param {string} folder — имя папки в public
 * @param {number} slideCount — число слайдов
 * @param {number} perSlide — логотипов на слайд
 * @param {string} altPrefix — префикс для alt
 */
function buildPartnerSlides(folder, slideCount, perSlide, altPrefix) {
  const slides = [];
  for (let s = 0; s < slideCount; s += 1) {
    const items = [];
    for (let i = 0; i < perSlide; i += 1) {
      const n = s * perSlide + i + 1;
      const file = `${String(n).padStart(2, "0")}.jpg`;
      items.push({
        key: `${folder}-${n}`,
        src: `${base}${folder}/${file}`,
        fileLabel: `${folder}/${file}`,
        alt: `${altPrefix} ${n}`,
      });
    }
    slides.push(items);
  }
  return slides;
}

/**
 * Слайдер логотипов партнёров (банки, страховые — одна вёрстка).
 */
function PartnersLogoSlider({ slides, title }) {
  const slideCount = slides.length;
  const [active, setActive] = useState(0);
  const [broken, setBroken] = useState(() => ({}));
  const regionId = useId();

  const markBroken = useCallback((key) => {
    setBroken((prev) => ({ ...prev, [key]: true }));
  }, []);

  const go = useCallback(
    (dir) => {
      setActive((i) => {
        const next = i + dir;
        if (next < 0) return slideCount - 1;
        if (next >= slideCount) return 0;
        return next;
      });
    },
    [slideCount],
  );

  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20" aria-labelledby={regionId}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id={regionId}
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          {title}
        </h2>
      </div>

      <div className="relative mt-8 w-full md:mt-10">
        <button
          type="button"
          className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-600 shadow-sm transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 sm:left-4 md:left-6 md:h-11 md:w-11 lg:left-10"
          aria-label="Предыдущий слайд"
          onClick={() => go(-1)}
        >
          <span className="-mt-0.5 leading-none" aria-hidden>
            ‹
          </span>
        </button>
        <button
          type="button"
          className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-100 text-lg text-neutral-600 shadow-sm transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 sm:right-4 md:right-6 md:h-11 md:w-11 lg:right-10"
          aria-label="Следующий слайд"
          onClick={() => go(1)}
        >
          <span className="-mt-0.5 leading-none" aria-hidden>
            ›
          </span>
        </button>

        <div className="w-full overflow-hidden pl-12 pr-12 sm:pl-16 sm:pr-16 md:pl-20 md:pr-20 lg:pl-24 lg:pr-24">
          <div
            className="flex w-full transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{
              transform: `translateX(-${(active * 100) / slideCount}%)`,
            }}
          >
            {slides.map((row, slideIndex) => (
              <div
                key={slideIndex}
                className="grid min-w-0 flex-[0_0_100%] grid-cols-2 gap-6 px-2 sm:gap-8 md:grid-cols-4 md:gap-10 lg:gap-14 xl:gap-16"
                aria-hidden={slideIndex !== active}
              >
                {row.map((item) => (
                  <div
                    key={item.key}
                    className="flex min-h-[72px] items-center justify-center md:min-h-[88px]"
                  >
                    {!broken[item.key] ? (
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="max-h-14 w-full max-w-[200px] object-contain md:max-h-16 lg:max-h-[4.5rem]"
                        loading="lazy"
                        decoding="async"
                        onError={() => markBroken(item.key)}
                      />
                    ) : (
                      <span className="text-center text-[10px] text-neutral-400 md:text-xs">{item.fileLabel}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-6 flex max-w-6xl justify-center gap-2 px-4" role="tablist" aria-label="Выбор слайда">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Слайд ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 ${
                i === active ? "scale-110 bg-ac-bright-orange" : "bg-neutral-300 hover:bg-neutral-400"
              }`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const BANK_SLIDES = buildPartnerSlides("partner-banks", 3, 4, "Логотип банка-партнёра");
const INSURANCE_SLIDES = buildPartnerSlides("partner-insurance", 1, 4, "Логотип страхового партнёра");

/**
 * Блок «Банки-партнёры»: как на главной / кредите.
 * @param {string} [props.title]
 */
export function PartnerBanksSection({ title = "Банки партнёров" }) {
  return <PartnersLogoSlider slides={BANK_SLIDES} title={title} />;
}

/** Партнёры по страхованию — те же стрелки/сетка, файлы в public/partner-insurance/01.jpg … 04.jpg */
export function PartnerInsuranceSection({
  title = 'Партнёры «ACT AUTO» по услуге страхования',
}) {
  return <PartnersLogoSlider slides={INSURANCE_SLIDES} title={title} />;
}
