import { CarTradeLeadFormSection } from "./CarTradeLeadFormSection.jsx";

/** Форма заявки на выкуп — тот же каркас, что trade-in, свои тексты и якорь. */
export function VykupLeadFormSection() {
  return (
    <CarTradeLeadFormSection
      anchorId="vykup-lead-form"
      title="Хотите воспользоваться услугой и выгодно продать свой автомобиль?"
      subtitle="Заполните форму ниже и наш специалист свяжется с вами в ближайшее время для уточнения деталей"
      messagePrefix="Страница «Выкуп» — форма выкупа."
    />
  );
}
