const ITEMS = [
  {
    title: "Опытные специалисты",
    text: "Мастера сети «ROSTOSH» выполняют ремонт и обслуживание любой сложности.",
  },
  {
    title: "Современное оборудование",
    text: "Диагностика и ремонт на профессиональном инструменте и стендах.",
  },
  {
    title: "Прозрачные условия",
    text: "Согласовываем стоимость работ до начала ремонта и держим в курсе статуса.",
  },
];

/** Преимущества автосервиса на /page/avtoservis. */
export function RostoshBenefitsSection() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="rostosh-benefits-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="rostosh-benefits-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Преимущества сервиса
        </h2>
        <ul className="mt-10 grid list-none gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
          {ITEMS.map((item) => (
            <li key={item.title} className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-6 md:px-6">
              <h3 className="text-sm font-bold text-neutral-900 md:text-base">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
