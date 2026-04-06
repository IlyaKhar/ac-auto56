import { useEffect, useState } from "react";
import { fetchHomeMedia, fetchSalonLocations } from "../api/publicApi.js";
import { AvtostrakhovanieBenefitsSection } from "../components/AvtostrakhovanieBenefitsSection.jsx";
import { CallbackLeadFormSection } from "../components/CallbackLeadFormSection.jsx";
import { InsuranceServiceRequestModal } from "../components/InsuranceServiceRequestModal.jsx";
import { InsuranceServicesGridSection } from "../components/InsuranceServicesGridSection.jsx";
import { OurServicesSection } from "../components/OurServicesSection.jsx";
import { PartnerInsuranceSection } from "../components/PartnerBanksSection.jsx";
import { SalonLocationsSection } from "../components/SalonLocationsSection.jsx";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
const heroBg = `${base}services/tild3439-3761-4664-b431-643636613161___1.jpg`;

function mainTelHref() {
  const raw = (import.meta.env.VITE_FLOAT_TEL || "tel:+79619429992").trim();
  if (/^tel:/i.test(raw)) return raw;
  const d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  return "tel:+79619429992";
}

/** Лендинг «Автострахование»: герой, партнёры, услуги + модалка, преимущества, форма, услуги, адреса. */
export default function AvtostrakhovaniePage() {
  const tel = mainTelHref();
  const [salonLocationsData, setSalonLocationsData] = useState(null);
  const [homeMedia, setHomeMedia] = useState(null);
  const [insuranceModal, setInsuranceModal] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchSalonLocations()
      .then((res) => {
        if (!cancelled) setSalonLocationsData(res ?? null);
      })
      .catch(() => {
        if (!cancelled) setSalonLocationsData(null);
      });
    fetchHomeMedia()
      .then((res) => {
        if (!cancelled) setHomeMedia(res ?? null);
      })
      .catch(() => {
        if (!cancelled) setHomeMedia(null);
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
          aria-labelledby="avtostrakh-hero-title"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroBg})` }}
          />
          <div className="absolute inset-0 bg-black/60" aria-hidden />

          <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center">
            <h1
              id="avtostrakh-hero-title"
              className="text-center text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            >
              Все услуги страхования от «ACT AUTO»
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-center text-base font-medium text-white md:mt-6 md:text-lg md:leading-relaxed">
              Не переживайте о возможных технических неполадках и в полную меру наслаждайтесь вождением. Страховой полис
              автомобиля (КАСКО, ОСАГО) даст гарантию, что даже в случае ДТП, денежные затраты не нанесут «удар» по вашим
              финансам.
            </p>

            <div className="mt-12 flex w-full max-w-3xl flex-col gap-4 sm:mt-14 sm:flex-row sm:justify-center sm:gap-5">
              <a
                href="#avtostrakh-lead-form"
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

      <PartnerInsuranceSection />
      <InsuranceServicesGridSection
        onRequest={setInsuranceModal}
        adminImages={Array.isArray(homeMedia?.insurance_services) ? homeMedia.insurance_services : []}
      />
      <InsuranceServiceRequestModal context={insuranceModal} onClose={() => setInsuranceModal(null)} />
      <AvtostrakhovanieBenefitsSection />
      <CallbackLeadFormSection
        anchorId="avtostrakh-lead-form"
        title="Хотите воспользоваться услугой и выгодно застраховаться?"
        subtitle="Заполните форму ниже и наш специалист свяжется с вами в ближайшее время для уточнения деталей"
        messagePrefix="Заявка: автострахование"
        cityVariant="two"
      />
      <OurServicesSection />
      <SalonLocationsSection data={salonLocationsData} />
    </>
  );
}
