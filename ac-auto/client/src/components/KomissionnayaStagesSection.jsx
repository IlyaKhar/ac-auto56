/**
 * Блок «Этапы приёма на комиссию» — горизонтальная линия с шагами (на мобиле — вертикальный список).
 */

const STAGES = [
  {
    title: "Осмотр автомобиля",
    text: "Осмотр автомобиля производится в собственном сервисном центре сети автосалонов",
  },
  {
    title: "Оценка автомобиля",
    text: "Оценка стоимости автомобиля проходит совместно с экспертом",
  },
  {
    title: "Цена",
    text: "На данном этапе мы согласовываем цену автомобиля с нашим клиентом",
  },
  {
    title: "Договор",
    text: "Заключаем агентский договор и приступаем к продаже автомобиля по согласованной ранее цене",
  },
];

export function KomissionnayaStagesSection() {
  return (
    <section
      className="bg-[#f9f9f9] py-14 md:py-20"
      aria-labelledby="komissiya-stages-title"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="komissiya-stages-title"
          className="text-center text-base font-bold uppercase tracking-[0.08em] text-neutral-900 md:text-lg"
        >
          Этапы приёма автомобиля на комиссию
        </h2>

        {/* Десктоп: линия через центры кружков */}
        <div className="relative mt-14 hidden md:block">
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[22px] h-0.5 bg-[#e31e24]"
            aria-hidden
          />
          <ol className="relative grid grid-cols-4 gap-4">
            {STAGES.map((s, i) => (
              <li key={s.title} className="flex flex-col items-center text-center">
                <span className="z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e31e24] text-lg font-bold text-white shadow-sm">
                  {i + 1}
                </span>
                <h3 className="mt-6 text-sm font-bold text-neutral-900">{s.title}</h3>
                <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-neutral-600 md:text-sm">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Мобилка: вертикальная шкала */}
        <ol className="relative mt-10 space-y-8 border-l-2 border-[#e31e24] pl-6 md:hidden">
          {STAGES.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="absolute -left-[31px] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#e31e24] text-sm font-bold text-white">
                {i + 1}
              </span>
              <h3 className="text-sm font-bold text-neutral-900">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
