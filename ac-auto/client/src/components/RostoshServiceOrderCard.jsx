import { Link } from "react-router-dom";

function IconCircle({ children }) {
  return (
    <div
      className="mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#e02020] via-[#c41230] to-[#5c0d0d] shadow-md md:h-[5rem] md:w-[5rem]"
      aria-hidden
    >
      {children}
    </div>
  );
}

function IconImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="size-[4.5rem] scale-[1.42] object-contain md:size-[5rem] md:scale-[1.48]"
      loading="lazy"
      decoding="async"
    />
  );
}

/**
 * Карточка услуги с кнопкой записи: одинаковая высота в сетке, кнопка всегда внизу.
 */
export function RostoshServiceOrderCard({ label, iconSrc, orderHref }) {
  return (
    <li className="flex">
      <article className="flex h-full w-full flex-col items-center rounded-2xl bg-white px-4 pb-5 pt-6 text-center shadow-sm ring-1 ring-neutral-200/90">
        <IconCircle>
          <IconImage src={iconSrc} alt="" />
        </IconCircle>

        <h3 className="mt-4 flex min-h-[4.5rem] w-full flex-1 items-center justify-center px-1 text-[1.15rem] font-bold leading-snug text-neutral-900 md:min-h-[5rem] md:text-[1.35rem]">
          {label}
        </h3>

        <Link
          to={orderHref}
          className="mt-4 flex w-full min-h-[44px] max-w-[12.5rem] items-center justify-center rounded-md bg-ac-vykup-cta px-5 py-2.5 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-white shadow-md transition hover:brightness-110 active:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ac-vykup-cta focus-visible:ring-offset-2"
        >
          В корзину
        </Link>
      </article>
    </li>
  );
}
