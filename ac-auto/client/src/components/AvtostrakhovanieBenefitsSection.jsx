const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

const ITEMS = [
  {
    key: "speed",
    title: "Скорость",
    text: "Оформление происходит быстро и без лишних документов. Мы с заботой относимся к драгоценному времени наших клиентов.",
    icon: `${base}icons/сКОРОСТЬ.svg`,
  },
  {
    key: "support",
    title: "Поддержка",
    text: "Ежедневно проводим бесплатные консультации по всем страховым вопросам наших клиентов и помогаем с их решением.",
    icon: `${base}icons/Оценкаавто.svg`,
  },
  {
    key: "benefit",
    title: "Удобство и выгода",
    text: "Всем клиентам предоставляем удобные системы оплаты и выгодные тарифы страхования.",
    icon: `${base}icons/Выгодно.svg`,
  },
  {
    key: "protect",
    title: "Защита",
    text: "Предоставляем нашим клиентам защиту от всевозможных рисков. Беспокоиться не о чем, если вы доверяете профессионалам.",
    icon: `${base}icons/защита.svg`,
  },
];

function IconCircle({ children }) {
  return (
    <div
      className="flex h-[6.2rem] w-[6.2rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e02020] via-[#c41230] to-[#5c0d0d] shadow-md md:h-[6.8rem] md:w-[6.8rem]"
      aria-hidden
    >
      <span className="text-white [&_svg]:h-[2.4rem] [&_svg]:w-[2.4rem] md:[&_svg]:h-[2.7rem] md:[&_svg]:w-[2.7rem]">
        {children}
      </span>
    </div>
  );
}

function IconImage({ src, alt }) {
  return <img src={src} alt={alt} className="h-[3.55rem] w-[3.55rem] object-contain md:h-[3.95rem] md:w-[3.95rem]" loading="lazy" decoding="async" />;
}

/**
 * Преимущества страхования в наших салонах.
 */
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

        <ul className="mt-10 grid list-none grid-cols-1 gap-x-14 gap-y-10 md:mt-14 md:grid-cols-2 md:gap-y-12">
          {ITEMS.map((it) => (
            <li key={it.key} className="flex items-start gap-4 md:gap-5">
              <IconCircle>
                <IconImage src={it.icon} alt={it.title} />
              </IconCircle>
              <div className="min-w-0 pt-2">
                <h3 className="text-sm font-bold uppercase leading-tight text-neutral-900 md:text-base">
                  {it.title}
                </h3>
                <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-700 md:text-[0.9375rem]">
                  {it.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
