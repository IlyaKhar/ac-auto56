import { formatRub } from "../utils/formatRub.js";

const base = import.meta.env.BASE_URL || "/";
const cardLogoSrc = (import.meta.env.VITE_CATALOG_CARD_LOGO_URL || "").trim();

function HeartButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow-sm transition hover:bg-white"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className={active ? "text-red-500" : "text-neutral-800"}
        aria-hidden
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

/**
 * Сетка карточек каталога (данные с GET /vehicles).
 * @param {React.ReactNode} [footer] — пагинация и кнопки под сеткой.
 * @param {boolean} [hideTitle] — скрыть подзаголовок «Каталог автомобилей» (если герой уже даёт заголовок).
 * @param {boolean} [embedded] — без внешней секции и контейнера (внутри панели фильтров).
 * @param {string} [emptyMessage] — текст, если сетка пустая (например, после фильтров).
 */
export function CarCatalogGrid({
  vehicles,
  onOpenDetail,
  favoriteIds,
  onToggleFavorite,
  footer,
  hideTitle = false,
  embedded = false,
  emptyMessage,
}) {
  const imgs = Array.isArray(vehicles) ? vehicles : [];

  const body = (
    <>
      {!hideTitle ? (
        <h2 className="text-center text-base font-bold uppercase tracking-[0.08em] text-neutral-900 md:text-lg">
          Каталог автомобилей
        </h2>
      ) : null}

      {imgs.length === 0 ? (
        <p
          className={`mx-auto max-w-md text-center text-sm text-neutral-500 ${hideTitle ? "mt-6" : "mt-10"}`}
        >
          {emptyMessage ??
            "Пока нет объявлений. Добавьте автомобили в админке: раздел «Автомобили» и отметьте «На сайте»."}
        </p>
      ) : (
        <ul className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ${hideTitle ? "mt-6" : "mt-10"}`}>
          {imgs.map((v) => {
            const cover = Array.isArray(v.images) && v.images[0] ? v.images[0] : "";
            const fav = favoriteIds?.has(v.id);
            const logoUrl =
              cardLogoSrc && !cardLogoSrc.startsWith("http") ? `${base}${cardLogoSrc.replace(/^\//, "")}` : cardLogoSrc;
            const isNew = Boolean(v.is_new);
            return (
              <li
                key={v.id}
                className="flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-neutral-100">
                  {cover ? (
                    <img src={cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-400">Нет фото</div>
                  )}
                  {logoUrl ? (
                    <div className="pointer-events-none absolute left-0 right-0 top-2 flex justify-center">
                      <img src={logoUrl} alt="" className="max-h-8 max-w-[120px] object-contain drop-shadow-sm" />
                    </div>
                  ) : null}
                  {isNew ? (
                    <span className="absolute bottom-2 left-2 rounded bg-white/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-800 shadow-sm">
                      Новый
                    </span>
                  ) : null}
                  <HeartButton
                    active={fav}
                    onClick={() => onToggleFavorite?.(v.id)}
                    label={fav ? "Убрать из избранного" : "В избранное"}
                  />
                </div>
                <div className="flex flex-1 flex-col px-3 pb-4 pt-3 text-center">
                  <p className="flex-1 text-sm font-bold leading-snug text-neutral-900">{v.title}</p>
                  <p className="mt-2 text-base font-bold text-neutral-900">{formatRub(v.price_rub)}</p>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(v)}
                    className="mt-4 w-full rounded-md bg-ac-bright-orange py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                  >
                    Подробнее
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {footer ? <div className="mt-12 flex flex-col items-center gap-8">{footer}</div> : null}
    </>
  );

  if (embedded) {
    return <div className="w-full">{body}</div>;
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">{body}</div>
    </section>
  );
}
