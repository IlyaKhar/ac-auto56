/**
 * 4 услуги малярно-кузовного цеха ROSTOSH (/page/molyarnyj-ceh).
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

function IconDefectovka() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22h16l-1.5-8H9.5L8 22zM10 14l1-4h10l1 4" />
      <path d="M12 26h8M14 10V8h4v2" />
      <path d="M16 4v3M13 5.5h6" />
      <path d="M16 6l-3 4M16 6l3 4" />
    </svg>
  );
}

function IconSprayGun() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8l2-4H8l-2 4zM14 18v6M12 24h4" />
      <path d="M16 14l10-2v4l-10-2" />
      <path d="M26 12v6" />
      <path d="M4 16l2 2M4 20l2-2M2 18h2" />
    </svg>
  );
}

function IconStapely() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 8v18M10 8h14M10 14h10" />
      <path d="M20 8v6" />
    </svg>
  );
}

function IconPolish() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="11" cy="12" r="3" />
      <circle cx="20" cy="10" r="2.5" />
      <circle cx="17" cy="18" r="2" />
      <path d="M14 22c2 2 5 2 7 0" />
    </svg>
  );
}

const ITEMS = [
  { key: "defect", label: "Дефектовка", icon: <IconDefectovka /> },
  {
    key: "paint",
    label: (
      <>
        Малярно-
        <br />
        кузовные работы
      </>
    ),
    icon: <IconSprayGun />,
  },
  { key: "stapely", label: "Стапель", icon: <IconStapely /> },
  { key: "polish", label: "Полировка", icon: <IconPolish /> },
];

export function MolyarnyjPaintBodyServicesSection() {
  return (
    <section className="bg-neutral-100 py-14 md:py-20" aria-labelledby="molyarnyj-services-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="molyarnyj-services-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Услуги малярно-кузовного цеха «ROSTOSH»
        </h2>

        <ul className="mt-10 grid list-none grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 lg:mt-12 lg:grid-cols-4 lg:gap-x-6">
          {ITEMS.map((it) => (
            <li key={it.key} className="flex flex-col items-center text-center">
              <IconCircle>{it.icon}</IconCircle>
              <p className="mt-4 max-w-[14rem] text-sm font-bold leading-snug text-neutral-900 md:text-[0.9375rem]">
                {it.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
