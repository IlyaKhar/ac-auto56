/** Ссылка на отзывы организации в Яндекс.Картах */
const YANDEX_REVIEWS_URL =
  "https://yandex.ru/maps/org/ast_avto/211550710125/reviews/?ll=55.167601%2C51.800953&mode=search&sll=55.159362%2C51.800952&source=serp_navig&tab=reviews&text=ac%20auto%20%D0%BE%D1%80%D0%B5%D0%BD%D0%B1%D1%83%D1%80%D0%B3&z=15";

const REVIEWS = [
  {
    name: "Елена Ц.",
    initial: "Е",
    avatarClass: "bg-[#5B8DEF]",
    text: "Покупали машину в кредит, всё оформили быстро и без нервов. Менеджер всё объяснил по шагам, машина соответствовала описанию. Рекомендую AC Auto — серьёзный подход к клиенту.",
    date: "29 апреля 2024",
  },
  {
    name: "Константин",
    initial: "К",
    avatarClass: "bg-[#E879A9]",
    text: "Искал конкретную комплектацию, помогли подобрать и проверили по VIN. Торг уместный, документы в порядке. Остался доволен и сервисом, и автомобилем.",
    date: "12 марта 2024",
  },
  {
    name: "Bogdan Шевлюк",
    initial: "B",
    avatarClass: "bg-[#3EB489]",
    text: "Обратился по trade-in, оценили честно. Новый автомобиль доставили в срок, состояние как на фото в объявлении. Отдельное спасибо за сопровождение сделки и помощь с кредитом — всё прозрачно, без скрытых платежей. Если снова менять авто, только сюда.",
    date: "3 февраля 2024",
    clamp: true,
  },
];

function StarRow() {
  return (
    <div className="flex gap-0.5 text-[#E8B923]" aria-label="Оценка 5 из 5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-base leading-none" aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

function YandexWordmark() {
  return (
    <span className="inline-flex items-baseline font-bold tracking-tight text-neutral-900">
      <span className="text-lg text-[#FC3F1D] md:text-xl" aria-hidden>
        Я
      </span>
      <span className="text-base md:text-lg">ндекс</span>
    </span>
  );
}

/**
 * Блок «Отзывы»: рейтинг слева, заголовок по центру, кнопка на Яндекс справа; три карточки.
 */
export function ReviewsSection() {
  return (
    <section className="bg-[#F5F7F9] py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">Отзывы</h2>

        {/* Под заголовком: слева рейтинг + Яндекс, справа CTA — как на макете */}
        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1 md:max-w-[55%]">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <span className="text-3xl font-bold leading-none text-neutral-900 md:text-4xl">4,9</span>
              <YandexWordmark />
            </div>
            <p className="text-sm text-neutral-500 md:text-[0.9375rem]">наш рейтинг на яндексе</p>
          </div>

          <a
            href={YANDEX_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-ac-bright-orange px-5 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2 md:px-7 md:py-3.5 md:text-[0.8125rem]"
          >
            Смотреть все отзывы
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:grid-cols-3 md:gap-6">
          {REVIEWS.map((r) => (
            <article
              key={r.name}
              className="flex flex-col rounded-xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-6"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${r.avatarClass}`}
                  aria-hidden
                >
                  {r.initial}
                </div>
                <h3 className="text-base font-bold text-neutral-900">{r.name}</h3>
              </div>
              <p
                className={`mt-4 flex-1 text-left text-sm leading-relaxed text-neutral-700 md:text-[0.9375rem] ${
                  r.clamp ? "line-clamp-5" : ""
                }`}
              >
                {r.text}
              </p>
              <div className="mt-6 flex items-end justify-between gap-3 border-t border-neutral-100 pt-4">
                <StarRow />
                <time className="shrink-0 text-xs text-neutral-400 md:text-sm" dateTime={r.date}>
                  {r.date}
                </time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
