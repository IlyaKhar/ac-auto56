const PAYMENT_METHODS = [
  { title: "Наличный расчёт", text: "Оплата в салоне после согласования условий сделки." },
  { title: "Безналичный перевод", text: "Перечисление на расчётный счёт по реквизитам компании." },
  { title: "Автокредит", text: "Оформление кредита через банки-партнёры «ACT АВТО»." },
  { title: "Рассрочка", text: "Гибкий график платежей без переплаты по акции." },
];

const PAYMENT_STEPS = [
  { n: 1, title: "Согласование суммы", text: "Фиксируем стоимость автомобиля и способ оплаты." },
  { n: 2, title: "Подготовка документов", text: "Собираем пакет для банка или договор купли-продажи." },
  { n: 3, title: "Оплата", text: "Проводим расчёт выбранным способом в согласованные сроки." },
  { n: 4, title: "Передача авто", text: "Вы получаете автомобиль и закрывающие документы." },
];

const FAQ = [
  {
    q: "Можно ли оформить кредит без первоначального взноса?",
    a: "Да, ряд банков-партнёров рассматривает заявки без первого взноса — менеджер подскажет актуальные программы.",
  },
  {
    q: "Сколько ждать решение банка?",
    a: "Предварительное решение — от 15 минут, окончательное — обычно в течение одного рабочего дня.",
  },
  {
    q: "Какие документы нужны для кредита?",
    a: "Паспорт и водительское удостоверение; точный список зависит от банка и суммы кредита.",
  },
];

const GUARANTEES = [
  "Юридическая чистота автомобиля перед продажей.",
  "Прозрачные условия кредитования без скрытых комиссий.",
  "Сопровождение менеджером на всех этапах сделки.",
];

/** Способы оплаты (рис. 71) — если не используем слайдер банков. */
export function AvtokreditPaymentMethodsSection() {
  return (
    <section id="avtokredit-payment-methods-cards" className="bg-white py-14 md:py-20" aria-labelledby="avtokredit-pay-methods-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 id="avtokredit-pay-methods-title" className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">
          Способы оплаты
        </h2>
        <ul className="mt-10 grid list-none gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {PAYMENT_METHODS.map((item) => (
            <li key={item.title} className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-6">
              <h3 className="text-sm font-bold text-neutral-900 md:text-base">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-700">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Как происходит оплата (рис. 72). */
export function AvtokreditPaymentProcessSection() {
  return (
    <section id="avtokredit-payment-process" className="bg-neutral-100 py-14 md:py-20" aria-labelledby="avtokredit-payment-process-title">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 id="avtokredit-payment-process-title" className="text-center text-base font-bold uppercase tracking-[0.08em] text-neutral-900 md:text-lg">
          Как происходит оплата
        </h2>
        <ol className="mt-10 grid list-none gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
          {PAYMENT_STEPS.map((step) => (
            <li key={step.n} className="rounded-xl bg-white px-5 py-6 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ac-bright-orange text-sm font-bold text-white">
                {step.n}
              </span>
              <h3 className="mt-4 text-sm font-bold text-neutral-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Рассрочка (рис. 73). */
export function AvtokreditInstallmentSection() {
  return (
    <section id="avtokredit-installment" className="bg-white py-14 md:py-20" aria-labelledby="avtokredit-installment-title">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 id="avtokredit-installment-title" className="text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">
          Рассрочка без процентов
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-neutral-700 md:text-base">
          Для отдельных моделей и акций доступна рассрочка без переплаты: фиксированный график платежей и понятные
          условия до подписания договора.
        </p>
      </div>
    </section>
  );
}

/** FAQ (рис. 74). */
export function AvtokreditFaqSection() {
  return (
    <section id="avtokredit-faq" className="bg-neutral-950 py-14 text-white md:py-20" aria-labelledby="avtokredit-faq-title">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 id="avtokredit-faq-title" className="text-center text-base font-bold uppercase tracking-[0.08em] md:text-lg">
          Часто задаваемые вопросы
        </h2>
        <dl className="mt-10 space-y-6 md:mt-12">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-lg border border-white/15 bg-white/5 px-5 py-4">
              <dt className="text-sm font-bold md:text-base">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-white/85">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Гарантии (рис. 75). */
export function AvtokreditGuaranteesSection() {
  return (
    <section id="avtokredit-guarantees" className="bg-white py-14 md:py-20" aria-labelledby="avtokredit-guarantees-title">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 id="avtokredit-guarantees-title" className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">
          Наши гарантии
        </h2>
        <ul className="mt-10 list-disc space-y-3 pl-6 text-sm leading-relaxed text-neutral-800 md:text-base">
          {GUARANTEES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Контакт по оплате (рис. 76). */
export function AvtokreditPaymentHelpSection({ telHref }) {
  return (
    <section
      id="avtokredit-payment-help"
      className="bg-neutral-100 px-4 py-12 text-center md:py-16"
      aria-labelledby="avtokredit-payment-help-title"
    >
      <div className="mx-auto max-w-2xl">
        <h2 id="avtokredit-payment-help-title" className="text-lg font-bold uppercase tracking-[0.08em] text-neutral-900 md:text-xl">
          Остались вопросы по оплате?
        </h2>
        <p className="mt-4 text-sm text-neutral-700 md:text-base">Позвоните или оставьте заявку — менеджер ответит на все вопросы.</p>
        <a
          href={telHref}
          className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-ac-vykup-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.08em] text-neutral-900"
        >
          Позвонить
        </a>
      </div>
    </section>
  );
}
