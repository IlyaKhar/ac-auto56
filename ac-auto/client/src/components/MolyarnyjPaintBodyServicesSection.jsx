import { Link } from "react-router-dom";
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
  { label: "Дефектовка", icon: `${base}icons/Оценкаавто.svg`, service: "local_repair" },
  { label: "Малярно-кузовные работы", icon: `${base}icons/Малярно-кузовные аботы.svg`, service: "paint" },
  { label: "Стапель", icon: `${base}icons/Стапель.svg`, service: "local_repair" },
  { label: "Полировка", icon: `${base}icons/Нанесениезащитных.svg`, service: "polish" },
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
              <Link
                to={`/service-order?mode=molyarn&service=${encodeURIComponent(item.service)}`}
                className="mt-4 inline-flex rounded bg-ac-vykup-cta px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:brightness-110"
              >
                В корзину
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
