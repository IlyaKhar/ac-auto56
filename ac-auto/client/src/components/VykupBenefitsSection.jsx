/**
 * Блок «Преимущества выкупа» на странице /page/vykup (сетка 2×3, круглые красные иконки).
 */

function IconCircle({ children }) {
  return (
    <div
      className="flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-t from-[#6b0f0f] to-[#c41230] shadow-sm md:h-16 md:w-16"
      aria-hidden
    >
      <span className="text-white [&_svg]:h-[1.65rem] [&_svg]:w-[1.65rem] md:[&_svg]:h-[1.85rem] md:[&_svg]:w-[1.85rem]">
        {children}
      </span>
    </div>
  );
}

function IconStopwatch() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="16" cy="17" r="8" />
      <path d="M16 17V13M20 9h-8M14 5h4M10 6l-2-2M22 6l2-2" />
      <path d="M5 10l-1.5-2M4 14H2M6 8L4.5 6" opacity="0.9" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h24v2H4v-2zM6 20l3-6h14l3 6" />
      <path d="M8 20v3M24 20v3" />
      <circle cx="10" cy="23" r="2" fill="currentColor" stroke="none" />
      <circle cx="22" cy="23" r="2" fill="currentColor" stroke="none" />
      <path d="M11 14h10l-1-2H12l-1 2z" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M10 4h8l6 6v18H10V4z" />
      <path d="M17 4v7h7M12 16h8M12 20h8M12 24h5" />
      <circle cx="22" cy="11" r="3.5" />
      <path d="M20.5 11h3" />
    </svg>
  );
}

function IconShieldLock() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l10 4v9c0 6-4 10-10 12-6-2-10-6-10-12V8l10-4z" />
      <rect x="12" y="14" width="8" height="7" rx="1" />
      <path d="M14 14v-2a2 2 0 0 1 4 0v2" />
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

function IconSaleBurst() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M16 2l2.2 4.5 5-.8-1.2 4.8 4.3 2.5-3.5 3.5 1 5-4.8 1.2-.8 5L16 26l-4.5 2.2-.8-5-4.8-1.2 1-5-3.5-3.5 2.5-4.3-1.2-4.8 5-.8L16 2z" />
      <path d="M12 16h8M16 12v8" strokeLinecap="round" />
    </svg>
  );
}

const ITEMS = [
  {
    title: "Экономия времени",
    text: "Вместо Вас поиском клиентов, размещением рекламы, демонстрацией авто, переговорами с покупателями и самой продажей будем заниматься мы.",
    icon: <IconStopwatch />,
  },
  {
    title: "Без ограничений",
    text: "Нет ограничений по марке, модели и году выпуска автомобиля.",
    icon: <IconCar />,
  },
  {
    title: "Юридическая чистота сделки",
    text: "Оформление сделки выполняется нашими юристами в полном соответствии с законодательством РФ.",
    icon: <IconDocument />,
  },
  {
    title: "Безопасно",
    text: "Все комиссионные автомобили находятся на охраняемой стоянке.",
    icon: <IconShieldLock />,
  },
  {
    title: "Гарантированная оплата",
    text: "Деньги за автомобиль будут перечислены на счет в течение одного рабочего дня с момента оформления договора купли-продажи.",
    icon: <IconMoneyBag />,
  },
  {
    title: "Выгодно",
    text: "Возможность предоставления автокредита на выгодных условиях от наших банков партнёров.",
    icon: <IconSaleBurst />,
  },
];

export function VykupBenefitsSection() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="vykup-benefits-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="vykup-benefits-title"
          className="mx-auto max-w-4xl text-center text-sm font-bold uppercase leading-snug tracking-[0.08em] text-neutral-900 sm:text-base md:text-lg lg:text-xl"
        >
          Преимущества выкупа автомобиля для клиентов «ACT AUTO»
        </h2>

        <ul className="mt-12 grid list-none grid-cols-1 gap-x-12 gap-y-10 md:mt-16 md:grid-cols-2 md:gap-x-16 md:gap-y-12">
          {ITEMS.map((it) => (
            <li key={it.title} className="flex gap-4 md:gap-5">
              <IconCircle>{it.icon}</IconCircle>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-sm font-bold uppercase leading-snug tracking-[0.05em] text-neutral-900 md:text-[0.95rem]">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-800 md:text-[0.9375rem]">{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
