const ITEMS = [
  { title: "Удобно и быстро", text: "Берём на себя рекламу, показы и переговоры с покупателями." },
  { title: "Профессионально", text: "Продажей автомобиля занимаются менеджеры автосалона." },
  { title: "Экономично", text: "Бесплатная мойка и прозрачная комиссия." },
  { title: "Без ограничений", text: "Нет ограничений по марке, модели и году выпуска автомобиля." },
  { title: "Безопасно", text: "Комиссионные автомобили находятся на охраняемой стоянке." },
  { title: "Выгодно", text: "Возможность продажи с программами автокредитования для покупателя." },
];

/**
 * Преимущества комиссионной продажи.
 */
export function KomissionnayaAdvantagesSection() {
  return (
    <section className="border-b-4 border-[#c41230] bg-neutral-100 py-14 md:py-20" aria-labelledby="komissiya-adv-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="komissiya-adv-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Преимущества комиссионной продажи
        </h2>
        <ul className="mt-10 grid list-none grid-cols-1 gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          {ITEMS.map((it) => (
            <li key={it.title} className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-base">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 md:text-[0.9375rem]">{it.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
