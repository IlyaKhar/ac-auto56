import { ActAutoSingleAddressSection } from "../components/ActAutoSingleAddressSection.jsx";
import { MolyarnyjFindUsSection } from "../components/MolyarnyjFindUsSection.jsx";
import { MolyarnyjLeadFormSection } from "../components/MolyarnyjLeadFormSection.jsx";
import { MolyarnyjPaintBodyServicesSection } from "../components/MolyarnyjPaintBodyServicesSection.jsx";
import { OurServicesSection } from "../components/OurServicesSection.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
/** Фон: public/services/molyarnyj-ceh.jpg (или .png) — как в карточке услуги */
const heroBg = `${base}services/molyarnyj-ceh.jpg`;

function mainTelHref() {
  const raw = (import.meta.env.VITE_FLOAT_TEL || "tel:+79619429992").trim();
  if (/^tel:/i.test(raw)) return raw;
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  return "tel:+79619429992";
}

/**
 * Лендинг малярно-кузовного цеха /page/molyarnyj-ceh.
 */
export default function MolyarnyjCehPage() {
  const tel = mainTelHref();

  return (
    <>
      <div className="w-full bg-neutral-950">
        <section
          className="relative flex min-h-[calc(100svh-8rem)] w-full flex-col items-center justify-center px-4 py-16 md:min-h-[calc(100svh-6rem)] md:py-20"
          aria-labelledby="molyarnyj-hero-title"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <h1
              id="molyarnyj-hero-title"
              className="text-2xl font-bold leading-snug text-white sm:text-3xl md:text-4xl lg:text-[2.5rem] lg:leading-tight"
            >
              Малярно-кузовной цех «ROSTOSH»
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base font-normal text-white/95 md:mt-6 md:text-lg md:leading-relaxed">
              Уточнить стоимость услуг и записаться
            </p>

            <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-center">
              <a
                href="#molyarnyj-lead-form"
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-sm bg-[#e02020] px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-white shadow-lg transition hover:brightness-110 active:brightness-95 sm:text-sm"
              >
                Оставить заявку
              </a>
              <a
                href={tel}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-sm bg-ac-vykup-lime px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-neutral-900 shadow-lg transition hover:brightness-105 active:brightness-95 sm:text-sm"
              >
                Позвонить
              </a>
            </div>
          </div>
        </section>
      </div>
      <MolyarnyjPaintBodyServicesSection />
      <MolyarnyjLeadFormSection />
      <MolyarnyjFindUsSection />
      <OurServicesSection />
      <ActAutoSingleAddressSection />
    </>
  );
}
