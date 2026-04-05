import { useEffect, useState } from "react";
import { fetchSalonLocations } from "../api/publicApi.js";
import {
  pickPrimarySalonDisplay,
  resolveSalonLocationImageSrc,
  salonLocationTelHref,
} from "./SalonLocationsSection.jsx";

/**
 * Один салон: заголовок и поля из БД (GET /api/v1/salon-locations), первая запись по порядку.
 * Пока запрос не пришёл — те же дефолты, что у SalonLocationsSection.
 */
export function ActAutoSingleAddressSection() {
  const [payload, setPayload] = useState(null);
  const [imgBroken, setImgBroken] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSalonLocations()
      .then((data) => {
        if (!cancelled) setPayload(data ?? null);
      })
      .catch(() => {
        if (!cancelled) setPayload(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setImgBroken(false);
  }, [payload]);

  const d = pickPrimarySalonDisplay(payload);
  const imgSrc = resolveSalonLocationImageSrc(d.image);
  const tel = salonLocationTelHref(d.phone);

  return (
    <section className="bg-white pb-14 md:pb-20" aria-labelledby="act-auto-single-address-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="act-auto-single-address-title"
          className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
        >
          {d.sectionTitle}
        </h2>

        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center md:max-w-2xl md:mt-12">
          <div className="w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm ring-1 ring-neutral-200/80">
            {!imgBroken && imgSrc ? (
              <img
                src={imgSrc}
                alt=""
                className="aspect-[16/10] w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImgBroken(true)}
              />
            ) : (
              <div
                className="flex aspect-[16/10] w-full items-center justify-center px-4 text-center text-xs text-neutral-400"
                aria-hidden
              >
                Нет фото или неверный путь в админке «Адреса салона»
              </div>
            )}
          </div>

          <div className="mt-6 space-y-1 text-center text-sm font-bold text-neutral-900 md:mt-8 md:text-base">
            <p>{d.city}</p>
            <p>{d.street}</p>
            <p className="pt-1">
              Телефон:{" "}
              {tel ? (
                <a href={tel} className="text-ac-bright-orange underline-offset-2 hover:underline">
                  {d.phone}
                </a>
              ) : (
                d.phone
              )}
            </p>
          </div>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={d.yandex_maps_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-ac-bright-orange px-4 py-3 text-center text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 sm:text-xs md:min-h-0 md:px-5"
            >
              Проложить маршрут в Яндекс.Карты
            </a>
            <a
              href={d.gis_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md border-2 border-ac-bright-orange bg-white px-4 py-3 text-center text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-ac-bright-orange transition hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 sm:text-xs md:min-h-0 md:px-5"
            >
              Проложить маршрут в 2ГИС
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
