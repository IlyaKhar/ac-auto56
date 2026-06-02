/** Этапы оформления сделки на странице «О компании». */
const STEPS = [
  {
    n: 1,
    title: "Консультация и подбор",
    text: "Менеджер помогает выбрать автомобиль под ваши задачи и бюджет.",
  },
  {
    n: 2,
    title: "Осмотр и проверка",
    text: "Проверяем техническое состояние и юридическую чистоту выбранного авто.",
  },
  {
    n: 3,
    title: "Оформление документов",
    text: "Подготавливаем договор купли-продажи и сопутствующие документы.",
  },
  {
    n: 4,
    title: "Передача автомобиля",
    text: "Вы получаете ключи и полный пакет документов на автомобиль.",
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

export function AboutDealStagesSection() {
  return (
    <section className="bg-neutral-50 py-14 md:py-20" aria-labelledby="about-deal-stages-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <h2
          id="about-deal-stages-title"
          className="mx-auto max-w-4xl text-center text-sm font-bold uppercase leading-snug tracking-[0.08em] text-neutral-900 sm:text-base md:text-lg lg:text-xl"
        >
          Этапы оформления сделки
        </h2>

        <div className="mt-10 hidden md:mt-14 md:block">
          <ol className="grid list-none grid-cols-4 gap-x-4 lg:gap-x-8">
            {STEPS.map((step, i) => (
              <li key={step.n} className="relative flex flex-col items-start" aria-label={`Шаг ${step.n}: ${step.title}`}>
                {i > 0 ? (
                  <span
                    className="absolute -left-[calc(50%+1rem)] top-5 hidden h-0.5 w-[calc(100%+2rem)] bg-ac-bright-orange lg:-left-[calc(50%+1.5rem)] lg:w-[calc(100%+3rem)] md:block"
                    aria-hidden
                  />
                ) : null}
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ac-bright-orange text-sm font-bold text-white shadow">
                  {step.n}
                </span>
                <div className="mt-4 pr-2">
                  <StepBody step={step} />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ol className="mt-10 list-none space-y-8 md:hidden">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ac-bright-orange text-sm font-bold text-white">
                {step.n}
              </span>
              <div className="min-w-0 pt-1">
                <StepBody step={step} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
