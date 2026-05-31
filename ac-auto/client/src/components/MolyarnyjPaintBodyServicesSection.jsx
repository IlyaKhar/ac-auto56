import { RostoshServiceOrderCard } from "./RostoshServiceOrderCard.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

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
        <ul className="mt-10 grid list-none grid-cols-1 items-stretch gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-4 lg:gap-8">
          {ITEMS.map((item) => (
            <RostoshServiceOrderCard
              key={item.label}
              label={item.label}
              iconSrc={item.icon}
              orderHref={`/service-order?mode=molyarn&service=${encodeURIComponent(item.service)}#service-order-form`}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
