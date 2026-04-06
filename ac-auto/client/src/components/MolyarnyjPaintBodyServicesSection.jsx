const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

function IconCircle({ children }) {
  return (
    <div
      className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-[#e02020] via-[#c41230] to-[#5c0d0d] shadow-md md:h-[5rem] md:w-[5rem]"
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
  { label: "Дефектовка", icon: `${base}icons/Оценкаавто.svg` },
  { label: "Малярно-кузовные работы", icon: `${base}icons/Малярно-кузовные аботы.svg` },
  { label: "Стапель", icon: `${base}icons/Стапель.svg` },
  { label: "Полировка", icon: `${base}icons/Нанесениезащитных.svg` },
];

/**
 * Услуги малярно-кузовного цеха.
 */
export function MolyarnyjPaintBodyServicesSection() {
  return (
    <section className="bg-neutral-100 py-14 md:py-20" aria-labelledby="molyarnyj-services-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="molyarnyj-services-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg lg:text-[2rem]"
        >
          Услуги малярно-кузовного цеха «ROSTOSH»
        </h2>
        <ul className="mt-10 grid list-none grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 md:mt-12 lg:grid-cols-4 lg:gap-x-10">
          {ITEMS.map((item) => (
            <li key={item.label} className="text-center">
              <IconCircle>
                <IconImage src={item.icon} alt={item.label} />
              </IconCircle>
              <h3 className="mx-auto mt-4 max-w-[11rem] text-[1.35rem] font-bold leading-tight text-neutral-900 md:text-[1.55rem]">
                {item.label}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
