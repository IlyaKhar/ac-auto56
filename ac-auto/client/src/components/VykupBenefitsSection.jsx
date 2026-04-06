const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

function IconCircle({ children }) {
  return (
    <div
      className="flex h-[4.4rem] w-[4.4rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e02020] via-[#c41230] to-[#5c0d0d] shadow-md md:h-[4.9rem] md:w-[4.9rem]"
      aria-hidden
    >
      <span className="text-white">{children}</span>
    </div>
  );
}

function IconImage({ src, alt }) {
  return <img src={src} alt={alt} className="h-8 w-8 object-contain md:h-9 md:w-9" loading="lazy" decoding="async" />;
}

const ITEMS = [
  {
    title: "Экономия времени",
    text: "Вместо Вас поиском клиентов, размещением рекламы, демонстрацией авто, переговорами с покупателями и самой продажей будет заниматься мы.",
    icon: `${base}icons/сКОРОСТЬ.svg`,
  },
  {
    title: "Без ограничений",
    text: "Нет ограничений по марке, модели и году выпуска автомобиля.",
    icon: `${base}icons/Оценкаавто.svg`,
  },
  {
    title: "Юридическая чистота сделки",
    text: "Оформление сделки выполняется нашими юристами в полном соответствии с законодательством РФ.",
    icon: `${base}icons/Осмотравто.svg`,
  },
  {
    title: "Безопасно",
    text: "Все комиссионные автомобили находятся на охраняемой стоянке.",
    icon: `${base}icons/защита.svg`,
  },
  {
    title: "Гарантированная оплата",
    text: "Деньги за автомобиль будут перечислены на счет в течение одного рабочего дня с момента оформления договора купли-продажи.",
    icon: `${base}icons/Гарантированнаяоплата.svg`,
  },
  {
    title: "Выгодно",
    text: "Возможность предоставления автокредита на выгодных условиях от наших банков партнеров.",
    icon: `${base}icons/Выгодно.svg`,
  },
];

/**
 * Блок «Преимущества выкупа» в формате оригинального дизайна.
 */
export function VykupBenefitsSection() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="vykup-benefits-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="vykup-benefits-title"
          className="mx-auto max-w-5xl text-center text-sm font-bold uppercase leading-snug tracking-[0.08em] text-neutral-900 sm:text-base md:text-lg lg:text-[1.7rem]"
        >
          Преимущества выкупа автомобиля для клиентов «ACT AUTO»
        </h2>

        <ul className="mt-12 grid list-none grid-cols-1 gap-8 md:mt-14 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
          {ITEMS.map((item) => (
            <li key={item.title} className="flex items-start gap-4 md:gap-5">
              <IconCircle>
                <IconImage src={item.icon} alt={item.title} />
              </IconCircle>
              <div>
                <h3 className="text-sm font-bold uppercase leading-tight text-neutral-900 md:text-base">{item.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-700">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
