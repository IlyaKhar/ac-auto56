import { Fragment } from "react";

/**
 * Блок «Этапы услуги Trade-In» на /page/trade-in: 3 шага, стрелки, круги с градиентом.
 */

function IconCircle({ children }) {
  return (
    <div
      className="mx-auto flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-gradient-to-br from-[#e02020] via-[#c41230] to-[#5c0d0d] shadow-md md:h-16 md:w-16"
      aria-hidden
    >
      <span className="text-white [&_svg]:h-[1.65rem] [&_svg]:w-[1.65rem] md:[&_svg]:h-[1.85rem] md:[&_svg]:w-[1.85rem]">
        {children}
      </span>
    </div>
  );
}

function IconMagnifier() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="13" cy="13" r="7" />
      <path d="M18 18l9 9" />
    </svg>
  );
}

function IconCarWrench() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 6l2 2-1.5 1.5M12 8l1.5-1.5M11 7.5L9 5.5" />
      <path d="M14 4l2 2M15 3v3M13 5h3" />
      <path d="M4 22h22v2H4v-2zM6 22l2.5-5h15l2.5 5" />
      <path d="M9 22v2M23 22v2" />
      <circle cx="11" cy="25" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="21" cy="25" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconMoneyBag() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12c0-2 2.5-4 6-4s6 2 6 4v2H10v-2z" />
      <path d="M8 14h16l-1 14H9L8 14z" />
      <path d="M16 10.5v11M18 12c0-1.2-1-2-2-2s-2 .6-2 1.8c0 1.6 1.2 2 3.2 2.6 2 .6 3.2 1.2 3.2 2.8 0 1.4-1.2 2.3-3.2 2.3s-3.2-.9-3.2-2.5" />
    </svg>
  );
}

function ArrowBetween() {
  return (
    <div
      className="flex shrink-0 items-center justify-center py-2 text-3xl font-light leading-none text-[#c41230] md:px-2 md:py-0 md:pt-10"
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
    icon: <IconMagnifier />,
  },
  {
    title: "Оценка авто",
    text: "Мы проводим оценку вашего транспортного средства",
    icon: <IconCarWrench />,
  },
  {
    title: "Оплата",
    text: "Вы оставляете автомобиль в нашем салоне, выплачиваете разницу в цене и покидаете салон на новом автомобиле, имея при себе все документы на него",
    icon: <IconMoneyBag />,
  },
];

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

        <div className="mt-12 flex flex-col items-center md:mt-14 md:flex-row md:items-start md:justify-center md:gap-2 lg:gap-4">
          {STEPS.map((step, i) => (
            <Fragment key={step.title}>
              <div className="flex w-full max-w-md flex-col items-center text-center md:max-w-[17rem] md:flex-1 lg:max-w-xs">
                <IconCircle>{step.icon}</IconCircle>
                <h3 className="mt-4 text-base font-bold text-neutral-900 md:text-[1.05rem]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-[0.9375rem]">{step.text}</p>
              </div>
              {i < STEPS.length - 1 ? <ArrowBetween /> : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
