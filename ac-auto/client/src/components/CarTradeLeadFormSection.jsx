import { useCallback, useId, useState } from "react";
import { Link } from "react-router-dom";
import { createApplication } from "../api/publicApi.js";
import { TurnstileField } from "./TurnstileField.jsx";
import { RuFlagIcon } from "./icons/RuFlagIcon.jsx";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

const MILEAGE_OPTIONS = [
  { value: "", label: "Выберите из списка" },
  { value: "до 30 000 км", label: "до 30 000 км" },
  { value: "30 000 – 60 000 км", label: "30 000 – 60 000 км" },
  { value: "60 000 – 100 000 км", label: "60 000 – 100 000 км" },
  { value: "100 000 – 150 000 км", label: "100 000 – 150 000 км" },
  { value: "150 000 – 200 000 км", label: "150 000 – 200 000 км" },
  { value: "более 200 000 км", label: "более 200 000 км" },
];

const fieldClass =
  "w-full rounded border-0 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-ac-vykup-cta";

const labelClass = "mb-1.5 block text-left text-sm font-medium text-white";

/**
 * Общая тёмная форма (выкуп / trade-in): марка, модель, год, пробег, владельцы, город, имя, телефон.
 * @param {string} props.anchorId — id секции для href="#..."
 * @param {string} props.title — заголовок (стилизуется uppercase)
 * @param {string} props.subtitle
 * @param {string} props.messagePrefix — первая строка в message на бэк
 */
export function CarTradeLeadFormSection({ anchorId, title, subtitle, messagePrefix }) {
  const formId = useId();
  const titleId = `${formId}-lead-form-title`;
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [ownersPts, setOwnersPts] = useState(1);
  const [cityMode, setCityMode] = useState("orenburg");
  const [otherCity, setOtherCity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaMountKey, setCaptchaMountKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const onTok = useCallback((t) => setTurnstileToken(t || ""), []);
  const needCaptcha = Boolean(turnstileSiteKey);
  const captchaOk = !needCaptcha || Boolean(turnstileToken);

  function bumpOwners(delta) {
    setOwnersPts((n) => clamp(n + delta, 1, 30));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!mileage) {
      setErr("Выберите пробег из списка");
      return;
    }
    if (cityMode === "other" && !otherCity.trim()) {
      setErr("Укажите город");
      return;
    }
    if (needCaptcha && !turnstileToken) {
      setErr("Подтвердите, что вы не робот");
      return;
    }
    const cityLine = cityMode === "orenburg" ? "Оренбург" : otherCity.trim();
    const msgParts = [
      messagePrefix,
      `Марка: ${brand.trim() || "—"}`,
      `Модель: ${model.trim() || "—"}`,
      `Год выпуска: ${year.trim() || "—"}`,
      `Пробег: ${mileage}`,
      `Владельцев по ПТС: ${ownersPts}`,
      `Город: ${cityLine}`,
    ];
    setSending(true);
    try {
      await createApplication({
        type: "callback",
        name: name.trim(),
        phone: phone.trim(),
        car_brand: [brand.trim(), model.trim()].filter(Boolean).join(" ").trim() || undefined,
        message: msgParts.join(" "),
        turnstile_token: turnstileToken || "",
      });
      setDone(true);
      setTurnstileToken("");
      setCaptchaMountKey((k) => k + 1);
    } catch (er) {
      setErr(er.response?.data?.error || "Ошибка отправки");
      setCaptchaMountKey((k) => k + 1);
      setTurnstileToken("");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id={anchorId}
      className="scroll-mt-28 bg-[#121212] py-14 md:py-20"
      aria-labelledby={titleId}
    >
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <h2
          id={titleId}
          className="text-center text-base font-bold uppercase leading-snug tracking-[0.06em] text-white sm:text-lg md:text-xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/90 md:text-base">
          {subtitle}
        </p>

        {done ? (
          <p className="mt-10 text-center text-base font-medium text-white" role="status">
            Спасибо! Мы свяжемся с вами.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-5 md:mt-12 md:space-y-6">
            {err ? (
              <p className="text-center text-sm text-red-400" role="alert">
                {err}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              <div>
                <label htmlFor={`${formId}-brand`} className={labelClass}>
                  Марка автомобиля
                </label>
                <input
                  id={`${formId}-brand`}
                  name="car_brand_part"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Укажите марку"
                  autoComplete="off"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor={`${formId}-model`} className={labelClass}>
                  Модель автомобиля
                </label>
                <input
                  id={`${formId}-model`}
                  name="car_model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Укажите модель"
                  autoComplete="off"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor={`${formId}-year`} className={labelClass}>
                Год выпуска
              </label>
              <input
                id={`${formId}-year`}
                name="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Укажите год выпуска автомобиля"
                inputMode="numeric"
                autoComplete="off"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`${formId}-mileage`} className={labelClass}>
                Пробег
              </label>
              <select
                id={`${formId}-mileage`}
                name="mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                required
                className={`${fieldClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                }}
              >
                {MILEAGE_OPTIONS.map((o) => (
                  <option key={o.value || "empty"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className={labelClass}>Количество владельцев по ПТС</span>
              <div className="flex max-w-xs items-center gap-3">
                <button
                  type="button"
                  onClick={() => bumpOwners(-1)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/30 text-lg font-medium text-white transition hover:bg-white/10"
                  aria-label="Уменьшить"
                >
                  −
                </button>
                <div className="flex h-10 min-w-[3rem] flex-1 items-center justify-center rounded bg-white text-center text-base font-semibold text-neutral-900">
                  {ownersPts}
                </div>
                <button
                  type="button"
                  onClick={() => bumpOwners(1)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-white/30 text-lg font-medium text-white transition hover:bg-white/10"
                  aria-label="Увеличить"
                >
                  +
                </button>
              </div>
            </div>

            <fieldset className="border-0 p-0">
              <legend className={labelClass}>Выберите город</legend>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <input
                    type="radio"
                    name={`${formId}-city`}
                    checked={cityMode === "orenburg"}
                    onChange={() => setCityMode("orenburg")}
                    className="h-4 w-4 border-2 border-white bg-transparent text-white accent-white"
                  />
                  Оренбург
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                    <input
                      type="radio"
                      name={`${formId}-city`}
                      checked={cityMode === "other"}
                      onChange={() => setCityMode("other")}
                      className="h-4 w-4 border-2 border-white bg-transparent accent-white"
                    />
                    Другой город
                  </label>
                  {cityMode === "other" ? (
                    <input
                      value={otherCity}
                      onChange={(e) => setOtherCity(e.target.value)}
                      placeholder="Название города"
                      className={`${fieldClass} max-w-xs sm:ml-2`}
                      aria-label="Название города"
                    />
                  ) : null}
                </div>
              </div>
            </fieldset>

            <div>
              <label htmlFor={`${formId}-name`} className={labelClass}>
                Имя
              </label>
              <input
                id={`${formId}-name`}
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                autoComplete="name"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor={`${formId}-phone`} className={labelClass}>
                Телефон
              </label>
              <div className="flex overflow-hidden rounded bg-white ring-1 ring-inset ring-neutral-200 focus-within:ring-2 focus-within:ring-ac-vykup-cta">
                <span className="flex shrink-0 items-center gap-1 border-r border-neutral-200 bg-neutral-50 px-2.5 text-sm font-medium text-neutral-700">
                  <RuFlagIcon className="shrink-0" />
                  +7
                </span>
                <input
                  id={`${formId}-phone`}
                  name="phone"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(000) 000-00-00"
                  autoComplete="tel"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            {needCaptcha ? (
              <div className="flex justify-center pt-2">
                <TurnstileField
                  key={captchaMountKey}
                  siteKey={turnstileSiteKey}
                  onToken={onTok}
                  variant="light"
                />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={sending || !captchaOk}
              className="w-full rounded bg-ac-vykup-cta py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
            >
              {sending ? "Отправка…" : "Отправить"}
            </button>

            <p className="text-center text-xs leading-relaxed text-white/75 md:text-sm">
              Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с{" "}
              <Link
                to="/page/politika-konfidencialnosti"
                className="text-white underline underline-offset-2 hover:text-white/90"
              >
                политикой конфиденциальности
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}
