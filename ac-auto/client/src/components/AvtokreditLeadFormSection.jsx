import { CallbackLeadFormSection } from "./CallbackLeadFormSection.jsx";

/** Форма заявки на автокредит — общий компонент с двумя вариантами города. */
export function AvtokreditLeadFormSection({ anchorId = "avtokredit-lead-form" }) {
  return (
    <CallbackLeadFormSection
      anchorId={anchorId}
      title="Хотите воспользоваться услугой и выгодно купить автомобиль?"
      subtitle="Заполните форму ниже и наш специалист свяжется с вами в ближайшее время для уточнения деталей"
      messagePrefix="Заявка: автокредитование"
      cityVariant="two"
    />
  );
}
