const FAQ = [
  {
    q: "Как быстро вы отвечаете на заявку с сайта?",
    a: "Менеджер связывается в рабочее время салона — обычно в течение часа после отправки формы.",
  },
  {
    q: "Можно ли записаться на сервис через сайт?",
    a: "Да, оставьте заявку в форме или позвоните по телефону салона — подберём удобное время.",
  },
  {
    q: "Где посмотреть адрес и маршрут?",
    a: "Адреса и кнопки «Яндекс.Карты» / «2ГИС» указаны выше на этой странице.",
  },
];

/** FAQ на странице контактов (рис. 82). */
export function KontaktyFaqSection() {
  return (
    <section id="kontakty-faq" className="bg-neutral-100 py-14 md:py-20" aria-labelledby="kontakty-faq-title">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2 id="kontakty-faq-title" className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">
          Часто задаваемые вопросы
        </h2>
        <dl className="mt-10 space-y-5 md:mt-12">
          {FAQ.map((item) => (
            <div key={item.q} className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm">
              <dt className="text-sm font-bold text-neutral-900 md:text-base">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-neutral-700">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
