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
  { label: "3-фазная мойка", icon: `${base}icons/3-фазнаямойка.svg`, service: "full_wash" },
  { label: "2-фазная мойка", icon: `${base}icons/3-фазнаямойка.svg`, service: "body_wash" },
  { label: "Химчистка салона", icon: `${base}icons/Химчистка.svg`, service: "detailing" },
  { label: "Озонирование салона", icon: `${base}icons/Озонированиесалона.svg`, service: "detailing" },
  { label: "Полировка кузова", icon: `${base}icons/Нанесениезащитных.svg`, service: "detailing" },
  { label: "Нанесение защитных составов", icon: `${base}icons/Нанесениезащитных.svg`, service: "detailing" },
];

/**
 * Услуги автомойки и детейлинга.
 */
export function RostoshCarwashServicesSection() {
  return (
    <section className="bg-neutral-100 py-14 md:py-20" aria-labelledby="rostosh-carwash-services-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="rostosh-carwash-services-title"
          className="mx-auto max-w-4xl text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg lg:text-[2rem]"
        >
          Услуги автомойки и детейлинг-сервиса «ROSTOSH»
        </h2>
        <ul className="mt-10 grid list-none grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 md:mt-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-12">
          {ITEMS.map((item) => (
            <li key={item.label} className="text-center">
              <IconCircle>
                <IconImage src={item.icon} alt={item.label} />
              </IconCircle>
              <h3 className="mx-auto mt-4 max-w-[14rem] text-[1.35rem] font-bold leading-tight text-neutral-900 md:text-[1.55rem]">
                {item.label}
              </h3>
              <Link
                to={`/service-order?mode=carwash&service=${encodeURIComponent(item.service)}`}
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
