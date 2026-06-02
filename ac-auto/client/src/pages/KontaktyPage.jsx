import { useEffect, useState } from "react";
import { fetchSalonLocations } from "../api/publicApi.js";
import { CallbackLeadFormSection } from "../components/CallbackLeadFormSection.jsx";
import { KontaktyFaqSection } from "../components/KontaktyFaqSection.jsx";
import { SalonLocationsSection } from "../components/SalonLocationsSection.jsx";

/** Страница контактов /page/kontakty */
export default function KontaktyPage() {
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
      <div
        id="kontakty-hero"
        className="flex min-h-[min(50vh,28rem)] flex-col items-center justify-center bg-neutral-950 px-4 py-16 text-center text-white md:py-24"
      >
        <h1 className="text-2xl font-bold uppercase tracking-wide md:text-4xl">Контакты</h1>
        <p className="mt-4 max-w-xl text-sm text-white/90 md:text-base">
          Адреса салонов, телефоны и форма обратной связи
        </p>
      </div>

      <section id="kontakty-info" className="bg-white py-4 md:py-6" aria-labelledby="kontakty-info-title">
        <h2 id="kontakty-info-title" className="sr-only">
          Контактная информация
        </h2>
        <SalonLocationsSection data={salonLocationsData} />
      </section>

      <CallbackLeadFormSection
        anchorId="kontakty-form"
        title="Напишите нам"
        subtitle="Заполните форму — мы перезвоним в ближайшее время"
        messagePrefix="Контакты: форма на сайте"
        cityVariant="two"
      />
      <KontaktyFaqSection />
    </>
  );
}
