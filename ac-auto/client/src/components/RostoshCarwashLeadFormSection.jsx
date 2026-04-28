import { ServiceOrderCartSection } from "./ServiceOrderCartSection.jsx";

export function RostoshCarwashLeadFormSection() {
  return (
    <ServiceOrderCartSection
      anchorId="rostosh-carwash-lead-form"
      title="Корзина услуг автомойки и детейлинга"
      subtitle="Выберите услугу, параметры, способ оплаты и удобные дату/время записи"
      messagePrefix="Заявка: автомойка и детейлинг ROSTOSH"
      mode="carwash"
    />
  );
}
