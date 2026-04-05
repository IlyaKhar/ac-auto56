/**
 * Преимущества страхования в салонах — светлый фон, красные круги с иконками (как комиссионка).
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

function IconSupport() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="12" r="4" />
      <path d="M5 26v-2a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v2" />
      <path d="M20 8h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4" />
      <path d="M23 11v4M23 17v0.5" />
    </svg>
  );
}

function IconMoney() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 10h14l-2 14H8L10 10z" />
      <path d="M16 14v6M14 17h4" />
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

const ITEMS = [
  {
    key: "speed",
    title: "Скорость",
    text: "Оформление происходит быстро и без лишних документов. Мы с заботой относимся к драгоценному времени наших клиентов.",
    icon: <IconStopwatch />,
  },
  {
    key: "support",
    title: "Поддержка",
    text: "Ежедневно проводим бесплатные консультации по всем страховым вопросам наших клиентов и помогаем с их решением.",
    icon: <IconSupport />,
  },
  {
    key: "benefit",
    title: "Удобство и выгода",
    text: "Всем клиентам предоставляем удобные системы оплаты и выгодные тарифы страхования.",
    icon: <IconMoney />,
  },
  {
    key: "protect",
    title: "Защита",
    text: "Предоставляем нашим клиентам защиту от всевозможных рисков. Беспокоиться не о чем, если вы доверяете профессионалам.",
    icon: <IconShieldLock />,
  },
];

export function AvtostrakhovanieBenefitsSection() {
  return (
    <section className="bg-white py-14 md:py-20" aria-labelledby="avtostrakh-benefits-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="avtostrakh-benefits-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Преимущества страхования в наших салонах
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
