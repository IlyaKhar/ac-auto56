import { Link } from "react-router-dom";

/** Левая колонка: 4 блока; правая: 3 (как на макете). */
const ROWS = [
  {
    left: {
      title: "Более 250 проверенных авто с гарантией юридической чистоты",
      text: "Выбирайте из широкого ассортимента автомобилей, каждый из которых прошел тщательную проверку. Мы заботимся о вас, поэтому даем гарантию юридической чистоты на каждый автомобиль.",
    },
    right: {
      title: "Покупайте с уверенностью — дополнительная гарантия на 1 год!",
      text: "Приобретая автомобиль у нас, вы получаете не только качественный транспорт, но и дополнительную гарантию на 1 год. Мы уверены в каждом автомобиле и готовы подтвердить это гарантией.",
    },
  },
  {
    left: {
      title: "Обслуживание вашего авто на льготных условиях",
      text: "Покупая авто у нас, вы получаете скидку на обслуживание на 6 месяцев. Мы заботимся о вашем авто и вашем бюджете.",
    },
    right: {
      title: "Автокредит за 15 минут — решение за час!",
      text: "С нашими кредитными программами вы сможете купить авто своей мечты быстро и без лишних хлопот. Рассмотрение заявки занимает всего 15 минут, а одобрение — не более одного часа.",
    },
  },
  {
    left: {
      title: "50+ кредитных программ — выберите свой идеальный вариант",
      text: "Наша компания предлагает более 50 различных кредитных программ. Мы поможем подобрать ту, которая будет наиболее выгодной именно для вас.",
    },
    right: {
      title: "Комиссионная продажа вашего авто на выгодных условиях",
      text: "Хотите продать свой автомобиль? Мы сделаем это за вас. Выгодные условия и минимальные хлопоты — вот, что вы получаете, обращаясь к нам.",
    },
  },
  {
    left: {
      title: "TRADE-IN: обменяйте старое авто на новое за 1 час",
      text: "Программа TRADE-IN позволяет вам сэкономить время и деньги. Обменяйте свой старый автомобиль на новый быстро и выгодно.",
    },
    right: null,
  },
];

function CheckIcon() {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F28C28] shadow-sm md:h-14 md:w-14"
      aria-hidden
    >
      <svg className="h-6 w-6 text-white md:h-7 md:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function Block({ title, text }) {
  return (
    <div className="flex items-start gap-4 md:gap-5">
      <CheckIcon />
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-base font-bold leading-snug text-black md:text-lg">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#4F4F4F] md:text-[0.9375rem]">{text}</p>
      </div>
    </div>
  );
}

const titleClassName =
  "mx-auto max-w-4xl text-center text-lg font-bold uppercase leading-tight tracking-[0.08em] text-black md:text-xl lg:text-2xl";

/**
 * Блок «Ваш идеальный автомобиль с гарантией» — на главной и на отдельной странице.
 * @param {{ asStandalonePage?: boolean }} props — на отдельной странице: ссылка «назад» и заголовок h1.
 */
export function IdealCarGuaranteeSection({ asStandalonePage = false }) {
  const HeadingTag = asStandalonePage ? "h1" : "h2";

  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {asStandalonePage ? (
          <>
            <Link
              to="/katalog"
              className="text-sm font-medium text-ac-bright-orange underline-offset-2 hover:underline"
            >
              ← На главную
            </Link>
            <HeadingTag className={`${titleClassName} mt-8 md:mt-10`}>
              Ваш идеальный автомобиль с гарантией
            </HeadingTag>
          </>
        ) : (
          <HeadingTag className={titleClassName}>
            Ваш идеальный автомобиль с гарантией
          </HeadingTag>
        )}

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-y-12 md:mt-16 md:grid-cols-2 md:gap-x-14 md:gap-y-14 lg:gap-x-20">
          {ROWS.map((row, i) => (
            <div key={i} className="contents md:contents">
              <Block title={row.left.title} text={row.left.text} />
              {row.right ? (
                <Block title={row.right.title} text={row.right.text} />
              ) : (
                <div className="hidden md:block" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
