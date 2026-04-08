import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createApplication } from "../api/publicApi.js";
import { TurnstileField } from "./TurnstileField.jsx";
import { RuFlagIcon } from "./icons/RuFlagIcon.jsx";
import { normalizePhoneForApi, validateCity, validateName, validatePhone } from "../utils/applicationValidation.js";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
const fieldClass =
  "w-full rounded border-0 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-ac-vykup-cta";
const labelClass = "mb-1.5 block text-left text-sm font-medium text-white";

/**
 * Модалка заявки по кнопке «Оставить заявку» у карточки услуги (ОСАГО, КАСКО…).
 * @param {{ modalTitle: string, messageProduct: string } | null} props.context
 */
export function InsuranceServiceRequestModal({ context, onClose }) {
  const dialogId = useId();
  const titleId = `${dialogId}-ins-title`;
  const formId = dialogId;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityMode, setCityMode] = useState("orenburg");
  const [otherCity, setOtherCity] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaMountKey, setCaptchaMountKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const nameInputRef = useRef(null);

  const open = Boolean(context);
  const onTok = useCallback((t) => setTurnstileToken(t || ""), []);
  const needCaptcha = Boolean(turnstileSiteKey);
  const captchaOk = !needCaptcha || Boolean(turnstileToken);

  const dismiss = useCallback(() => {
    onClose();
    setDone(false);
    setErr("");
    setName("");
    setPhone("");
    setCityMode("orenburg");
    setOtherCity("");
    setTurnstileToken("");
    setCaptchaMountKey((k) => k + 1);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && dismiss();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => nameInputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(t);
    };
  }, [open, dismiss]);

  function cityLine() {
    if (cityMode === "orenburg") return "Оренбург";
    if (cityMode === "samara") return "Самара";
    return otherCity.trim();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const cityErr = validateCity(cityMode, otherCity);
    if (cityErr) return setErr(cityErr);
    const nameErr = validateName(name);
    if (nameErr) return setErr(nameErr);
    const phoneErr = validatePhone(phone);
    if (phoneErr) return setErr(phoneErr);
    if (needCaptcha && !turnstileToken) {
      setErr("Подтвердите, что вы не робот");
      return;
    }
    if (!context) return;
    setSending(true);
    try {
      await createApplication({
        type: "callback",
        name: name.trim(),
        phone: normalizePhoneForApi(phone),
        message: `Заявка: ${context.messageProduct}\nГород: ${cityLine()}`,
        turnstile_token: turnstileToken || "",
      });
      setDone(true);
      setTurnstileToken("");
      setCaptchaMountKey((k) => k + 1);
      window.setTimeout(() => dismiss(), 1800);
    } catch (er) {
      setErr(er.response?.data?.error || "Ошибка отправки");
      setCaptchaMountKey((k) => k + 1);
      setTurnstileToken("");
    } finally {
      setSending(false);
    }
  }

  if (!open || !context) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[min(96vh,900px)] w-full max-w-[440px] overflow-y-auto rounded-2xl bg-[#13344C] p-6 shadow-xl md:p-8"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition hover:bg-white/20"
          aria-label="Закрыть"
        >
          ×
        </button>

        <h2 id={titleId} className="pr-10 text-center text-lg font-bold leading-snug text-white md:text-xl">
          {context.modalTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-center text-sm text-white/90">
          Заполните форму ниже и наш специалист свяжется с вами в ближайшее время для уточнения деталей
        </p>

        {done ? (
          <p className="mt-10 text-center text-base font-medium text-white" role="status">
            Спасибо! Мы свяжемся с вами.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            {err ? (
              <p className="text-center text-sm text-red-300" role="alert">
                {err}
              </p>
            ) : null}

            <div>
              <label htmlFor={`${formId}-name`} className={labelClass}>
                Имя
              </label>
              <input
                ref={nameInputRef}
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
                <div className="flex flex-col gap-2">
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
                      className={fieldClass}
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
            <p className="text-center text-xs leading-relaxed text-white/75">
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
    </div>
  );
}
