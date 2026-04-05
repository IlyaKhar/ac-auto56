/**
 * Этапы автокредитования — тёмный фон, сетка 2×2, красная рамка карточек и кружок с номером.
 */

const STEPS = [
  {
    title: "Выбираете автомобиль",
    text: "Вы без труда подберете автомобиль в нужной комплектации, расцветке и набором полезных опций. В этом помогут компетентные менеджеры. Если авто нет в наличии, его всегда можно заказать.",
  },
  {
    title: "Подбираем кредитную программу",
    text: "Менеджеры по кредитованию и страхованию расскажут о предложениях банков и помогут подобрать программу кредитования с наилучшими для вас условиями.",
  },
  {
    title: "Подаём заявку",
    text: "Менеджер оформляет пакет документов и подает заявку в банк.",
  },
  {
    title: "Заключаем договор",
    text: "Если банк принимает положительное решение, поздравляем вас! Осталось только подписать кредитный договор и уехать от нас на новом автомобиле.",
  },
];

export function AvtokreditStagesSection() {
  return (
    <section
      className="bg-neutral-950 py-14 md:py-20"
      aria-labelledby="avtokredit-stages-title"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="avtokredit-stages-title"
          className="text-center text-base font-bold uppercase tracking-[0.08em] text-white md:text-lg"
        >
          Этапы автокредитования в «ACT AUTO»
        </h2>

        <ul className="mt-12 grid list-none grid-cols-1 gap-10 md:mt-16 md:grid-cols-2 md:gap-x-10 md:gap-y-14">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative px-2 pt-2">
              <div className="relative rounded-lg border-2 border-[#e31e24] px-5 pb-8 pt-10 text-center md:px-8 md:pb-10 md:pt-12">
                <span
                  className="absolute left-1/2 top-0 z-[1] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#e31e24] text-lg font-bold text-white shadow-md md:h-14 md:w-14 md:text-xl"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <h3 className="text-sm font-bold uppercase leading-snug tracking-wide text-white md:text-base">
                  {step.title}
                </h3>
                <p className="mt-4 text-center text-sm leading-relaxed text-white/90 md:text-[0.9375rem]">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
