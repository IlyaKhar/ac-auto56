import { ServiceOrderCartSection } from "./ServiceOrderCartSection.jsx";

export function MolyarnyjLeadFormSection() {
  return (
    <ServiceOrderCartSection
      anchorId="molyarnyj-lead-form"
      title="Корзина услуг малярно-кузовного цеха"
      subtitle="Выберите вид работ, количество деталей, дату/время записи и способ оплаты"
      messagePrefix="Заявка: малярно-кузовной цех ROSTOSH"
      mode="molyarn"
    />
  );
}
