import { Fragment } from "react";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

function IconCircle({ children }) {
  return (
    <div
      className="mx-auto flex h-[6.1rem] w-[6.1rem] items-center justify-center rounded-full bg-gradient-to-br from-[#e02020] via-[#c41230] to-[#5c0d0d] shadow-md md:h-[6.9rem] md:w-[6.9rem]"
      aria-hidden
    >
      <span className="text-white [&_svg]:h-[2.45rem] [&_svg]:w-[2.45rem] md:[&_svg]:h-[2.85rem] md:[&_svg]:w-[2.85rem]">
        {children}
      </span>
    </div>
  );
}

function IconImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-[2.45rem] w-[2.45rem] object-contain md:h-[2.85rem] md:w-[2.85rem]"
      loading="lazy"
      decoding="async"
    />
  );
}

function ArrowBetween() {
  return (
    <div
      className="flex shrink-0 items-center justify-center py-2 text-[2.1rem] font-light leading-none text-[#c41230] md:px-3 md:py-0 md:pt-9 md:text-[2.35rem]"
      aria-hidden
    >
      ›
    </div>
  );
}

const STEPS = [
  {
    title: "Осмотр авто",
    text: "Мы осуществляем осмотр и техническую диагностику старого автомобиля.",
    icon: `${base}icons/Осмотравто.svg`,
  },
  {
    title: "Оценка авто",
    text: "Мы проводим оценку вашего транспортного средства",
    icon: `${base}icons/Оценкаавто.svg`,
  },
  {
    title: "Оплата",
    text: "Вы оставляете автомобиль в нашем салоне, выплачиваете разницу в цене и покидаете салон на новом автомобиле, имея при себе все документы на него",
    icon: `${base}icons/Гарантированнаяоплата.svg`,
  },
];

/**
 * Блок «Этапы услуги Trade-In» как в референсе.
 */
export function TradeInStepsSection() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="trade-in-steps-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="trade-in-steps-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Этапы услуги Trade-In
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-neutral-600 md:mt-8 md:text-base">
          Мы принимаем любые модели автомобилей отечественного или иностранного производства, которые прошли
          растаможку и были проданы в РФ через официальных дилеров.
        </p>

        <div className="mt-12 flex flex-col items-center md:mt-14 md:flex-row md:items-start md:justify-center md:gap-5 lg:gap-8">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="flex w-full max-w-md flex-col items-center text-center md:max-w-[18.5rem] md:flex-1 lg:max-w-[19.5rem]">
                <IconCircle>
                  <IconImage src={step.icon} alt={step.title} />
                </IconCircle>
                <h3 className="mt-5 text-base font-bold leading-tight text-neutral-900 md:text-[1.08rem]">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 md:text-[0.97rem]">{step.text}</p>
              </div>
              {i < STEPS.length - 1 ? <ArrowBetween /> : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
