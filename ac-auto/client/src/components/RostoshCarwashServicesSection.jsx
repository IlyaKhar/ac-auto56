/**
 * 6 услуг автомойки / детейлинга ROSTOSH (/rostosh_carwash).
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

function IconCarDrops({ drops }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20h16l-1-6H9l-1 6zM10 14l1-3h10l1 3" />
      <path d="M13 24h6" />
      {drops >= 3 ? (
        <>
          <path d="M10 6v2M16 4v4M22 6v2" />
        </>
      ) : (
        <>
          <path d="M12 5v3M20 5v3" />
        </>
      )}
    </svg>
  );
}

function IconSprayBottle() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 6h4v3h-4V6zM12 9h8l-1 14H13L12 9z" />
      <path d="M16 13v6" />
      <path d="M18 4h2v2h-2" />
    </svg>
  );
}

function IconOzone() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 18c2-4 6-6 8-6s6 2 8 6" />
      <path d="M10 22c1.5-2 4-3.5 6-3.5s4.5 1.5 6 3.5" />
      <circle cx="16" cy="14" r="2" />
    </svg>
  );
}

function IconPolishBody() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 22c0-3 2.5-6 6-6s6 3 6 6" />
      <path d="M14 12l-2 4M18 10l2 5" />
      <circle cx="12" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="20" cy="8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconCoating() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 10h6l-1 12H9L8 10zM18 8h6l-1 14h-4l-1-14z" />
      <path d="M22 6v2" />
      <path d="M14 24h10" />
    </svg>
  );
}

const ITEMS = [
  { key: "w3", label: "3-фазная мойка", icon: <IconCarDrops drops={3} /> },
  { key: "w2", label: "2-фазная мойка", icon: <IconCarDrops drops={2} /> },
  { key: "chem", label: "Химчистка салона", icon: <IconSprayBottle /> },
  { key: "ozone", label: "Озонирование салона", icon: <IconOzone /> },
  { key: "polish", label: "Полировка кузова", icon: <IconPolishBody /> },
  { key: "coat", label: "Нанесение защитных составов", icon: <IconCoating /> },
];

export function RostoshCarwashServicesSection() {
  return (
    <section className="bg-neutral-100 py-14 md:py-20" aria-labelledby="rostosh-carwash-services-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="rostosh-carwash-services-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          Услуги автомойки и детейлинг-сервиса «ROSTOSH»
        </h2>

        <ul className="mt-10 grid list-none grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-12 lg:grid-cols-3 lg:gap-x-10">
          {ITEMS.map((it) => (
            <li key={it.key} className="flex flex-col items-center text-center">
              <IconCircle>{it.icon}</IconCircle>
              <p className="mt-4 max-w-[15rem] text-sm font-bold leading-snug text-neutral-900 md:text-[0.9375rem]">
                {it.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
