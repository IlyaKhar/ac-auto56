/**
 * Сетка услуг автотехцентра ROSTOSH на /page/avtoservis (3×3, красные круги + иконки).
 */

function IconCircle({ children }) {
  return (
    <div
      className="mx-auto flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-gradient-to-b from-[#e02020] to-[#7a0f0f] shadow-md md:h-[4.5rem] md:w-[4.5rem]"
      aria-hidden
    >
      <span className="text-white [&_svg]:h-[1.75rem] [&_svg]:w-[1.75rem] md:[&_svg]:h-[2rem] md:[&_svg]:w-[2rem]">
        {children}
      </span>
    </div>
  );
}

function IconTire() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="5" />
      <path d="M16 5v4M16 23v4M5 16h4M23 16h4M8.5 8.5l2.8 2.8M20.7 20.7l2.8 2.8M8.5 23.5l2.8-2.8M20.7 11.3l2.8-2.8" strokeLinecap="round" />
    </svg>
  );
}

function IconCarPrep() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 20h22v2H5v-2zM7 20l2.5-5h13l2.5 5" />
      <path d="M9 20v2M23 20v2" />
      <circle cx="12" cy="23" r="2" fill="currentColor" stroke="none" />
      <circle cx="20" cy="23" r="2" fill="currentColor" stroke="none" />
      <path d="M11 15h10l-1-2H12l-1 2z" />
      <path d="M16 8v4M14 10h4" />
    </svg>
  );
}

function IconOil() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6h8l-1 4h-6l-1-4zM11 10h10l-2 18H13L11 10z" />
      <path d="M16 14v8" />
    </svg>
  );
}

function IconGearShift() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="5" width="20" height="22" rx="2" />
      <circle cx="11" cy="10" r="2" />
      <circle cx="21" cy="10" r="2" />
      <circle cx="11" cy="16" r="2" />
      <circle cx="21" cy="16" r="2" />
      <circle cx="16" cy="22" r="2" />
      <path d="M11 12v2M21 12v2M11 18h10M16 18v4" />
    </svg>
  );
}

function IconBattery() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="10" width="18" height="14" rx="2" />
      <path d="M11 10V8h10v2" />
      {/* Плюс и минус на корпусе — узнаваемый знак АКБ */}
      <path d="M12.5 17h3M14 15.5v3M19 17h4" />
    </svg>
  );
}

function IconEngine() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 18h4v6H8v-6zM20 16h4v8h-4v-8zM12 14h8v10h-8V14z" />
      <path d="M14 14V10h4v4M16 10V8" />
      <path d="M10 18H8M24 20h2" />
    </svg>
  );
}

function IconSnowflake() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M16 4v24M4 16h24M7 7l18 18M25 7L7 25" />
      <path d="M11 9l2 2M19 9l-2 2M11 23l2-2M19 23l-2-2M9 16h2M21 16h2" />
    </svg>
  );
}

function IconChassis() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14h24v4H4v-4zM8 18v4M24 18v4" />
      <circle cx="10" cy="24" r="3" />
      <circle cx="22" cy="24" r="3" />
      <path d="M10 14V10h12v4" />
    </svg>
  );
}

function IconStarterGen() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M16 4a12 12 0 1 1 0 24 12 12 0 0 1 0-24z" />
      <path d="M16 10v12M12 14h8M12 18h6" />
      <path d="M22 8l2-2M24 6l2 2" strokeWidth="1.2" />
    </svg>
  );
}

const ITEMS = [
  { label: "Дошиповка, правка дисков, шиномонтаж", icon: <IconTire /> },
  { label: "Предпродажная подготовка автомобиля", icon: <IconCarPrep /> },
  { label: "Техническое обслуживание", icon: <IconOil /> },
  { label: "Ремонт КПП", icon: <IconGearShift /> },
  { label: "Ремонт электрики", icon: <IconBattery /> },
  { label: "Ремонт ДВС", icon: <IconEngine /> },
  { label: "Заправка автокондиционеров", icon: <IconSnowflake /> },
  { label: "Ремонт ходовой части автомобиля", icon: <IconChassis /> },
  { label: "Ремонт стартеров / генераторов", icon: <IconStarterGen /> },
];

export function RostoshServicesSection() {
  return (
    <section className="bg-neutral-100 py-14 md:py-20" aria-labelledby="rostosh-services-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="rostosh-services-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Услуги сервиса «ROSTOSH»
        </h2>

        <ul className="mt-10 grid list-none grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-12 lg:grid-cols-3 lg:gap-x-10">
          {ITEMS.map((it) => (
            <li key={it.label} className="flex flex-col items-center text-center">
              <IconCircle>{it.icon}</IconCircle>
              <p className="mt-4 max-w-[16rem] text-sm font-bold leading-snug text-neutral-900 md:text-[0.9375rem]">
                {it.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
