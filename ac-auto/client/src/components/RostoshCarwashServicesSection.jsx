import { RostoshServiceOrderCard } from "./RostoshServiceOrderCard.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

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
        <ul className="mt-10 grid list-none grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3 lg:gap-8">
          {ITEMS.map((item) => (
            <RostoshServiceOrderCard
              key={item.label}
              label={item.label}
              iconSrc={item.icon}
              orderHref={`/service-order?mode=carwash&service=${encodeURIComponent(item.service)}#service-order-form`}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
