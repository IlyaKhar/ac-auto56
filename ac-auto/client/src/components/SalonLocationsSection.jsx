import { useState } from "react";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

/**
 * Устаревший тип CMS-блока (страницы); на /katalog данные идут из GET /api/v1/salon-locations.
 */
export const SALON_LOCATIONS_BLOCK_TYPE = "salon_locations";

const DEFAULT_TITLE = "Адрес автосалона и автосервиса «ACT AUTO»";

/** Карточка организации: одна точка на Яндексе и в 2ГИС для обоих адресов на Авторемонтной */
const DEFAULT_MAP_LINKS = {
  yandex_maps_url:
    "https://yandex.ru/maps/org/ast_avto/211550710125/?ll=55.162301%2C51.794484&utm_source=share&z=18",
  gis_url: "https://2gis.ru/orenburg/firm/70000001083243865?m=55.162139%2C51.794388%2F16",
};

/** Дефолты, если страница CMS ещё не создана или в блоке пусто */
const DEFAULT_LOCATIONS = [
  {
    ...DEFAULT_MAP_LINKS,
    image: `${base}locations/salon-3a.jpg`,
    city: "г. Оренбург",
    street: "ул. Авторемонтная, 3А",
    phone: "+7 (961) 942-99-92",
  },
  {
    ...DEFAULT_MAP_LINKS,
    image: `${base}locations/salon-3.jpg`,
    city: "г. Оренбург",
    street: "ул. Авторемонтная, 3",
    phone: "+7 (903) 392-44-55",
  },
];

/**
 * Шаблон для кнопки в админке и дефолт формы (пути от корня сайта, без BASE_URL).
 */
export const SALON_LOCATIONS_DATA_TEMPLATE = {
  title: DEFAULT_TITLE,
  locations: [
    {
      ...DEFAULT_MAP_LINKS,
      image: "/locations/salon-3a.jpg",
      city: "г. Оренбург",
      street: "ул. Авторемонтная, 3А",
      phone: "+7 (961) 942-99-92",
    },
    {
      ...DEFAULT_MAP_LINKS,
      image: "/locations/salon-3.jpg",
      city: "г. Оренбург",
      street: "ул. Авторемонтная, 3",
      phone: "+7 (903) 392-44-55",
    },
  ],
};

export function normalizeSalonLocationsData(data) {
  if (data == null) {
    return { title: DEFAULT_TITLE, locations: DEFAULT_LOCATIONS.map((x) => ({ ...x })) };
  }
  const title =
    typeof data.title === "string" && data.title.trim() ? data.title.trim() : DEFAULT_TITLE;
  if (Array.isArray(data.locations) && data.locations.length === 0) {
    return { title, locations: [] };
  }
  const raw = Array.isArray(data?.locations) && data.locations.length > 0 ? data.locations : DEFAULT_LOCATIONS;
  const locations = raw.map((loc, i) => {
    const preset = DEFAULT_LOCATIONS[i];
    return preset ? { ...preset, ...loc } : { ...DEFAULT_MAP_LINKS, ...loc };
  });
  return { title, locations };
}

/** Картинка из API: /path или https — без base; иначе дописываем BASE_URL */
export function resolveSalonLocationImageSrc(url) {
  if (!url || typeof url !== "string") return "";
  const u = url.trim();
  if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/")) return u;
  return `${base}${u.replace(/^\//, "")}`;
}

export function salonLocationTelHref(phone) {
  if (!phone || typeof phone !== "string") return undefined;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return undefined;
  const normalized = digits.length === 11 && digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
  return `tel:+${normalized}`;
}

/**
 * Первый адрес для карточки «один салон» (напр. автосервис); данные из GET /api/v1/salon-locations.
 * Пустой массив из БД — fallback на пресет 3А.
 */
export function pickPrimarySalonDisplay(apiResponse) {
  const { title, locations } = normalizeSalonLocationsData(apiResponse);
  const loc =
    locations.length > 0
      ? locations[0]
      : { ...DEFAULT_MAP_LINKS, ...DEFAULT_LOCATIONS[0] };
  return {
    sectionTitle: title,
    city: loc.city,
    street: loc.street,
    phone: loc.phone,
    image: loc.image,
    yandex_maps_url: loc.yandex_maps_url || DEFAULT_MAP_LINKS.yandex_maps_url,
    gis_url: loc.gis_url || DEFAULT_MAP_LINKS.gis_url,
  };
}

/** Сетка: 1 / 2 / 3+ колонок на десктопе */
function locationsGridClass(count) {
  if (count <= 1) return "grid-cols-1 max-w-xl mx-auto";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3";
}

/**
 * Адреса салона: фото, текст, Яндекс + 2ГИС. Данные из CMS или дефолты.
 */
export function SalonLocationsSection({ data }) {
  const { title, locations } = normalizeSalonLocationsData(data);
  const [broken, setBroken] = useState(() => ({}));
  const gridCls = locationsGridClass(locations.length);

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">
          {title}
        </h2>

        <div className={`mt-8 grid gap-10 md:mt-10 md:gap-8 lg:gap-12 ${gridCls}`}>
          {locations.map((loc, idx) => {
            const rowKey = loc.id != null ? `id-${loc.id}` : `${loc.street}-${idx}`;
            const imgSrc = resolveSalonLocationImageSrc(loc.image);
            const tel = salonLocationTelHref(loc.phone);
            return (
              <div key={rowKey} className="flex flex-col items-center text-center">
                <div className="w-full overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
                  {!broken[rowKey] ? (
                    <img
                      src={imgSrc}
                      alt=""
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={() => setBroken((p) => ({ ...p, [rowKey]: true }))}
                    />
                  ) : (
                    <div
                      className="flex aspect-[16/10] w-full items-center justify-center px-4 text-xs text-neutral-400"
                      aria-hidden
                    >
                      Фото: путь из CMS (image) или public/locations/
                    </div>
                  )}
                </div>

                <div className="mt-5 space-y-1 text-sm font-bold text-neutral-900 md:mt-6 md:text-base">
                  <p>{loc.city}</p>
                  <p>{loc.street}</p>
                  <p className="pt-1">
                    Телефон:{" "}
                    {tel ? (
                      <a href={tel} className="text-ac-bright-orange underline-offset-2 hover:underline">
                        {loc.phone}
                      </a>
                    ) : (
                      loc.phone
                    )}
                  </p>
                </div>

                <div className="mt-5 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                  <a
                    href={loc.yandex_maps_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md bg-ac-bright-orange px-4 py-3 text-center text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 sm:text-xs md:min-h-0 md:px-5"
                  >
                    Проложить маршрут в Яндекс.Карты
                  </a>
                  <a
                    href={loc.gis_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-md border-2 border-ac-bright-orange bg-white px-4 py-3 text-center text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-ac-bright-orange transition hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 sm:text-xs md:min-h-0 md:px-5"
                  >
                    Проложить маршрут в 2ГИС
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
