const VALUES = [
  {
    title: "Честность",
    text: "Открыто рассказываем о состоянии автомобиля и условиях сделки.",
  },
  {
    title: "Качество",
    text: "Проверяем авто перед продажей и отвечаем за юридическую чистоту.",
  },
  {
    title: "Забота о клиенте",
    text: "Сопровождаем на каждом этапе — от подбора до передачи ключей.",
  },
];

/** Блок «Наши ценности» на /o-kompanii. */
export function AboutValuesSection() {
  return (
    <section id="about-values" className="bg-white py-14 md:py-20" aria-labelledby="about-values-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="about-values-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Наши ценности
        </h2>
        <ul className="mt-10 grid list-none gap-6 sm:grid-cols-3 md:mt-12 md:gap-8">
          {VALUES.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-6 text-center shadow-sm md:px-6 md:py-8"
            >
              <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-base">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
