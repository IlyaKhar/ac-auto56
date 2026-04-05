import { useEffect, useState } from "react";
import { fetchSalonLocations } from "../api/publicApi.js";
import { AvtokreditLeadFormSection } from "../components/AvtokreditLeadFormSection.jsx";
import { AvtokreditStagesSection } from "../components/AvtokreditStagesSection.jsx";
import { OurServicesSection } from "../components/OurServicesSection.jsx";
import { PartnerBanksSection } from "../components/PartnerBanksSection.jsx";
import { SalonLocationsSection } from "../components/SalonLocationsSection.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
const heroBg = `${base}services/avtokreditovanie.jpg`;

function mainTelHref() {
  const raw = (import.meta.env.VITE_FLOAT_TEL || "tel:+79619429992").trim();
  if (/^tel:/i.test(raw)) return raw;
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  return "tel:+79619429992";
}

/** Лендинг «Автокредитование»: герой, партнёры (слайдер как на главной), этапы, форма, услуги, адреса. */
export default function AvtokreditovaniePage() {
  const tel = mainTelHref();
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
          aria-labelledby="avtokredit-hero-title"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
            <h1
              id="avtokredit-hero-title"
              className="text-center text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              Автокредит от «ACT AUTO»
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-center text-base font-medium text-white md:mt-6 md:text-lg md:leading-relaxed">
              <span className="block">Сейчас — лучшее время для реализации своей автомобильной мечты!</span>
              <span className="mt-2 block">
                Воспользуйтесь услугами автокредитования на лучших для вас условиях.
              </span>
            </p>

            <div className="mt-12 flex w-full max-w-3xl flex-col gap-4 sm:mt-14 sm:flex-row sm:justify-center sm:gap-5">
              <a
                href="#avtokredit-lead-form"
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

      <PartnerBanksSection title='Партнёры «ACT AUTO» в автокредитовании' />
      <AvtokreditStagesSection />
      <AvtokreditLeadFormSection />
      <OurServicesSection />
      <SalonLocationsSection data={salonLocationsData} />
    </>
  );
}
