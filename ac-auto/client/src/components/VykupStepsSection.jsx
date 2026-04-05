/**
 * Этапы выкупа: на md+ горизонтальная красная линия через центры кругов; на мобиле — колонка.
 */

const STEPS = [
  {
    n: 1,
    title: "Осмотр и диагностика автомобиля",
    text: "Осмотр автомобиля производится в собственном сервисном центре сети автосалонов",
  },
  {
    n: 2,
    title: "Оценка автомобиля",
    text: "Оценка стоимости автомобиля проходит совместно с экспертом",
  },
  {
    n: 3,
    title: "Цена",
    text: "На данном этапе мы согласовываем цену вашего автомобиля, которая удовлетворяет обе стороны",
  },
  {
    n: 4,
    title: "Договор",
    text: "Оформляем договор купли-продажи автомобиля по ранее согласованной цене",
  },
];

function StepBody({ step }) {
  return (
    <>
      <h3 className="text-left text-sm font-bold leading-snug text-neutral-900 lg:text-[0.9375rem]">{step.title}</h3>
      <p className="mt-2 text-left text-sm leading-relaxed text-neutral-800 lg:text-[0.9375rem]">{step.text}</p>
    </>
  );
}

export function VykupStepsSection() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="vykup-steps-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <h2
          id="vykup-steps-title"
          className="mx-auto max-w-4xl text-center text-sm font-bold uppercase leading-snug tracking-[0.08em] text-neutral-900 sm:text-base md:text-lg lg:text-xl"
        >
          Этапы выкупа вашего автомобиля
        </h2>

        {/* Десктоп: отрезки линии только между 1–2, 2–3, 3–4 (после 4-й не тянем) */}
        <div className="mt-10 hidden md:mt-14 md:block">
          <ol className="grid list-none grid-cols-4 gap-x-4 lg:gap-x-8">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className="relative flex flex-col items-start"
                aria-label={`Шаг ${step.n}: ${step.title}`}
              >
                {i < STEPS.length - 1 ? (
                  <div
                    className="pointer-events-none absolute left-16 top-8 z-0 h-[2px] w-[calc(100%-3rem)] -translate-y-1/2 bg-[#c41230] lg:w-[calc(100%-2rem)]"
                    aria-hidden
                  />
                ) : null}
                <div className="relative z-10 mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#c41230] text-xl font-bold text-white">
                  {step.n}
                </div>
                <StepBody step={step} />
              </li>
            ))}
          </ol>
        </div>

        {/* Мобилка: круг + текст, без горизонтальной линии */}
        <ol className="mt-10 list-none space-y-9 md:mt-14 md:hidden">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex gap-4"
              aria-label={`Шаг ${step.n}: ${step.title}`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#c41230] text-lg font-bold text-white">
                {step.n}
              </div>
              <div className="min-w-0 pt-0.5">
                <StepBody step={step} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
