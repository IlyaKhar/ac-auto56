import { ActAutoSingleAddressSection } from "../components/ActAutoSingleAddressSection.jsx";
import { OurServicesSection } from "../components/OurServicesSection.jsx";
import { RostoshFindUsSection } from "../components/RostoshFindUsSection.jsx";
import { RostoshServicesSection } from "../components/RostoshServicesSection.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
/** Фон: public/services/avtoservis.jpg */
const heroBg = `${base}services/avtoservis.jpg`;

function mainTelHref() {
  const raw = (import.meta.env.VITE_FLOAT_TEL || "tel:+79619429992").trim();
  if (/^tel:/i.test(raw)) return raw;
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  return "tel:+79619429992";
}

/**
 * Лендинг автосервиса /page/avtoservis — герой ROSTOSH.
 */
export default function AvtoservisPage() {
  const tel = mainTelHref();

  return (
    <>
      <div className="w-full bg-neutral-950">
        <section
          className="relative flex min-h-[calc(100svh-8rem)] w-full flex-col items-center justify-center px-4 py-16 md:min-h-[calc(100svh-6rem)] md:py-20"
          aria-labelledby="avtoservis-hero-title"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <h1
              id="avtoservis-hero-title"
              className="text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl lg:text-[2.5rem] lg:leading-tight"
            >
              Автотехцентр «ROSTOSH» — с заботой о вашем автомобиле!
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base font-normal text-white/95 md:mt-6 md:text-lg md:leading-relaxed">
              Уточнить стоимость услуг и записаться
            </p>

            <a
              href={tel}
              className="mt-10 inline-flex w-full max-w-[14rem] items-center justify-center rounded-sm bg-ac-vykup-lime px-8 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-neutral-900 shadow-lg transition hover:brightness-105 active:brightness-95 sm:mt-12 sm:text-sm"
            >
              Позвонить
            </a>
          </div>
        </section>
      </div>
      <RostoshServicesSection />
      <RostoshFindUsSection />
      <OurServicesSection />
      <ActAutoSingleAddressSection />
    </>
  );
}
