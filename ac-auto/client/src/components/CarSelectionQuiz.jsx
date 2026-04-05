import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { RuFlagIcon } from "./icons/RuFlagIcon.jsx";

/** Общий подзаголовок внутри карточки (статика, без бэка). */
const STEP_INTRO =
  "Каждый ответ облегчает нашу задачу в подборе авто и увеличивает размер вашей скидки!";

const YEAR_OPTIONS = [
  { id: "difficult", label: "Затрудняюсь ответить" },
  { id: "to2005", label: "До 2005" },
  { id: "2006-2010", label: "2006-2010" },
  { id: "2011-2015", label: "2011-2015" },
  { id: "2016-2020", label: "2016-2020" },
  { id: "2021+", label: "2021 и новее" },
];

const MILEAGE_OPTIONS = [
  { id: "difficult", label: "Затрудняюсь ответить" },
  { id: "to50k", label: "До 50 000 км" },
  { id: "50-100k", label: "50 001 - 100 000 км" },
  { id: "100-150k", label: "100 001 - 150 000 км" },
  { id: "150-200k", label: "150 001 - 200 000 км" },
  { id: "200k+", label: "Более 200 000 км" },
];

/** Квадратная кнопка «назад» как на макете — оранжевая обводка и стрелка. */
function QuizBackButton({ onClick, label = "Назад" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded border-2 border-ac-bright-orange text-ac-bright-orange transition hover:bg-orange-50"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}

/** Белая карточка: оранжевая полоса сверху + тень (как на скрине). */
function QuizCard({ children }) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="h-[3px] w-full bg-ac-bright-orange" aria-hidden />
      <div className="px-6 py-8 md:px-10 md:py-10 lg:px-14 lg:py-12">{children}</div>
    </div>
  );
}

function ChoiceButton({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg px-4 py-3.5 text-left text-sm font-medium transition md:text-base ${
        selected
          ? "bg-orange-50 text-neutral-900 ring-2 ring-ac-bright-orange ring-inset"
          : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200/90"
      }`}
    >
      {children}
    </button>
  );
}

const inputGrayClass =
  "w-full rounded-lg border-0 bg-neutral-100 px-4 py-3.5 text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:ring-2 focus:ring-ac-bright-orange/40";

/**
 * Квиз подбора авто: вёрстка под макет (карточка, шаг 5 в две колонки). Без отправки на бэк.
 */
export function CarSelectionQuiz() {
  const [step, setStep] = useState(1);
  const [brandChoice, setBrandChoice] = useState(null);
  const [budgetChoice, setBudgetChoice] = useState(null);
  const [yearChoices, setYearChoices] = useState([]);
  const [mileageChoice, setMileageChoice] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleYear = useCallback((id) => {
    setYearChoices((prev) => {
      if (id === "difficult") {
        return prev.includes("difficult") ? [] : ["difficult"];
      }
      const withoutDiff = prev.filter((x) => x !== "difficult");
      if (withoutDiff.includes(id)) return withoutDiff.filter((x) => x !== id);
      return [...withoutDiff, id];
    });
  }, []);

  const goNextFromYear = useCallback(() => {
    if (yearChoices.length === 0) return;
    setStep(4);
  }, [yearChoices.length]);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const discountLine = (amount) => (
    <p className="text-base font-bold text-ac-bright-orange md:text-lg">Ваша скидка {amount} рублей</p>
  );

  const introBlock = (
    <p className="text-center text-sm leading-relaxed text-neutral-600 md:text-base">{STEP_INTRO}</p>
  );

  const stepFooter = (n, onBack) =>
    n <= 1 ? (
      <div className="mt-8 flex justify-end border-t border-neutral-100 pt-6">
        <p className="text-sm font-medium text-neutral-400">Шаг: {n}/5</p>
      </div>
    ) : (
      <div className="mt-8 flex items-center justify-between gap-4 border-t border-neutral-100 pt-6">
        <QuizBackButton onClick={onBack} />
        <p className="text-sm font-medium text-neutral-400">Шаг: {n}/5</p>
      </div>
    );

  return (
    <section className="border-t border-neutral-200 bg-[#f5f5f6] py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-base font-bold uppercase tracking-[0.06em] text-neutral-900 md:text-lg lg:text-xl">
          Подберем несколько вариантов авто по вашим параметрам
        </h2>

        {submitted ? (
          <QuizCard>
            <p className="text-center text-base font-medium text-neutral-800">
              Спасибо! Мы свяжемся с вами и сообщим результаты подбора.
            </p>
          </QuizCard>
        ) : (
          <>
            {step === 1 && (
              <QuizCard>
                <div className="space-y-6">
                  {introBlock}
                  <h3 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl lg:text-2xl">
                    Вы уже определились с маркой и моделью авто?
                  </h3>
                  {discountLine("2 500")}
                  <div className="space-y-3">
                    <ChoiceButton
                      selected={brandChoice === "not_yet"}
                      onClick={() => {
                        setBrandChoice("not_yet");
                        setStep(2);
                      }}
                    >
                      Еще нет
                    </ChoiceButton>
                    <ChoiceButton
                      selected={brandChoice === "know"}
                      onClick={() => {
                        setBrandChoice("know");
                        setStep(2);
                      }}
                    >
                      Знаю, какую машину хочу
                    </ChoiceButton>
                  </div>
                  {stepFooter(1)}
                </div>
              </QuizCard>
            )}

            {step === 2 && (
              <QuizCard>
                <div className="space-y-6">
                  {introBlock}
                  <h3 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl lg:text-2xl">
                    Какую сумму Вы готовы выделить на покупку авто
                  </h3>
                  {discountLine("5 000")}
                  <div className="space-y-3">
                    <ChoiceButton
                      selected={budgetChoice === "unsure"}
                      onClick={() => {
                        setBudgetChoice("unsure");
                        setStep(3);
                      }}
                    >
                      Затрудняюсь ответить
                    </ChoiceButton>
                    <ChoiceButton
                      selected={budgetChoice === "know"}
                      onClick={() => {
                        setBudgetChoice("know");
                        setStep(3);
                      }}
                    >
                      Знаю примерный бюджет
                    </ChoiceButton>
                  </div>
                  {stepFooter(2, () => setStep(1))}
                </div>
              </QuizCard>
            )}

            {step === 3 && (
              <QuizCard>
                <div className="space-y-6">
                  {introBlock}
                  <h3 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl lg:text-2xl">
                    Какой год выпуска Вас интересует?
                  </h3>
                  {discountLine("7 500")}
                  <p className="text-xs text-neutral-500">*Отметьте один или несколько вариантов</p>
                  <div className="space-y-2">
                    {YEAR_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium md:text-base ${
                          yearChoices.includes(opt.id)
                            ? "bg-orange-50 ring-2 ring-ac-bright-orange ring-inset"
                            : "bg-neutral-100 hover:bg-neutral-200/90"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={yearChoices.includes(opt.id)}
                          onChange={() => toggleYear(opt.id)}
                          className="h-4 w-4 shrink-0 accent-ac-bright-orange"
                        />
                        <span className="text-neutral-800">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-6">
                    <QuizBackButton onClick={() => setStep(2)} />
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-medium text-neutral-400">Шаг: 3/5</p>
                      <button
                        type="button"
                        disabled={yearChoices.length === 0}
                        onClick={goNextFromYear}
                        className="rounded-lg bg-ac-bright-orange px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Далее
                      </button>
                    </div>
                  </div>
                </div>
              </QuizCard>
            )}

            {step === 4 && (
              <QuizCard>
                <div className="space-y-6">
                  {introBlock}
                  <h3 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl lg:text-2xl">
                    Какой пробег для вас имеет значение
                  </h3>
                  {discountLine("10 000")}
                  <div className="space-y-3">
                    {MILEAGE_OPTIONS.map((opt) => (
                      <ChoiceButton
                        key={opt.id}
                        selected={mileageChoice === opt.id}
                        onClick={() => {
                          setMileageChoice(opt.id);
                          setStep(5);
                        }}
                      >
                        {opt.label}
                      </ChoiceButton>
                    ))}
                  </div>
                  {stepFooter(4, () => setStep(3))}
                </div>
              </QuizCard>
            )}

            {step === 5 && (
              <QuizCard>
                <form onSubmit={onSubmit} className="space-y-8">
                  {introBlock}

                  <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
                    {/* Левая колонка: заголовок, текст, шаг внизу */}
                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold leading-snug text-neutral-900 md:text-xl lg:text-2xl">
                        Оставьте свои контактные данные, чтобы узнать результат и получить сертификат!
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-neutral-600 md:text-base">
                        Спасибо за ответы, мы подберем для вас несколько вариантов авто и свяжемся с вами. Оставьте свой
                        номер телефона, чтобы мы могли закрепить за вами подарочный сертификат и сообщить результаты
                        подбора.
                      </p>
                      {discountLine("10 000")}
                      <p className="mt-auto pt-8 text-sm font-medium text-neutral-400 md:pt-10">Шаг: 5/5</p>
                    </div>

                    {/* Правая колонка: форма */}
                    <div className="flex flex-col">
                      <label className="block">
                        <input
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ваше имя"
                          autoComplete="name"
                          className={inputGrayClass}
                        />
                      </label>
                      <label className="mt-4 block">
                        <div className="flex items-stretch overflow-hidden rounded-lg bg-neutral-100 transition focus-within:ring-2 focus-within:ring-ac-bright-orange/40">
                          <span className="flex shrink-0 items-center border-r border-neutral-200/80 px-3">
                            <RuFlagIcon className="shrink-0" />
                          </span>
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+7 (000) 000-00-00"
                            autoComplete="tel"
                            className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-neutral-900 outline-none placeholder:text-neutral-400"
                          />
                        </div>
                      </label>

                      <p className="mt-6 text-xs leading-relaxed text-neutral-500">
                        Нажимая на кнопку &quot;Узнать результат&quot; вы соглашаетесь с{" "}
                        <Link
                          to="/page/politika-konfidencialnosti"
                          className="font-medium text-ac-bright-orange underline-offset-2 hover:underline"
                        >
                          политикой обработки персональных данных
                        </Link>
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-end gap-3 pt-8">
                        <QuizBackButton onClick={() => setStep(4)} />
                        <button
                          type="submit"
                          className="rounded-lg bg-ac-bright-orange px-8 py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
                        >
                          Узнать результат
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </QuizCard>
            )}
          </>
        )}
      </div>
    </section>
  );
}
