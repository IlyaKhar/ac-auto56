import { useId, useState } from "react";

const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

const ACCENT = "#F2994A";

const TABS = [
  {
    id: "engine",
    label: "Двигатель",
    title: "Двигатель",
    text: "Проверяем общее состояние двигателя, наличие посторонних шумов и вибраций при запуске. Оцениваем работоспособность датчиков. Выявляем течи и износ. Ищем повреждения цилиндра при помощи эндоскопа. Делаем замер компрессии.",
    image: `${base}car-inspection/dvigatel.jpg`,
  },
  {
    id: "body",
    label: "Кузов",
    title: "Кузов",
    text: "Выявляем скрытые дефекты, нарушения геометрии и признаки участия в ДТП. Фиксируем следы ремонта и замены кузовных деталей. Оцениваем качество ремонта кузова.",
    image: `${base}car-inspection/kuzov.jpg`,
  },
  {
    id: "interior",
    label: "Салон",
    title: "Салон",
    text: "Оцениваем состояние салона и степень износа деталей интерьера. Ищем свидетельства ДТП. Проверяем работоспособность всех органов управления в автомобиле.",
    image: `${base}car-inspection/salon.jpg`,
  },
  {
    id: "chassis",
    label: "Ходовая",
    title: "Ходовая",
    text: "Оцениваем износ, выявляем необходимость замены деталей. Ищем утечки жидкости. При необходимости проводим тест-драйв.",
    image: `${base}car-inspection/hodovaya.jpg`,
  },
  {
    id: "diag",
    label: "Диагностика",
    title: "Диагностика",
    text: "Проводим компьютерную диагностику на профессиональном оборудовании, которое считывает все блоки на наличие ошибок. Проводим исследование на предмет корректировки пробега. Проверяем ДВС, АКПП, систему безопасности, полный привод, рулевую рейку.",
    image: `${base}car-inspection/diagnostika.jpg`,
  },
  {
    id: "docs",
    label: "Проверка документов",
    title: "Проверка документов, участие в ДТП, число владельцев",
    text: "И многое другое мы узнаём из закрытых и открытых источников.",
    image: `${base}car-inspection/dokumenty.jpg`,
  },
];

/**
 * Блок «Как мы проверяем автомобиль»: табы + фото + текст (статика, без API).
 */
export function CarInspectionSection() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];
  const panelId = useId();
  const [imgBroken, setImgBroken] = useState(false);

  function select(i) {
    setActive(i);
    setImgBroken(false);
  }

  return (
    <section className="bg-[#F5F7F9] py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-center text-base font-bold uppercase tracking-[0.1em] text-neutral-900 md:text-lg">
          Как мы проверяем автомобиль
        </h2>

        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm md:mt-10 md:p-8 lg:p-10">
          <div
            className="flex flex-wrap gap-x-5 gap-y-1 border-b border-neutral-100 pb-0 md:gap-x-8"
            role="tablist"
            aria-label="Этапы проверки"
          >
            {TABS.map((t, i) => {
              const isOn = i === active;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={isOn}
                  aria-controls={`${panelId}-${t.id}`}
                  id={`${panelId}-tab-${t.id}`}
                  onClick={() => select(i)}
                  className={`-mb-px border-t-2 px-1 pb-3 pt-3 text-left text-sm font-medium transition md:text-base ${
                    isOn
                      ? "text-[#F2994A]"
                      : "border-transparent text-neutral-800 hover:text-neutral-600"
                  }`}
                  style={{ borderTopColor: isOn ? ACCENT : "transparent" }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div
            id={`${panelId}-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`${panelId}-tab-${tab.id}`}
            className="mt-8 grid grid-cols-1 items-center gap-8 md:mt-10 md:grid-cols-2 md:gap-10 lg:gap-12"
          >
            <div className="order-2 min-w-0 md:order-1">
              {!imgBroken ? (
                <img
                  src={tab.image}
                  alt=""
                  className="aspect-[4/3] w-full rounded-xl object-cover shadow-sm"
                  onError={() => setImgBroken(true)}
                />
              ) : (
                <div
                  className="flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-neutral-200 text-center text-sm text-neutral-500"
                  aria-hidden
                >
                  {`Фото: public/car-inspection/${tab.image.split("/").pop()}`}
                </div>
              )}
            </div>
            <div className="order-1 min-w-0 md:order-2">
              <h3 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl">{tab.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">{tab.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
