import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { layoutFromApi } from "../config/layoutApi.js";
import { DEFAULT_HEADER_NAV } from "../data/defaultHeaderNav.js";
import { buildMenuParts } from "../utils/buildMenuParts.js";

const base = import.meta.env.BASE_URL || "/";

/** Оранжевый акцент шапки (контуры иконок). */
const AC_ORANGE = "#c41230";

const slogan1 = import.meta.env.VITE_HEADER_SLOGAN_1 ?? "СЕТЬ САЛОНОВ";
const slogan2 = import.meta.env.VITE_HEADER_SLOGAN_2 ?? "АВТОМОБИЛЕЙ С ПРОБЕГОМ";

/** Инлайн-телефон, если public/icon-phone-orange.svg не загрузился */
function HeaderPhoneIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="21" stroke={AC_ORANGE} strokeWidth="2.5" />
      <path
        stroke={AC_ORANGE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 16c.5-1 2-1.5 3-1l3.5 1.5c1 .5 1.5 1.5 1 2.5l-1 2.5c2.5 4 6 7.5 10 10l2.5-1c1-.5 2 0 2.5 1L42 35c.5 1 0 2.5-1 3-1.5 1.5-3.5 2.5-5.5 2.5C22 40.5 7.5 26 7.5 12.5c0-2 1-4 2.5-5.5 1-.5 2.5-.5 3.5.5l3 3.5z"
      />
    </svg>
  );
}

/** Инлайн: силуэт авто, если logo-car-icon.svg не грузится (Docker/Vite base). */
function HeaderCarSilhouette({ className }) {
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

/** Домик из public, иначе контур (fallback). */
function HeaderHomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        stroke={AC_ORANGE}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 14 16 4l12 10v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V14z"
      />
      <path stroke={AC_ORANGE} strokeWidth="2" strokeLinecap="round" d="M12 30V18h8v12" />
    </svg>
  );
}

/** Бренд: первые 2 символа чёрные, остальное оранжевое. */
function LogoWordmark() {
  const raw = (import.meta.env.VITE_SITE_BRAND ?? "ACAUTO").replace(/\s+/g, "");
  const ac = raw.slice(0, 2) || "AC";
  const auto = raw.slice(2) || "AUTO";
  return (
    <span className="mt-0.5 block text-left text-base font-bold leading-none tracking-tight sm:text-lg">
      <span className="text-black">{ac}</span>
      <span className="text-ac-orange">{auto}</span>
    </span>
  );
}

function formatTelDisplay(href) {
  if (!href) return "";
  const digits = href.replace(/^tel:/i, "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  }
  return href.replace(/^tel:/i, "");
}

/** tel: из env: допускаем tel:+7… или только цифры/+7…. */
function telHrefFromEnv(raw) {
  const s = raw.trim();
  if (!s) return "";
  if (/^tel:/i.test(s)) return s;
  const d = s.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("7")) return `tel:+${d}`;
  if (d.length === 10) return `tel:+7${d}`;
  return d ? `tel:+${d}` : "";
}

function MenuHref({ item, className, children, onNavigate, end }) {
  const href = item.href?.trim() || "#";
  if (/^https?:\/\//i.test(href)) {
    const cls = typeof className === "function" ? className({ isActive: false }) : className;
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer" onClick={onNavigate}>
        {children}
      </a>
    );
  }
  const to = href.startsWith("/") ? href : `/${href}`;
  return (
    <NavLink to={to} className={className} onClick={onNavigate} end={end ?? to === "/"}>
      {children}
    </NavLink>
  );
}

/**
 * Шапка: ряд 1 — бренд слева, телефон справа; ряд 2 — меню. Без рамок/полос (чистый белый фон).
 * ряд 2 — домик и ссылки меню подряд (с md — всегда видно на планшетах+).
 */
export function SiteHeader({ items }) {
  const safeItems = layoutFromApi && Array.isArray(items) ? items : [];
  const { phone, navRoots, childrenMap } = useMemo(() => buildMenuParts(safeItems), [safeItems]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoImgBroken, setLogoImgBroken] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  /** Меню из API или заглушка как на макете, пока админка пустая. */
  const effectiveNavRoots = navRoots.length > 0 ? navRoots : DEFAULT_HEADER_NAV;
  const effectiveChildrenMap = navRoots.length > 0 ? childrenMap : new Map();

  /** Телефон: из меню API только при layoutFromApi; иначе только env/резерв (не зависит от бэка). */
  const phoneBlock = useMemo(() => {
    const apiHref = layoutFromApi ? phone?.href?.trim() : "";
    if (apiHref?.toLowerCase().startsWith("tel:")) {
      return {
        href: apiHref,
        caption: phone.label?.trim() || "По любым вопросам",
        display: formatTelDisplay(apiHref),
      };
    }
    const envRaw = (import.meta.env.VITE_PUBLIC_PHONE_TEL || "").trim();
    const envHref = envRaw ? telHrefFromEnv(envRaw) : "";
    if (envHref) {
      return {
        href: envHref,
        caption: (import.meta.env.VITE_PUBLIC_PHONE_LABEL || "").trim() || "По любым вопросам",
        display: formatTelDisplay(envHref),
      };
    }
    const fallback = "tel:+79619429992";
    return {
      href: fallback,
      caption: "По любым вопросам",
      display: formatTelDisplay(fallback),
    };
  }, [phone]);

  // Шапка в потоке документа (не sticky) — при скролле уезжает вверх вместе с контентом
  return (
    <header className="relative z-30 border-b border-neutral-100 bg-white">
      {/* Ряд 1: один широкий логотип (SVG уже со слоганом) — без дубля текста; справа телефон */}
      <div className="mx-auto max-w-6xl px-4 pt-0 pb-1 sm:pt-0 sm:pb-1.5">
        <div className="-mt-2 flex w-full flex-wrap items-center justify-between gap-y-2 gap-x-4 sm:-mt-2.5">
          <Link
            to="/"
            className="flex min-w-0 max-w-full items-center gap-4 sm:max-w-[72%]"
            onClick={closeMobile}
          >
            {!logoImgBroken ? (
              <>
                <img
                  src={`${base}logocar.png`}
                  alt="ACT AUTO — сеть салонов автомобилей с пробегом"
                  className="h-auto w-[5.8rem] shrink-0 object-contain object-left sm:w-[7.2rem] md:w-[8.8rem]"
                  width={136}
                  height={64}
                  decoding="async"
                  onError={() => setLogoImgBroken(true)}
                />
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-extrabold uppercase leading-tight tracking-[0.02em] text-[#1e2a3a] sm:text-xs md:text-[0.9rem]">
                    Сеть салонов
                  </p>
                  <p className="text-[10px] font-extrabold uppercase leading-tight tracking-[0.02em] text-[#1e2a3a] sm:text-xs md:text-[0.9rem]">
                    автомобилей с пробегом
                  </p>
                </div>
              </>
            ) : (
              <div className="flex min-w-0 items-center gap-3">
                <HeaderCarSilhouette className="h-10 w-[4.5rem] shrink-0 sm:h-12 sm:w-[5.25rem]" />
                <div className="min-w-0 text-left">
                  <p className="text-[10px] font-bold uppercase leading-tight tracking-wide text-black sm:text-xs">
                    {slogan1}
                  </p>
                  <p className="text-[10px] font-bold uppercase leading-tight tracking-wide text-black sm:text-xs">
                    {slogan2}
                  </p>
                  <LogoWordmark />
                </div>
              </div>
            )}
          </Link>
          <a
            href={phoneBlock.href}
            className="flex w-full shrink-0 items-center justify-end gap-2.5 sm:w-auto sm:justify-start sm:gap-3"
          >
            <HeaderPhoneIcon className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />
            <span className="text-left">
              <span className="block text-xs font-medium text-neutral-500 sm:text-sm">{phoneBlock.caption}</span>
              <span className="block text-base font-bold tracking-tight text-neutral-900 sm:text-lg">{phoneBlock.display}</span>
            </span>
          </a>
        </div>
      </div>

      {/* Ряд 2: домик → меню */}
      <div className="bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-1.5 sm:gap-3 md:gap-5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex shrink-0 items-center rounded-md p-1 transition ${isActive ? "opacity-100" : "opacity-95 hover:bg-neutral-50"}`
            }
            onClick={closeMobile}
            aria-label="Главная"
          >
            <HeaderHomeIcon className="h-7 w-7 sm:h-8 sm:w-8" />
          </NavLink>

          <nav className="hidden min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1 md:flex md:gap-x-5 lg:gap-x-8">
            {effectiveNavRoots.map((it) => (
              <MainNavItem key={it.id} item={it} childrenList={effectiveChildrenMap.get(it.id) ?? []} />
            ))}
            <span className="mx-0.5 hidden h-4 w-px bg-neutral-200 lg:inline" aria-hidden />
            <Link
              to="/staff/login"
              className="hidden whitespace-nowrap px-1 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 lg:inline"
            >
              Staff
            </Link>
            <Link
              to="/admin/login"
              className="hidden whitespace-nowrap px-1 py-1.5 text-xs text-neutral-500 hover:text-neutral-800 lg:inline"
            >
              Админ
            </Link>
          </nav>

          <button
            type="button"
            className="ml-auto rounded border border-neutral-300 px-3 py-2 text-sm md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Меню"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "✕" : "Меню"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {effectiveNavRoots.map((it) => (
              <div key={it.id} className="border-b border-neutral-100 py-2">
                <MenuHref
                  item={it}
                  className="text-sm font-medium text-[#666666]"
                  onNavigate={closeMobile}
                >
                  {it.label}
                </MenuHref>
                {(effectiveChildrenMap.get(it.id) ?? []).map((ch) => (
                  <MenuHref
                    key={ch.id}
                    item={ch}
                    className="mt-2 block pl-3 text-sm text-neutral-600"
                    onNavigate={closeMobile}
                  >
                    {ch.label}
                  </MenuHref>
                ))}
              </div>
            ))}
            <Link to="/staff/login" className="py-1 text-sm text-neutral-500" onClick={closeMobile}>
              Staff
            </Link>
            <Link to="/admin/login" className="py-1 text-sm text-neutral-500" onClick={closeMobile}>
              Админ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function MainNavItem({ item, childrenList }) {
  const hasKids = childrenList.length > 0;
  const linkCls = ({ isActive }) =>
    `whitespace-nowrap px-1 py-1.5 text-sm font-medium ${
      isActive ? "text-ac-orange" : "text-[#666666] hover:text-ac-orange"
    }`;

  if (!hasKids) {
    return (
      <MenuHref item={item} className={linkCls}>
        {item.label}
      </MenuHref>
    );
  }
  return (
    <div className="group relative">
      <span className="flex cursor-default items-center gap-1 whitespace-nowrap px-1 py-1.5 text-sm font-medium text-[#666666] group-hover:text-ac-orange">
        {item.label}
        <span className="text-[10px] opacity-50">▼</span>
      </span>
      <div className="invisible absolute left-0 top-full z-50 min-w-[220px] border border-neutral-200 bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <MenuHref item={item} className="block px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
          {item.label}
        </MenuHref>
        {childrenList.map((ch) => (
          <MenuHref
            key={ch.id}
            item={ch}
            className="block px-4 py-2 text-sm text-[#666666] hover:bg-neutral-50 hover:text-ac-orange"
          >
            {ch.label}
          </MenuHref>
        ))}
      </div>
    </div>
  );
}
