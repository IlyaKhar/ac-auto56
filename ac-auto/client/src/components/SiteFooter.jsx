import { useState } from "react";
import { Link } from "react-router-dom";
import { layoutFromApi } from "../config/layoutApi.js";

const base = import.meta.env.BASE_URL || "/";

/** Телефоны в колонке логотипа (отображение + tel). */
const footPhone1 = {
  display: import.meta.env.VITE_FOOTER_PHONE1_DISPLAY?.trim() || "+7 (961) 942-99-92",
  tel: (() => {
    const t = (import.meta.env.VITE_FOOTER_PHONE1_TEL || "tel:+79619429992").trim();
    return /^tel:/i.test(t) ? t : "tel:+79619429992";
  })(),
};
const footPhone2 = {
  display: import.meta.env.VITE_FOOTER_PHONE2_DISPLAY?.trim() || "+7 (903) 398-88-11",
  tel: (() => {
    const t = (import.meta.env.VITE_FOOTER_PHONE2_TEL || "tel:+79033988811").trim();
    return /^tel:/i.test(t) ? t : "tel:+79033988811";
  })(),
};

const socialVk = (import.meta.env.VITE_SOCIAL_VK || "https://vk.com").trim();
const socialYt = (import.meta.env.VITE_SOCIAL_YOUTUBE || "https://youtube.com").trim();

/** Дефолтные колонки, пока в админке нет секций футера. */
const DEFAULT_LINK_COLS = [
  {
    title: "УСЛУГИ",
    links: [
      { label: "Выкуп", to: "/page/vykup" },
      { label: "Комиссионная продажа", to: "/komissionnaya-prodazha" },
      { label: "Trade-in", to: "/page/trade-in" },
      { label: "Страхование", to: "/avtostrakhovanie" },
      { label: "Автокредит", to: "/avtokreditovanie" },
    ],
  },
  {
    title: "О КОМПАНИИ",
    links: [
      { label: "О нас", to: "/page/o-nas" },
      { label: "Контакты", to: "/page/kontakty" },
      { label: "Вакансии", to: "/page/vakansii" },
      { label: "Политика конфиденциальности", to: "/page/politika-konfidencialnosti" },
    ],
  },
  {
    title: "ROSTOSH",
    links: [
      { label: "Малярно-кузовной цех", to: "/page/molyarno-kuzovnoj-ceh" },
      { label: "Автосервис", to: "/page/avtoservis-rostosh" },
    ],
  },
];

function FooterCarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 48" aria-hidden="true">
      <path
        fill="#1a1a1a"
        d="M8 28c0-2 1.5-4 4-4h40c2.5 0 4 2 4 4v6H8v-6zm6-10 4-8h28l4 8H14zm8 14a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm26 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
      />
      <path stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" d="M20 18h24" />
    </svg>
  );
}

/** Юридический текст под колонками. */
function FooterLegal() {
  return (
    <div className="mt-12 max-w-4xl text-xs leading-relaxed text-neutral-600">
      <p>
        Обращаем Ваше внимание на то, что данный сайт носит исключительно информационный характер и ни при каких
        условиях не является публичной офертой, определяемой положениями статьи 437 Гражданского кодекса Российской
        Федерации. Для получения более подробной информации обращайтесь к менеджерам по продажам.
      </p>
      <p className="mt-2">
        Отправляя персональные данные, вы соглашаетесь с условиями обработки и использования персональных данных.
      </p>
      <p className="mt-2 font-medium text-neutral-700">
        ИП Аристов М. Ю. ИНН 561016157804
      </p>
    </div>
  );
}

/**
 * Подвал: при данных из API — те же колонки в светлой сетке; иначе полный макет как на ac-auto56.
 */
/** Дефолтный футер без секций из CMS. */
function DefaultFooterColumns() {
  const [logoBroken, setLogoBroken] = useState(false);
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <div className="flex flex-col items-start">
        <Link to="/" className="mb-5 flex items-center gap-3">
          {!logoBroken ? (
            <img
              src={`${base}logocar.png`}
              alt=""
              className="h-auto w-[5rem] shrink-0 object-contain"
              width={128}
              height={56}
              onError={() => setLogoBroken(true)}
            />
          ) : (
            <FooterCarIcon className="mb-1 h-12 w-16" />
          )}
          <div className="text-left">
            <p className="text-[0.8rem] font-extrabold uppercase leading-tight tracking-[0.02em] text-[#1e2a3a]">
              Сеть салонов
            </p>
            <p className="text-[0.8rem] font-extrabold uppercase leading-tight tracking-[0.02em] text-[#1e2a3a]">
              автомобилей с пробегом
            </p>
          </div>
        </Link>
        <div className="flex flex-col gap-1 text-lg font-medium leading-snug text-[#4b5563] sm:text-xl">
          <a href={footPhone1.tel} className="whitespace-nowrap transition hover:text-ac-orange">
            {footPhone1.display}
          </a>
          <a href={footPhone2.tel} className="whitespace-nowrap transition hover:text-ac-orange">
            {footPhone2.display}
          </a>
        </div>
      </div>

      {DEFAULT_LINK_COLS.map((col) => (
        <div key={col.title}>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-neutral-900">{col.title}</h3>
          <ul className="space-y-2 text-sm">
            {col.links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-neutral-600 transition hover:text-ac-orange">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div>
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-neutral-900">СОЦИАЛЬНЫЕ СЕТИ</h3>
        <div className="flex gap-3">
          <a
            href={socialVk}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-ac-orange text-white shadow-sm transition hover:brightness-95"
            aria-label="ВКонтакте"
          >
            <VkIcon className="h-5 w-5" />
          </a>
          <a
            href={socialYt}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-ac-orange text-white shadow-sm transition hover:brightness-95"
            aria-label="YouTube"
          >
            <YoutubeIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter({ sections }) {
  const hasCms = layoutFromApi && Array.isArray(sections) && sections.length > 0;

  return (
    <footer className="mt-auto bg-neutral-100 text-neutral-700">
      <div className="mx-auto max-w-6xl px-4 py-12 lg:py-14">
        {hasCms ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {sections.map((s) => (
              <div key={s.id}>
                {s.title && (
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-neutral-900">{s.title}</h3>
                )}
                <div
                  className="ac-footer-html-light text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: s.content }}
                />
              </div>
            ))}
          </div>
        ) : (
          <DefaultFooterColumns />
        )}

        <FooterLegal />
      </div>
    </footer>
  );
}

function VkIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.946 4.03 8.546c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.573 2.303 4.827 2.896 4.827.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v4.627c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.253-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.033-2.354 4.096-2.354 4.096-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.05.17.491-.085.744-.576.744z" />
    </svg>
  );
}

function YoutubeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
