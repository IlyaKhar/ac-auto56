/**
 * Услуги: блок на главной и статичные лендинги (без API).
 * Картинки: public/services/*.jpg (имена как в image) — иначе градиент.
 */
const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

export const OUR_SERVICES_CARDS = [
  {
    slug: "vykup",
    title: "Выкуп автомобилей",
    subtitle: "Экономим ваше время и силы!",
    href: "/page/vykup",
    image: `${base}services/vykup-hero.png`,
    fallbackClass: "from-amber-900/90 to-stone-900/80",
  },
  {
    slug: "trade-in",
    title: "Trade-In",
    subtitle: "Удобный и быстрый способ сменить автомобиль!",
    href: "/page/trade-in",
    image: `${base}services/trade-in.jpg`,
    fallbackClass: "from-slate-800/90 to-neutral-900/80",
  },
  {
    slug: "komissionnaya-prodazha",
    title: "Комиссионная продажа автомобилей",
    subtitle: "Продайте свой автомобиль легко, быстро и выгодно!",
    href: "/komissionnaya-prodazha",
    image: `${base}services/komissionnaya-prodazha.jpg`,
    fallbackClass: "from-zinc-800/90 to-stone-900/80",
  },
  {
    slug: "avtokreditovanie",
    title: "Автокредитование",
    subtitle: "Самые выгодные условия для вас!",
    href: "/avtokreditovanie",
    image: `${base}services/avtokreditovanie.jpg`,
    fallbackClass: "from-emerald-950/90 to-slate-900/80",
  },
  {
    slug: "avtostrakhovanie",
    title: "Автострахование",
    subtitle: "Доверьте нам свою безопасность на дороге!",
    href: "/avtostrakhovanie",
    image: `${base}services/avtostrakhovanie.jpg`,
    fallbackClass: "from-blue-950/90 to-slate-900/80",
  },
  {
    slug: "avtoservis",
    title: "Автосервис",
    subtitle: "Полный комплекс услуг для вашего автомобиля!",
    href: "/page/avtoservis",
    image: `${base}services/avtoservis.jpg`,
    fallbackClass: "from-orange-950/90 to-neutral-900/80",
  },
  {
    slug: "molyarnyj-ceh",
    title: "Малярно-кузовной цех",
    subtitle: "Вернём идеальный вид вашего автомобиля!",
    href: "/page/molyarnyj-ceh",
    image: `${base}services/molyarnyj-ceh.jpg`,
    fallbackClass: "from-red-950/85 to-stone-900/80",
  },
  {
    slug: "avtomoyka",
    title: "Автомойка / детейлинг-сервис",
    subtitle: "С заботой о вашем автомобиле!",
    href: "/rostosh_carwash",
    image: `${base}services/avtomoyka.jpg`,
    fallbackClass: "from-cyan-950/90 to-slate-900/80",
  },
];

/** Отдельные лендинги; остальные slug — StaticServiceLandingPage. */
export const STATIC_SERVICE_SLUGS = OUR_SERVICES_CARDS.map((c) => c.slug).filter(
  (s) =>
    s !== "vykup" &&
    s !== "trade-in" &&
    s !== "avtoservis" &&
    s !== "molyarnyj-ceh" &&
    s !== "avtomoyka" &&
    s !== "komissionnaya-prodazha" &&
    s !== "avtokreditovanie" &&
    s !== "avtostrakhovanie",
);

/** Тексты лендингов (slug совпадает с карточкой). */
export const STATIC_SERVICE_LANDING = {
  vykup: {
    title: "Выкуп автомобилей",
    paragraphs: [
      "Срочный выкуп легковых и коммерческих автомобилей в Оренбурге. Оценка в день обращения, честная цена и оформление документов без очередей.",
      "Приезжаем на осмотр или принимаем авто у нас на площадке. Расчёт наличными или на карту — как вам удобнее.",
    ],
  },
  "trade-in": {
    title: "Trade-In",
    paragraphs: [
      "Обменяйте свой автомобиль на другой из нашего каталога с доплатой в любую сторону. Оценим ваше авто и подберём вариант под бюджет.",
      "Один договор, помощь с кредитом и страховкой — меньше беготни, больше времени за рулём новой машины.",
    ],
  },
  "komissionnaya-prodazha": {
    title: "Комиссионная продажа автомобилей",
    paragraphs: [
      "Продадим ваш автомобиль от имени салона: фото, реклама, звонки и показы берём на себя. Вы получаете деньги после продажи по договору.",
      "Подходит, если не хотите тратить время на частников и торги — работаем прозрачно, фиксируем условия в акте приёма.",
    ],
  },
  avtokreditovanie: {
    title: "Автокредитование",
    paragraphs: [
      "Помогаем оформить автокредит в банках-партнёрах: первый взнос и срок подбираем под ваш доход.",
      "Предварительное решение за короткое время, консультация по программам и страховкам — бесплатно на этапе подбора авто.",
    ],
  },
  avtostrakhovanie: {
    title: "Автострахование",
    paragraphs: [
      "ОСАГО и КАСКО: оформим полис, сравним условия и подскажем оптимальный набор рисков.",
      "Работаем со страховыми компаниями, помогаем с заявлением при наступлении страхового случая.",
    ],
  },
  avtoservis: {
    title: "Автосервис",
    paragraphs: [
      "Диагностика, ТО, ремонт двигателя и подвески, шиномонтаж и развал-схождение. Запчасти в наличии и под заказ.",
      "Мастера с опытом, понятная смета до начала работ и гарантия на выполненные услуги.",
    ],
  },
  "molyarnyj-ceh": {
    title: "Малярно-кузовной цех",
    paragraphs: [
      "Кузовной ремонт, локальная покраска, полировка и антикор. Восстанавливаем геометрию и внешний вид после ДТП и коррозии.",
      "Камера, подбор цвета по коду, контроль качества на каждом этапе.",
    ],
  },
  avtomoyka: {
    title: "Автомойка и детейлинг",
    paragraphs: [
      "Комплексная и ручная мойка, химчистка салона, полировка кузова и защитные покрытия.",
      "Бережно относимся к лакокрасочному покрытию и материалам салона — используем профессиональную химию.",
    ],
  },
};
