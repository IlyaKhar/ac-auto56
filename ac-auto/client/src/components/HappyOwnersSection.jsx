import { useState } from "react";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

/** Порядок и позиции как на макете: 4 колонки × 4 ряда, крупное 2×2 слева сверху, 4 квадрата справа сверху и т.д. */
const PHOTOS = [
  { src: `${base}happy-owners/01.jpg`, span: "col-span-2 row-span-2 col-start-1 row-start-1", alt: "Клиент с автомобилем" },
  { src: `${base}happy-owners/02.jpg`, span: "col-start-3 row-start-1", alt: "Клиенты у автомобиля" },
  { src: `${base}happy-owners/03.jpg`, span: "col-start-4 row-start-1", alt: "Клиент у белого автомобиля" },
  { src: `${base}happy-owners/04.jpg`, span: "col-start-3 row-start-2", alt: "Клиенты у автосалона" },
  { src: `${base}happy-owners/05.jpg`, span: "col-start-4 row-start-2", alt: "Клиент у внедорожника" },
  { src: `${base}happy-owners/06.jpg`, span: "col-start-1 row-start-3", alt: "Автомобиль с бантом" },
  { src: `${base}happy-owners/07.jpg`, span: "col-start-2 row-start-3", alt: "Автомобиль с бантом" },
  { src: `${base}happy-owners/08.jpg`, span: "col-span-2 col-start-1 row-start-4", alt: "Передача автомобиля клиенту" },
  {
    src: `${base}happy-owners/09.jpg`,
    span: "col-span-2 row-span-2 col-start-3 row-start-3",
    alt: "Клиент у дилерского центра AC AUTO",
  },
];

/**
 * Блок «Счастливые обладатели наших машин»: коллаж 3×3 с ячейками разного размера (сетка 4×4).
 */
export function HappyOwnersSection() {
  const [broken, setBroken] = useState(() => ({}));

  function markBroken(i) {
    setBroken((prev) => ({ ...prev, [i]: true }));
  }

  return (
    <section className="bg-[#F5F7F9] py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">
          Счастливые обладатели наших машин
        </h2>

        {/* Коллаж чуть уже полосы контента — max-w-5xl вместо полной ширины max-w-6xl */}
        <div className="mx-auto mt-8 w-full max-w-5xl md:mt-10">
          <div className="grid h-[clamp(200px,46vw,460px)] grid-cols-4 grid-rows-[repeat(4,minmax(0,1fr))] gap-2 sm:gap-2.5 md:gap-3">
            {PHOTOS.map((p, i) => (
              <div key={p.src} className={`min-h-0 min-w-0 overflow-hidden rounded-xl ${p.span}`}>
                {!broken[i] ? (
                  <img
                    src={p.src}
                    alt={p.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => markBroken(i)}
                  />
                ) : (
                  <div
                    className="flex h-full min-h-[4rem] w-full items-center justify-center bg-neutral-200 px-2 text-center text-[10px] text-neutral-500 sm:text-xs"
                    aria-hidden
                  >
                    {`public/happy-owners/${String(i + 1).padStart(2, "0")}.jpg`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
