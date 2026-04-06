/**
 * Сетка услуг страхования: белые карточки, слева фото — кнопка открывает модалку заявки.
 */

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

const CARDS = [
  {
    key: "osago",
    title: "ОСАГО",
    text: "Обязательное страхование автогражданской ответственности",
    image: `${base}insurance-services/osago.jpg`,
    modalTitle: "Желаете оформить полис ОСАГО?",
    messageProduct: "ОСАГО (автострахование)",
  },
  {
    key: "kasko",
    title: "КАСКО",
    text: "Добровольное страхование средств наземного транспорта от угона и ущерба",
    image: `${base}insurance-services/kasko.jpg`,
    modalTitle: "Желаете оформить полис КАСКО?",
    messageProduct: "КАСКО (автострахование)",
  },
  {
    key: "life",
    title: "Страхование жизни",
    text: "Страхование пассажиров от несчастных случаев",
    image: `${base}insurance-services/life.jpg`,
    modalTitle: "Желаете оформить страхование жизни?",
    messageProduct: "Страхование жизни (автострахование)",
  },
  {
    key: "gap",
    title: "GAP страхование",
    text: "Полис страхования, позволяющий получить полную выплату по КАСКО без учета амортизационного износа",
    image: `${base}insurance-services/gap.jpg`,
    modalTitle: "Желаете оформить GAP-страхование?",
    messageProduct: "GAP-страхование",
  },
];

/**
 * @param {(ctx: { modalTitle: string, messageProduct: string }) => void} props.onRequest
 * @param {string[]} [props.adminImages]
 */
export function InsuranceServicesGridSection({ onRequest, adminImages = [] }) {
  const cards = CARDS.map((card, index) => {
    const adminImage = typeof adminImages[index] === "string" ? adminImages[index].trim() : "";
    return {
      ...card,
      image: adminImage || card.image,
    };
  });

  return (
    <section
      className="bg-neutral-950 py-14 md:py-20"
      aria-labelledby="insurance-services-grid-title"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="insurance-services-grid-title"
          className="text-center text-base font-bold uppercase tracking-[0.08em] text-white md:text-lg"
        >
          Услуги страхования от «ACT AUTO»
        </h2>

        <ul className="mt-10 grid list-none grid-cols-1 gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          {cards.map((c) => (
            <li key={c.key}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md md:min-h-[220px] md:flex-row">
                <div className="relative h-48 w-full shrink-0 bg-neutral-200 md:h-auto md:w-[42%]">
                  <img
                    src={c.image}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-5 md:p-6">
                  <h3 className="text-base font-bold uppercase tracking-wide text-neutral-900 md:text-lg">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-800 md:text-[0.9375rem]">{c.text}</p>
                  <button
                    type="button"
                    className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-semibold text-neutral-900 underline-offset-4 transition hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-bright-orange focus-visible:ring-offset-2"
                    onClick={() => onRequest({ modalTitle: c.modalTitle, messageProduct: c.messageProduct })}
                  >
                    Оставить заявку
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
