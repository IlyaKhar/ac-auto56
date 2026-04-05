import { ActAutoSingleAddressSection } from "../components/ActAutoSingleAddressSection.jsx";
import { CarTradeLeadFormSection } from "../components/CarTradeLeadFormSection.jsx";
import { KomissionnayaAdvantagesSection } from "../components/KomissionnayaAdvantagesSection.jsx";
import { KomissionnayaStagesSection } from "../components/KomissionnayaStagesSection.jsx";
import { OurServicesSection } from "../components/OurServicesSection.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
/** Фон героя: public/services/komissionnaya-prodazha.jpg */
const heroBg = `${base}services/komissionnaya-prodazha.jpg`;

/** tel: как у плавающего виджета — один источник в env. */
function mainTelHref() {
  const raw = (import.meta.env.VITE_FLOAT_TEL || "tel:+79619429992").trim();
  if (/^tel:/i.test(raw)) return raw;
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  return "tel:+79619429992";
}

/**
 * Лендинг «Комиссионная продажа» — герой, преимущества, этапы, форма, услуги, один адрес.
 */
export default function KomissionnayaProdazhaPage() {
  const tel = mainTelHref();

  return (
    <>
      <div className="w-full bg-neutral-950">
        <section
          className="relative flex min-h-[calc(100svh-8rem)] w-full flex-col items-center justify-center px-4 py-16 md:min-h-[calc(100svh-6rem)] md:py-20"
          aria-labelledby="komissiya-hero-title"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
            <h1
              id="komissiya-hero-title"
              className="text-center text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              Прием автомобиля на комиссию — бесплатно
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-center text-base font-medium text-white md:mt-6 md:text-lg md:leading-relaxed">
              Комиссионная продажа автомобиля — это оптимальный и удобный способ выгодно и безопасно продать свой
              автомобиль, сэкономив собственные деньги и время!
            </p>

            <div className="mt-12 flex w-full max-w-3xl flex-col gap-4 sm:mt-14 sm:flex-row sm:justify-center sm:gap-5">
              <a
                href="#komissiya-lead-form"
                className="inline-flex w-full items-center justify-center rounded-sm bg-ac-vykup-cta px-4 py-4 text-center text-xs font-bold uppercase leading-snug tracking-wide text-white shadow-lg transition hover:brightness-110 active:brightness-95 sm:w-auto sm:min-w-[16rem] sm:px-6 sm:text-sm"
              >
                Оставить заявку
              </a>
              <a
                href={tel}
                className="w-full rounded-sm bg-ac-vykup-lime px-4 py-4 text-center text-xs font-bold uppercase leading-snug tracking-wide text-neutral-900 shadow-lg transition hover:brightness-105 active:brightness-95 sm:w-auto sm:min-w-[12rem] sm:px-6 sm:text-sm"
              >
                Позвонить
              </a>
            </div>
          </div>
        </section>
      </div>
      <KomissionnayaAdvantagesSection />
      <KomissionnayaStagesSection />
      <CarTradeLeadFormSection
        anchorId="komissiya-lead-form"
        title="Хотите воспользоваться услугой и выгодно продать свой автомобиль?"
        subtitle="Заполните форму ниже и наш специалист свяжется с вами в ближайшее время для уточнения деталей"
        messagePrefix="Заявка: комиссионная продажа автомобиля"
      />
      <OurServicesSection />
      <ActAutoSingleAddressSection />
    </>
  );
}
