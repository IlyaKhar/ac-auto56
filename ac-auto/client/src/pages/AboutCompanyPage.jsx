import { useEffect, useState } from "react";
import { ActAutoSingleAddressSection } from "../components/ActAutoSingleAddressSection.jsx";
import { AboutCompanyGallerySlider } from "../components/AboutCompanyGallerySlider.jsx";
import { fetchAboutGallery } from "../api/publicApi.js";
import { openLeadCaptureModal } from "../utils/leadModalEvents.js";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
const logoSrc = `${base}logo-car-icon.svg`;

function ScrollChevron() {
  return (
    <a
      href="#about-company-intro"
      className="absolute bottom-8 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center text-white/80 animate-bounce motion-reduce:animate-none"
      aria-label="Прокрутить вниз"
    >
      <span className="text-2xl leading-none" aria-hidden>
        ⌄
      </span>
    </a>
  );
}

function AboutIntro() {
  return (
    <section
      id="about-company-intro"
      className="scroll-mt-24 bg-neutral-950 py-16 text-white md:py-24"
      aria-labelledby="about-intro-title"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center md:px-6">
        <div className="flex flex-col items-center gap-2">
          <img src={logoSrc} alt="" className="h-14 w-auto opacity-95 md:h-16" width={56} height={56} />
          <p className="text-2xl font-bold tracking-tight md:text-3xl">
            <span className="text-white">AC </span>
            <span className="text-[#e31e24]">AUTO</span>
          </p>
        </div>
        <h2 id="about-intro-title" className="mt-10 text-lg font-bold uppercase tracking-[0.12em] md:text-xl">
          О компании
        </h2>
        <div className="mt-8 space-y-5 text-left text-sm leading-relaxed text-white/95 md:text-base md:leading-relaxed">
          <p>
            «ACT AUTO» — успешная сеть автосалонов, существующая с 2015 года и представленная торговыми площадками в
            Оренбурге и Самаре.
          </p>
          <p>
            За годы своей деятельности мы накопили богатый опыт в сфере продажи автомобилей, обслуживания и ремонта. Мы
            гордимся своей репутацией надёжной и качественной компании, которая стремится воплощать мечты автолюбителей в
            реальность. Наша команда состоит из высококвалифицированных специалистов, которые готовы предоставить вам
            профессиональную консультацию и помощь при выборе автомобиля. Сотрудники «ACT AUTO» обладают глубокими
            знаниями о каждой модели и всегда готовы поделиться экспертным мнением, чтобы помочь вам принять правильное
            решение.
          </p>
          <p>
            Компания «ACT-AUTO» предлагает широкий выбор новых и поддержанных автомобилей, услуги автокредитования,
            лизинга, trade-in и другие предложения для компаний и физических лиц. Также в нашу сеть входят: автотехцентр,
            автомойки, студия детейлинга и другие проекты.
          </p>
        </div>
      </div>
    </section>
  );
}

function RedIconCircle({ children }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e31e24] md:h-14 md:w-14"
      aria-hidden
    >
      <span className="text-white [&_svg]:h-6 [&_svg]:w-6 md:[&_svg]:h-7 md:[&_svg]:w-7">{children}</span>
    </div>
  );
}

const WHY_ITEMS = [
  {
    key: "exp",
    title: "Богатый опыт и репутация",
    text: "Наша безупречная репутация подтверждена положительными отзывами и долгосрочными партнерствами.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 4l2.5 5 5.5.8-4 3.8 1 5.4L12 16.9 6 19l1-5.4-4-3.8 5.5-.8L12 4z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "pro",
    title: "Профессионализм и индивидуальный подход",
    text: "Штат сети автосалонов «ACT AUTO» состоит из высококвалифицированных специалистов, оказывающих профессиональную помощь и поддержку клиентам на каждом этапе покупки автомобиля.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "qual",
    title: "Гарантия качества автомобилей",
    text: "Мы предлагаем автомобили, которые проходят строгий контроль качества и проверку на соответствие высоким стандартам. Мы уверены в качестве наших автомобилей и предоставляем гарантию на каждый проданный автомобиль.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M7 4h10v16H7V4z" />
        <path d="M9 8h6M9 12h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "fin",
    title: "Удобные условия финансирования",
    text: "Наша компания предлагает гибкую систему финансирования, которая помогает клиентам приобрести автомобиль без значительного влияния на их бюджет. «ACT AUTO» всегда предлагает различные варианты кредитования и автолизинга, чтобы сделать покупку автомобиля максимально доступной для каждого из клиентов компании.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 6v12M8 10h8M8 14h5" strokeLinecap="round" />
        <path d="M6 4h12v4H6V4z" />
      </svg>
    ),
  },
  {
    key: "range",
    title: "Широкий ассортимент автомобилей",
    text: "В сети автосалонов «ACT AUTO» представлен большой выбор автомобилей различных марок, моделей и классов, удовлетворяющий потребности клиентов с разными вкусами и предпочтениями.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 14h2l1.5-3h9L18 14h2" strokeLinecap="round" />
        <circle cx="8" cy="16" r="2" />
        <circle cx="16" cy="16" r="2" />
        <path d="M6 14l2-4h8l2 4" />
      </svg>
    ),
  },
];

function AboutWhy() {
  return (
    <section className="bg-[#121212] py-16 text-white md:py-24" aria-labelledby="about-why-title">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <h2
          id="about-why-title"
          className="text-center text-base font-bold uppercase leading-snug tracking-[0.08em] md:text-lg"
        >
          Почему клиенты выбирают «ACT AUTO»
        </h2>
        <ul className="mt-12 list-none space-y-10">
          {WHY_ITEMS.map((it) => (
            <li key={it.key} className="flex gap-4 md:gap-5">
              <RedIconCircle>{it.icon}</RedIconCircle>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-base font-bold leading-snug md:text-lg">{it.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/90 md:text-[0.9375rem]">{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() =>
              openLeadCaptureModal({ contextLabel: "Хочу присоединиться к команде ACT AUTO" })
            }
            className="rounded-md bg-[#e31e24] px-8 py-4 text-center text-xs font-bold uppercase tracking-wide text-white shadow-lg transition hover:brightness-110 md:text-sm"
          >
            Хочу присоединиться к команде!
          </button>
        </div>
      </div>
    </section>
  );
}

/** Страница «О компании» /o-kompanii */
export default function AboutCompanyPage() {
  const [galleryUrls, setGalleryUrls] = useState([]);

  useEffect(() => {
    let c = false;
    fetchAboutGallery()
      .then((d) => {
        if (!c && d?.image_urls) setGalleryUrls(d.image_urls);
      })
      .catch(() => {
        if (!c) setGalleryUrls([]);
      });
    return () => {
      c = true;
    };
  }, []);

  return (
    <>
      <div className="relative flex min-h-[calc(100svh-4rem)] w-full flex-col items-center justify-center bg-black px-4 py-20 md:min-h-[calc(100svh-3rem)]">
        <h1 className="max-w-xl text-center text-xl font-bold uppercase leading-snug tracking-wide text-white sm:text-2xl md:text-3xl md:leading-tight">
          Сеть автосалонов
          <br />
          автомобилей с пробегом
          <br />«ACT AUTO»
        </h1>
        <ScrollChevron />
      </div>
      <AboutIntro />
      <AboutCompanyGallerySlider imageUrls={galleryUrls} />
      <AboutWhy />
      <ActAutoSingleAddressSection />
    </>
  );
}
