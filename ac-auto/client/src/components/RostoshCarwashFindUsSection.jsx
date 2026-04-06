const MAP_WIDGET_SRC =
  "https://yandex.ru/map-widget/v1/?from=api-maps&ll=55.228989%2C51.787585&z=17&pt=55.228989%2C51.787585%2Cpm2rdm";

const ADDRESS_LINE = "п. Ростоши, ул. Дальнореченская, 22";
const PHONE_DISPLAY = "+7 (3532) 58-69-00";

const YANDEX_OPEN_URL =
  "https://yandex.ru/maps/48/orenburg/house/dalnorechenskaya_ulitsa_22/YUwYdAVoQEwHQFtrfXt5dnlrYQ==/?ll=55.228989%2C51.787585&z=17";

const GIS_OPEN_URL =
  "https://2gis.ru/orenburg/search/%D0%94%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%80%D0%B5%D1%87%D0%B5%D0%BD%D1%81%D0%BA%D0%B0%D1%8F%2022%20%D1%80%D0%BE%D1%81%D1%82%D0%BE%D1%88%D0%B8";

function phoneTelHref(display) {
  const d = display.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  if (d.length === 10) return `tel:+7${d}`;
  return `tel:+${d}`;
}

function TwoGisBadgeLink() {
  return (
    <a
      href={GIS_OPEN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#299400] text-[0.6rem] font-black leading-tight text-white shadow-md transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#299400] focus-visible:ring-offset-2 sm:h-12 sm:w-12 sm:text-[0.65rem]"
      aria-label="Открыть в 2ГИС"
    >
      2ГИС
    </a>
  );
}

function YandexBadgeLink() {
  return (
    <a
      href={YANDEX_OPEN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-[#FC3F1D] text-lg font-bold leading-none text-white shadow-md transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FC3F1D] focus-visible:ring-offset-2"
      aria-label="Открыть в Яндекс.Картах"
    >
      Я
    </a>
  );
}

export function RostoshCarwashFindUsSection() {
  const tel = phoneTelHref(PHONE_DISPLAY);

  return (
    <section className="bg-neutral-100 py-14 md:py-20" aria-labelledby="rostosh-carwash-find-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-12 lg:gap-14">
          <div className="min-h-0 w-full shrink-0 md:w-[min(100%,28rem)] md:flex-1 lg:max-w-none">
            <div className="overflow-hidden rounded-xl bg-neutral-200 shadow-sm ring-1 ring-neutral-200/80">
              <iframe
                title="Карта: автомойка ROSTOSH, п. Ростоши, ул. Дальнореченская, 22"
                src={MAP_WIDGET_SRC}
                width="100%"
                height="360"
                className="block min-h-[280px] w-full border-0 md:min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center md:min-w-0 md:flex-1">
            <h2
              id="rostosh-carwash-find-title"
              className="text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg"
            >
              Как нас найти
            </h2>

            <p className="mt-6 text-sm font-bold leading-relaxed text-neutral-900 md:text-base">{ADDRESS_LINE}</p>

            <p className="mt-3 text-sm leading-relaxed text-neutral-600 md:text-base">
              <span className="font-bold text-neutral-900">Телефон:</span>{" "}
              <a href={tel} className="text-neutral-600 underline-offset-2 hover:text-ac-bright-orange hover:underline">
                {PHONE_DISPLAY}
              </a>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <TwoGisBadgeLink />
              <YandexBadgeLink />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
