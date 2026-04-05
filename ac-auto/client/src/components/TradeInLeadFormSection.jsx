import { CarTradeLeadFormSection } from "./CarTradeLeadFormSection.jsx";

/** Форма Trade-In под блоком этапов. */
export function TradeInLeadFormSection() {
  return (
    <CarTradeLeadFormSection
      anchorId="trade-in-lead-form"
      title="Хотите воспользоваться услугой и выгодно сменить автомобиль?"
      subtitle="Заполните форму ниже и наш специалист свяжется с вами в ближайшее время для уточнения деталей"
      messagePrefix="Страница Trade-In — форма смены автомобиля."
    />
  );
}
