import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createApplication, fetchVehicles } from "../api/publicApi.js";
import { TurnstileField } from "./TurnstileField.jsx";
import { RuFlagIcon } from "./icons/RuFlagIcon.jsx";
import { LEAD_MODAL_OPEN_EVENT } from "../utils/leadModalEvents.js";

const STORAGE_DISMISS = "ac_lead_modal_dismissed";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";

/** Задержка показа (мс). */
const delayMs = Number(import.meta.env.VITE_LEAD_MODAL_DELAY_MS) || 10_000;

/** true — не показывать модалку (удобно в разработке). */
const modalDisabled = import.meta.env.VITE_LEAD_MODAL_DISABLED === "true";

/** URL шапки модалки: по умолчанию статика из public/. */
const defaultHeaderSrc =
  (import.meta.env.VITE_LEAD_MODAL_IMAGE_URL || "").trim() || `${import.meta.env.BASE_URL}lead-modal-header.png`;

/**
 * Всплывающая заявка «обратный звонок» после паузы — как на ac-auto56.
 * Данные только на бэк; тексты формы статичны по макету.
 */
export function LeadCaptureModal() {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [headerFallbackSrc, setHeaderFallbackSrc] = useState("");
  const [headerTryIdx, setHeaderTryIdx] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaMountKey, setCaptchaMountKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  /** Контекст с кнопки «заявка на услугу» — id попадёт в message для менеджеров. */
  const [leadContext, setLeadContext] = useState(null);
  const nameInputRef = useRef(null);
  const headerCandidates = [defaultHeaderSrc, headerFallbackSrc].filter(Boolean);
  const headerSrc = headerCandidates[headerTryIdx] || "";

  const onTok = useCallback((t) => setTurnstileToken(t || ""), []);
  const needCaptcha = Boolean(turnstileSiteKey);
  const captchaOk = !needCaptcha || Boolean(turnstileToken);

  const dismiss = useCallback(() => {
    setOpen(false);
    setLeadContext(null);
    try {
      sessionStorage.setItem(STORAGE_DISMISS, "1");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchVehicles()
      .then((rows) => {
        if (cancelled) return;
        const firstPhoto = (Array.isArray(rows) ? rows : [])
          .flatMap((v) => (Array.isArray(v.images) ? v.images : []))
          .map((u) => String(u || "").trim())
          .find(Boolean);
        setHeaderFallbackSrc(firstPhoto || "");
      })
      .catch(() => {
        if (!cancelled) setHeaderFallbackSrc("");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Ручное открытие (шапка услуги и т.д.) — не зависит от «уже закрывал модалку». */
  useEffect(() => {
    const onManualOpen = (e) => {
      const d = e.detail || {};
      const sid = d.serviceId;
      const ctx = {};
      if (sid != null && Number.isFinite(Number(sid))) ctx.serviceId = Number(sid);
      if (d.contextLabel && String(d.contextLabel).trim()) ctx.contextLabel = String(d.contextLabel).trim();
      setLeadContext(Object.keys(ctx).length ? ctx : null);
      setOpen(true);
    };
    window.addEventListener(LEAD_MODAL_OPEN_EVENT, onManualOpen);
    return () => window.removeEventListener(LEAD_MODAL_OPEN_EVENT, onManualOpen);
  }, []);

  useEffect(() => {
    if (modalDisabled) return;
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(STORAGE_DISMISS) === "1") return;
    const t = window.setTimeout(() => setOpen(true), delayMs);
    return () => window.clearTimeout(t);
  }, [modalDisabled, delayMs]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const focusT = window.setTimeout(() => nameInputRef.current?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      window.clearTimeout(focusT);
    };
  }, [open, dismiss]);

  useEffect(() => {
    if (open) setHeaderTryIdx(0);
  }, [open]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (needCaptcha && !turnstileToken) {
      setErr("Подтвердите, что вы не робот");
      return;
    }
    setSending(true);
    try {
      const msgParts = ["Город: Оренбург"];
      if (leadContext?.serviceId != null) {
        msgParts.push(`Услуга id: ${leadContext.serviceId}`);
      }
      if (leadContext?.contextLabel) {
        msgParts.push(leadContext.contextLabel);
      }
      await createApplication({
        type: "callback",
        name: name.trim(),
        phone: phone.trim(),
        message: msgParts.join(". "),
        turnstile_token: turnstileToken || "",
      });
      setDone(true);
      setTurnstileToken("");
      setCaptchaMountKey((k) => k + 1);
      try {
        sessionStorage.setItem(STORAGE_DISMISS, "1");
      } catch {
        /* ignore */
      }
      window.setTimeout(() => {
        setOpen(false);
        setDone(false);
        setName("");
        setPhone("");
        setLeadContext(null);
      }, 1800);
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {/* Крестик — в макете может не быть, но без него модалку не закрыть кроме Escape */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg text-neutral-600 shadow-sm transition hover:bg-white hover:text-neutral-900"
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200">
          {headerSrc ? (
            <img
              src={headerSrc}
              alt=""
              className="h-full w-full object-cover object-center"
              onError={() => setHeaderTryIdx((i) => i + 1)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-neutral-300 text-sm text-neutral-500">
              Изображение временно недоступно
            </div>
          )}
        </div>

        <div className="px-6 pb-6 pt-5 text-center">
          <h2 id={titleId} className="text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
            Не нашли нужный автомобиль?
            <br />
            Мы поможем!
          </h2>
          <p className="mt-3 text-sm text-neutral-700">
            Заполните форму ниже и наш специалист поможет Вам!
          </p>

          {done ? (
            <p className="mt-8 text-sm font-medium text-green-700" role="status">
              Спасибо! Мы скоро перезвоним.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4 text-left">
              {err && (
                <p className="text-center text-sm text-red-600" role="alert">
                  {err}
                </p>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-neutral-800">Ваше имя</span>
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
                <span className="mb-1.5 block text-sm font-medium text-neutral-800">Ваш телефон</span>
                <div className="flex items-stretch overflow-hidden rounded border border-neutral-300 bg-white transition focus-within:border-ac-red focus-within:ring-1 focus-within:ring-ac-red">
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
                className="ac-btn-primary mt-2 w-full rounded-lg py-3.5 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-50"
              >
                {sending ? "Отправка…" : "Заказать звонок"}
              </button>

              <p className="pt-1 text-center text-xs leading-relaxed text-neutral-500">
                Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с{" "}
                <Link to="/page/politika-konfidencialnosti" className="text-ac-red underline-offset-2 hover:underline">
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
