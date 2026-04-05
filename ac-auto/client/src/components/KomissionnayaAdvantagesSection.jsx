/**
 * Блок «Преимущества комиссионной продажи» — сетка 2×3, красные круги с иконками.
 */

function IconCircle({ children }) {
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#e02020] to-[#7a0f0f] shadow-md md:h-16 md:w-16"
      aria-hidden
    >
      <span className="text-white [&_svg]:h-7 [&_svg]:w-7 md:[&_svg]:h-8 md:[&_svg]:w-8">{children}</span>
    </div>
  );
}

function IconStopwatch() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="16" cy="18" r="9" />
      <path d="M16 18V14M13 5h6M16 5v3" />
      <path d="M22 8l2 2M6 22l3-3" opacity="0.8" />
    </svg>
  );
}

function IconStars() {
  const d =
    "M16 2l3.7 7.5L28 10l-6 5.8L24 28l-8-4.2L8 28l2-12.2L4 10l8.3-0.5L16 2z";
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden>
      <path transform="translate(1,12) scale(0.22)" d={d} />
      <path transform="translate(11,8) scale(0.28)" d={d} />
      <path transform="translate(21,12) scale(0.22)" d={d} />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 24c8-12 20-14 22-18-4 2-10 14-22 18z" />
      <path d="M10 20c4-2 8-6 12-12" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 20h20l-2-8H8L6 20zM8 20v2M24 20v2" />
      <circle cx="11" cy="23" r="2" fill="currentColor" stroke="none" />
      <circle cx="21" cy="23" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconShieldLock() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4l10 4v8c0 6-4 11-10 12-6-1-10-6-10-12V8l10-4z" />
      <rect x="12" y="14" width="8" height="7" rx="1" />
      <path d="M16 17v3" />
    </svg>
  );
}

function IconPercent() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M8 6l16 20M11 12a2 2 0 1 0 0-0.01M21 22a2 2 0 1 0 0-0.01" />
      <path d="M6 26l4-4M22 10l4-4" />
    </svg>
  );
}

const ITEMS = [
  {
    key: "fast",
    title: "Удобно и быстро",
    text: "Мы берем на себя обязанности по поиску клиентов, размещению рекламы в СМИ, а также ведем переговоры с потенциальными покупателями.",
    icon: <IconStopwatch />,
  },
  {
    key: "pro",
    title: "Профессионально",
    text: "Продажей Вашего автомобиля занимаются профессионалы.",
    icon: <IconStars />,
  },
  {
    key: "eco",
    title: "Экономично",
    text: "Бесплатная мойка и небольшая комиссия.",
    icon: <IconLeaf />,
  },
  {
    key: "free",
    title: "Без ограничений",
    text: "Нет ограничений по марке, модели и году выпуска автомобиля.",
    icon: <IconCar />,
  },
  {
    key: "safe",
    title: "Безопасно",
    text: "Все комиссионные автомобили находятся на охраняемой стоянке.",
    icon: <IconShieldLock />,
  },
  {
    key: "profit",
    title: "Выгодно",
    text: "Возможность предоставления кредита.",
    icon: <IconPercent />,
  },
];

export function KomissionnayaAdvantagesSection() {
  return (
    <section
      className="border-b-4 border-[#c41230] bg-neutral-100 py-14 md:py-20"
      aria-labelledby="komissiya-adv-title"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="komissiya-adv-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Преимущества комиссионной продажи
        </h2>

        <ul className="mt-10 grid list-none grid-cols-1 gap-10 md:mt-14 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
          {ITEMS.map((it) => (
            <li key={it.key} className="flex gap-4 md:gap-5">
              <IconCircle>{it.icon}</IconCircle>
              <div className="min-w-0">
                <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900 md:text-base">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-800 md:text-[0.9375rem]">{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
