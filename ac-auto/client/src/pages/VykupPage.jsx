import { useEffect, useState } from "react";
import { fetchSalonLocations } from "../api/publicApi.js";
import { OurServicesSection } from "../components/OurServicesSection.jsx";
import { SalonLocationsSection } from "../components/SalonLocationsSection.jsx";
import { VykupBenefitsSection } from "../components/VykupBenefitsSection.jsx";
import { VykupStepsSection } from "../components/VykupStepsSection.jsx";
import { VykupLeadFormSection } from "../components/VykupLeadFormSection.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
/** Фон героя из tilda-импорта. */
const heroBg = `${base}services/tild3163-3162-4737-a637-626431623861___1.jpg`;

/** tel: как у плавающего виджета — один источник в env. */
function mainTelHref() {
  const raw = (import.meta.env.VITE_FLOAT_TEL || "tel:+79619429992").trim();
  if (/^tel:/i.test(raw)) return raw;
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  return "tel:+79619429992";
}

/**
 * Лендинг «Выкуп» — герой как на макете: фото + затемнение, список «БЕЗ:», два CTA.
 */
export default function VykupPage() {
  const tel = mainTelHref();
  /** Адреса салона — тот же GET, что на главной */
  const [salonLocationsData, setSalonLocationsData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSalonLocations()
      .then((res) => {
        if (!cancelled) setSalonLocationsData(res ?? null);
      })
      .catch(() => {
        if (!cancelled) setSalonLocationsData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
    <div className="w-full bg-neutral-950">
      <section
        className="relative flex min-h-[calc(100svh-8rem)] w-full flex-col items-center justify-center px-4 py-16 md:min-h-[calc(100svh-6rem)] md:py-20"
        aria-labelledby="vykup-hero-title"
      >
        {/* Фон: cover + лёгкое затемнение для читаемости */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-black/60" aria-hidden />

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
          <h1
            id="vykup-hero-title"
            className="text-center text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
          >
            Выкупим ваш автомобиль по выгодной цене
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-center text-base font-medium text-white md:mt-6 md:text-lg md:leading-relaxed">
            Быстрый и надёжный способ продать свой автомобиль с помощью «ACT AUTO»!
          </p>

          {/* Блок списка: по центру экрана, текст строк — влево (как на макете) */}
          <div className="mx-auto mt-10 w-full max-w-lg text-left md:mt-12">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-white md:text-base">БЕЗ:</p>
            <ul className="mt-4 space-y-3 text-sm text-white md:text-base md:leading-relaxed">
              <li className="flex gap-2">
                <span className="shrink-0" aria-hidden>
                  •
                </span>
                <span>поиска покупателя;</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0" aria-hidden>
                  •
                </span>
                <span>затрат на предпродажную подготовку;</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0" aria-hidden>
                  •
                </span>
                <span>размещения рекламы.</span>
              </li>
            </ul>
          </div>

          <div className="mt-12 flex w-full max-w-3xl flex-col gap-4 sm:mt-14 sm:flex-row sm:justify-center sm:gap-5">
            <a
              href="#vykup-lead-form"
              className="inline-flex w-full items-center justify-center rounded-sm bg-ac-vykup-cta px-4 py-4 text-center text-xs font-bold uppercase leading-snug tracking-wide text-white shadow-lg transition hover:brightness-110 active:brightness-95 sm:w-auto sm:min-w-[16rem] sm:px-6 sm:text-sm"
            >
              Узнать стоимость моего автомобиля
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
    <VykupBenefitsSection />
    <VykupStepsSection />
    <VykupLeadFormSection />
    <OurServicesSection />
    <SalonLocationsSection data={salonLocationsData} />
    </>
  );
}
