import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createApplication } from "../api/publicApi.js";
import { TurnstileField } from "./TurnstileField.jsx";
import { RuFlagIcon } from "./icons/RuFlagIcon.jsx";

const base = import.meta.env.BASE_URL || "/";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

const headerSrc =
  (import.meta.env.VITE_TRADE_MODAL_IMAGE || "").trim() || `${base}trade-modal-header.png`;

/**
 * Модалка по кнопке «Узнать подробнее»: смена авто, город Оренбург / другой + ввод.
 * Отправка на тот же POST /applications (callback).
 */
export function TradeInConsultModal({ open, onClose }) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityMode, setCityMode] = useState("other");
  const [otherCity, setOtherCity] = useState("");
  const [imgBroken, setImgBroken] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaMountKey, setCaptchaMountKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const nameInputRef = useRef(null);

  const onTok = useCallback((t) => setTurnstileToken(t || ""), []);
  const needCaptcha = Boolean(turnstileSiteKey);
  const captchaOk = !needCaptcha || Boolean(turnstileToken);

  const dismiss = useCallback(() => {
    onClose();
    setDone(false);
    setErr("");
    setName("");
    setPhone("");
    setOtherCity("");
    setCityMode("other");
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
    const cityLine =
      cityMode === "orenburg" ? "Оренбург" : otherCity.trim();
    setSending(true);
    try {
      await createApplication({
        type: "callback",
        name: name.trim(),
        phone: phone.trim(),
        message: `Герой «Узнать подробнее». Город: ${cityLine}`,
        turnstile_token: turnstileToken || "",
      });
      setDone(true);
      setTurnstileToken("");
      setCaptchaMountKey((k) => k + 1);
      window.setTimeout(() => {
        dismiss();
      }, 2000);
    } catch (er) {
      setErr(er.response?.data?.error || "Ошибка отправки");
      setCaptchaMountKey((k) => k + 1);
      setTurnstileToken("");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

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
        className="relative max-h-[min(96vh,900px)] w-full max-w-[420px] overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-neutral-600 shadow-sm transition hover:bg-white"
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-200">
          {!imgBroken ? (
            <img
              src={headerSrc}
              alt=""
              className="h-full w-full object-cover object-center"
              onError={() => setImgBroken(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs text-neutral-500">
              Добавьте <code className="mx-1 rounded bg-white px-1">public/trade-modal-header.png</code>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-5 text-center">
          <h2 id={titleId} className="text-xl font-bold text-neutral-900">
            Хотите сменить автомобиль?
          </h2>
          <p className="mt-3 text-sm text-neutral-800">
            Оставьте заявку прямо сейчас и наш специалист проконсультирует Вас по любым вопросам
          </p>

          {done ? (
            <p className="mt-8 text-sm font-medium text-green-700" role="status">
              Спасибо! Мы свяжемся с вами.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4 text-left">
              {err && (
                <p className="text-center text-sm text-red-600" role="alert">
                  {err}
                </p>
              )}

              <label className="block">
                <input
                  ref={nameInputRef}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя"
                  autoComplete="name"
                  className="ac-input w-full"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-neutral-800">Телефон</span>
                <div className="flex items-stretch overflow-hidden rounded border border-neutral-300 bg-white transition focus-within:border-ac-bright-orange focus-within:ring-1 focus-within:ring-ac-bright-orange">
                  <span className="flex shrink-0 items-center border-r border-neutral-200 bg-neutral-50 px-2.5">
                    <RuFlagIcon className="shrink-0" />
                  </span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (000) 000-00-00"
                    autoComplete="tel"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-neutral-900 outline-none"
                  />
                </div>
              </label>

              <fieldset className="border-0 p-0">
                <legend className="mb-2 text-sm font-medium text-neutral-800">Выберите город:</legend>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                    <input
                      type="radio"
                      name="trade-city"
                      checked={cityMode === "orenburg"}
                      onChange={() => setCityMode("orenburg")}
                      className="h-4 w-4 accent-neutral-900"
                    />
                    Оренбург
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                      <input
                        type="radio"
                        name="trade-city"
                        checked={cityMode === "other"}
                        onChange={() => setCityMode("other")}
                        className="h-4 w-4 accent-neutral-900"
                      />
                      Другой город
                    </label>
                    {cityMode === "other" && (
                      <input
                        value={otherCity}
                        onChange={(e) => setOtherCity(e.target.value)}
                        placeholder="Название города"
                        className="ac-input min-w-[10rem] flex-1 border-b border-t-0 border-l-0 border-r-0 border-neutral-400 bg-transparent px-0 py-1 focus:border-ac-bright-orange focus:ring-0"
                        aria-label="Ваш город"
                      />
                    )}
                  </div>
                </div>
              </fieldset>

              {needCaptcha && (
                <div className="flex justify-center pt-1">
                  <TurnstileField
                    key={captchaMountKey}
                    siteKey={turnstileSiteKey}
                    onToken={onTok}
                    variant="light"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={sending || !captchaOk}
                className="w-full rounded-lg bg-ac-bright-orange py-3.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
              >
                {sending ? "Отправка…" : "Свяжитесь со мной"}
              </button>

              <p className="pt-1 text-center text-xs leading-relaxed text-neutral-500">
                Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с{" "}
                <Link
                  to="/page/politika-konfidencialnosti"
                  className="text-ac-bright-orange underline-offset-2 hover:underline"
                >
                  политикой конфиденциальности
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
