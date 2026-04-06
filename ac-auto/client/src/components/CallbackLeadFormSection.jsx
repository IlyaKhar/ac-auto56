import { useCallback, useId, useState } from "react";
import { Link } from "react-router-dom";
import { createApplication } from "../api/publicApi.js";
import { TurnstileField } from "./TurnstileField.jsx";
import { RuFlagIcon } from "./icons/RuFlagIcon.jsx";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
const fieldClass =
  "w-full rounded border-0 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-ac-vykup-cta";
const labelClass = "mb-1.5 block text-left text-sm font-medium text-white";

/**
 * Универсальная тёмная форма: имя, телефон, город (2 или 3 варианта), заявка в API.
 * @param {"two"|"three"} props.cityVariant — два города (Оренбург/другой) или + Самара
 */
export function CallbackLeadFormSection({
  anchorId,
  title,
  subtitle,
  messagePrefix,
  cityVariant = "two",
  sectionClassName = "scroll-mt-28 bg-[#121212] py-14 md:py-20",
}) {
  const formId = useId();
  const titleId = `${formId}-callback-lead-title`;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityMode, setCityMode] = useState("orenburg");
  const [otherCity, setOtherCity] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaMountKey, setCaptchaMountKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const onTok = useCallback((t) => setTurnstileToken(t || ""), []);
  const needCaptcha = Boolean(turnstileSiteKey);
  const captchaOk = !needCaptcha || Boolean(turnstileToken);

  function cityLine() {
    if (cityMode === "orenburg") return "Оренбург";
    if (cityMode === "samara") return "Самара";
    return otherCity.trim();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (cityMode === "other" && !otherCity.trim()) {
      setErr("Укажите город");
      return;
    }
    if (needCaptcha && !turnstileToken) {
      setErr("Подтвердите, что вы не робот");
      return;
    }
    setSending(true);
    try {
      await createApplication({
        type: "callback",
        name: name.trim(),
        phone: phone.trim(),
        message: `${messagePrefix}\nГород: ${cityLine()}`,
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
    <section id={anchorId} className={sectionClassName} aria-labelledby={titleId}>
      <div className="mx-auto max-w-lg px-4 md:px-6">
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

            <fieldset className="border-0 p-0">
              <legend className={labelClass}>Выберите город</legend>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <input
                    type="radio"
                    name={`${formId}-city`}
                    checked={cityMode === "orenburg"}
                    onChange={() => setCityMode("orenburg")}
                    className="h-4 w-4 border-2 border-white bg-transparent accent-white"
                  />
                  Оренбург
                </label>
                {cityVariant === "three" ? (
                  <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                    <input
                      type="radio"
                      name={`${formId}-city`}
                      checked={cityMode === "samara"}
                      onChange={() => setCityMode("samara")}
                      className="h-4 w-4 border-2 border-white bg-transparent accent-white"
                    />
                    Самара
                  </label>
                ) : null}
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
