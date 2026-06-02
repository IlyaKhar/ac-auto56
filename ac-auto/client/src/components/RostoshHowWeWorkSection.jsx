const STEPS = [
  { n: 1, title: "Заявка или звонок", text: "Вы оставляете заявку или звоните — уточняем услугу и время визита." },
  { n: 2, title: "Диагностика", text: "Проводим осмотр и согласовываем перечень работ и стоимость." },
  { n: 3, title: "Ремонт и выдача", text: "Выполняем работы и передаём автомобиль с рекомендациями по эксплуатации." },
];

/** Блок «Как мы работаем» на странице автосервиса. */
export function RostoshHowWeWorkSection() {
  return (
    <section className="bg-neutral-100 py-14 md:py-20" aria-labelledby="rostosh-how-title">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <h2
          id="rostosh-how-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Как мы работаем
        </h2>
        <ol className="mt-10 list-none space-y-6 md:mt-12">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-4 rounded-xl bg-white px-5 py-5 shadow-sm md:px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ac-bright-orange text-sm font-bold text-white">
                {step.n}
              </span>
              <div className="min-w-0 pt-1">
                <h3 className="text-sm font-bold text-neutral-900 md:text-base">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-700">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
