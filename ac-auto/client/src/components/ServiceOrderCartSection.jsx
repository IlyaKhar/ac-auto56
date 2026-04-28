import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createApplication } from "../api/publicApi.js";
import { TurnstileField } from "./TurnstileField.jsx";
import { RuFlagIcon } from "./icons/RuFlagIcon.jsx";
import { normalizePhoneForApi, validateName, validatePhone } from "../utils/applicationValidation.js";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
const labelClass = "mb-1.5 block text-left text-sm font-medium text-white";
const fieldClass =
  "w-full rounded border-0 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none ring-1 ring-inset ring-neutral-200 placeholder:text-neutral-400 focus:ring-2 focus:ring-ac-vykup-cta";

const PAYMENT_OPTIONS = [
  { value: "", label: "Выберите способ оплаты" },
  { value: "cash", label: "Наличными" },
  { value: "card", label: "Картой" },
  { value: "invoice", label: "По счету" },
];

const TIME_OPTIONS = [
  { value: "", label: "Выберите время" },
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
].map((v) => (typeof v === "string" ? { value: v, label: v } : v));

const CARWASH_SERVICE_OPTIONS = [
  { value: "", label: "Выберите услугу" },
  { value: "body_wash", label: "Мойка кузова" },
  { value: "full_wash", label: "Комплексная мойка" },
  { value: "detailing", label: "Детейлинг" },
];

const CARWASH_TYPE_OPTIONS = [
  { value: "", label: "Выберите тип мойки" },
  { value: "contact", label: "Контактная" },
  { value: "touchless", label: "Бесконтактная" },
  { value: "express", label: "Экспресс" },
];

const CAR_BODY_OPTIONS = [
  { value: "", label: "Выберите тип кузова" },
  { value: "sedan", label: "Седан" },
  { value: "hatchback", label: "Хэтчбек" },
  { value: "suv", label: "Кроссовер / внедорожник" },
  { value: "van", label: "Минивэн / фургон" },
];

const DETAILING_OPTIONS = [
  { value: "", label: "Выберите пакет детейлинга" },
  { value: "interior", label: "Химчистка салона" },
  { value: "polish", label: "Полировка кузова" },
  { value: "complex", label: "Комплекс детейлинга" },
];

const MOLYARN_SERVICE_OPTIONS = [
  { value: "", label: "Выберите услугу" },
  { value: "paint", label: "Покраска детали" },
  { value: "local_repair", label: "Локальный ремонт" },
  { value: "polish", label: "Полировка" },
];

const MOLYARN_WORK_OPTIONS = [
  { value: "", label: "Что нужно сделать" },
  { value: "scratch", label: "Убрать царапины" },
  { value: "chip", label: "Убрать сколы" },
  { value: "paint_restore", label: "Восстановить ЛКП" },
  { value: "full_detail", label: "Полный цикл работ" },
];

const STEP_TITLES = [
  "Выбор услуги",
  "Параметры",
  "Дата и оплата",
  "Контакты",
];

const SERVICE_LABELS = {
  body_wash: "Мойка кузова",
  full_wash: "Комплексная мойка",
  detailing: "Детейлинг",
  paint: "Покраска детали",
  local_repair: "Локальный ремонт",
  polish: "Полировка",
};

function todayLocalDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function validateOrderForm({
  service,
  appointmentDate,
  appointmentTime,
  paymentMethod,
  name,
  phone,
  serviceType,
  carBodyType,
  detailingPackage,
  workType,
  detailCount,
}) {
  if (!service) return "Выберите услугу";
  if (!appointmentDate) return "Выберите дату записи";
  if (!appointmentTime) return "Выберите время записи";
  if (!paymentMethod) return "Выберите способ оплаты";
  const nameErr = validateName(name);
  if (nameErr) return nameErr;
  const phoneErr = validatePhone(phone);
  if (phoneErr) return phoneErr;

  if (service === "body_wash" || service === "full_wash") {
    if (!serviceType) return "Выберите тип мойки";
    if (!carBodyType) return "Выберите тип кузова";
  }
  if (service === "detailing" && !detailingPackage) return "Выберите пакет детейлинга";
  if (serviceType === "local_repair" || serviceType === "paint" || serviceType === "polish") {
    if (!workType) return "Выберите, что нужно сделать";
    if (!Number.isFinite(detailCount) || detailCount < 1) return "Укажите количество деталей";
  }

  return "";
}

export function ServiceOrderCartSection({
  anchorId,
  title,
  subtitle,
  messagePrefix,
  mode, // "carwash" | "molyarn"
  initialService = "",
}) {
  const formId = useId();
  const titleId = `${formId}-service-order-title`;
  const [service, setService] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [carBodyType, setCarBodyType] = useState("");
  const [detailingPackage, setDetailingPackage] = useState("");
  const [workType, setWorkType] = useState("");
  const [detailCount, setDetailCount] = useState(1);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaMountKey, setCaptchaMountKey] = useState(0);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [step, setStep] = useState(1);

  const onTok = useCallback((t) => setTurnstileToken(t || ""), []);
  const needCaptcha = Boolean(turnstileSiteKey);
  const captchaOk = !needCaptcha || Boolean(turnstileToken);
  const minDate = useMemo(() => todayLocalDate(), []);

  const isCarwash = mode === "carwash";
  const serviceOptions = isCarwash ? CARWASH_SERVICE_OPTIONS : MOLYARN_SERVICE_OPTIONS;
  const showCarwashDetails = isCarwash && (service === "body_wash" || service === "full_wash");
  const showDetailingDetails = isCarwash && service === "detailing";
  const showMolyarnDetails = !isCarwash && Boolean(service);
  const serviceLabel = SERVICE_LABELS[service] ?? service;

  useEffect(() => {
    setService(initialService || "");
    setServiceType("");
    setCarBodyType("");
    setDetailingPackage("");
    setWorkType("");
    setDetailCount(1);
    setErr("");
    setStep(1);
  }, [initialService, mode]);

  function validateStep(currentStep) {
    if (currentStep === 1) {
      if (!service) return "Выберите услугу";
      return "";
    }
    if (currentStep === 2) {
      if (showCarwashDetails) {
        if (!serviceType) return "Выберите тип мойки";
        if (!carBodyType) return "Выберите тип кузова";
      }
      if (showDetailingDetails && !detailingPackage) return "Выберите пакет детейлинга";
      if (showMolyarnDetails) {
        if (!workType) return "Выберите, что нужно сделать";
        if (!Number.isFinite(detailCount) || detailCount < 1) return "Укажите количество деталей";
      }
      return "";
    }
    if (currentStep === 3) {
      if (!appointmentDate) return "Выберите дату записи";
      if (!appointmentTime) return "Выберите время записи";
      if (!paymentMethod) return "Выберите способ оплаты";
      return "";
    }
    if (currentStep === 4) {
      const nameErr = validateName(name);
      if (nameErr) return nameErr;
      const phoneErr = validatePhone(phone);
      if (phoneErr) return phoneErr;
      if (needCaptcha && !turnstileToken) return "Подтвердите, что вы не робот";
      return "";
    }
    return "";
  }

  function goNextStep() {
    const stepErr = validateStep(step);
    if (stepErr) {
      setErr(stepErr);
      return;
    }
    setErr("");
    setStep((s) => Math.min(4, s + 1));
  }

  function goPrevStep() {
    setErr("");
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const formErr = validateOrderForm({
      service,
      appointmentDate,
      appointmentTime,
      paymentMethod,
      name,
      phone,
      serviceType: isCarwash ? service : service,
      carBodyType,
      detailingPackage,
      workType,
      detailCount,
    });
    if (formErr) return setErr(formErr);
    if (needCaptcha && !turnstileToken) return setErr("Подтвердите, что вы не робот");

    const details = [
      messagePrefix,
      `Услуга: ${service}`,
      showCarwashDetails ? `Тип мойки: ${serviceType}` : "",
      showCarwashDetails ? `Тип кузова: ${carBodyType}` : "",
      showDetailingDetails ? `Пакет детейлинга: ${detailingPackage}` : "",
      showMolyarnDetails ? `Тип работ: ${workType}` : "",
      showMolyarnDetails ? `Количество деталей: ${detailCount}` : "",
      `Дата записи: ${appointmentDate}`,
      `Время записи: ${appointmentTime}`,
      `Оплата: ${paymentMethod}`,
    ]
      .filter(Boolean)
      .join(" | ");

    setSending(true);
    try {
      await createApplication({
        type: "callback",
        name: name.trim(),
        phone: normalizePhoneForApi(phone),
        message: details,
        turnstile_token: turnstileToken || "",
      });
      setDone(true);
      setTurnstileToken("");
      setCaptchaMountKey((k) => k + 1);
    } catch (er) {
      setErr(er.response?.data?.error || "Ошибка отправки");
      setTurnstileToken("");
      setCaptchaMountKey((k) => k + 1);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id={anchorId} className="scroll-mt-28 bg-[#121212] py-14 md:py-20" aria-labelledby={titleId}>
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <h2
          id={titleId}
          className="text-center text-base font-bold uppercase leading-snug tracking-[0.06em] text-white sm:text-lg md:text-xl"
        >
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/90 md:text-base">{subtitle}</p>

        {done ? (
          <p className="mt-10 text-center text-base font-medium text-white" role="status">
            Спасибо! Заявка принята, подтвердим запись в ближайшее время.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-5 md:mt-12 md:space-y-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {STEP_TITLES.map((stepTitle, idx) => {
                const n = idx + 1;
                const active = n === step;
                const passed = n < step;
                return (
                  <div
                    key={stepTitle}
                    className={`rounded px-2 py-2 text-center text-xs font-bold uppercase tracking-wide ${
                      active
                        ? "bg-ac-vykup-cta text-white"
                        : passed
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-white/70"
                    }`}
                  >
                    {n}. {stepTitle}
                  </div>
                );
              })}
            </div>

            {err ? (
              <p className="text-center text-sm text-red-400" role="alert">
                {err}
              </p>
            ) : null}

            {step === 1 ? (
              <div>
                <label htmlFor={`${formId}-service`} className={labelClass}>
                  Услуга
                </label>
                <select
                  id={`${formId}-service`}
                  value={service}
                  onChange={(e) => {
                    setService(e.target.value);
                    setServiceType("");
                    setCarBodyType("");
                    setDetailingPackage("");
                    setWorkType("");
                    setDetailCount(1);
                  }}
                  className={fieldClass}
                >
                  {serviceOptions.map((o) => (
                    <option key={o.value || "empty"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {step === 2 && showCarwashDetails ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <div>
                  <label htmlFor={`${formId}-wash-type`} className={labelClass}>
                    Тип мойки
                  </label>
                  <select
                    id={`${formId}-wash-type`}
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className={fieldClass}
                  >
                    {CARWASH_TYPE_OPTIONS.map((o) => (
                      <option key={o.value || "empty"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-body-type`} className={labelClass}>
                    Тип кузова
                  </label>
                  <select
                    id={`${formId}-body-type`}
                    value={carBodyType}
                    onChange={(e) => setCarBodyType(e.target.value)}
                    className={fieldClass}
                  >
                    {CAR_BODY_OPTIONS.map((o) => (
                      <option key={o.value || "empty"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : null}

            {step === 2 && showDetailingDetails ? (
              <div>
                <label htmlFor={`${formId}-detailing`} className={labelClass}>
                  Пакет детейлинга
                </label>
                <select
                  id={`${formId}-detailing`}
                  value={detailingPackage}
                  onChange={(e) => setDetailingPackage(e.target.value)}
                  className={fieldClass}
                >
                  {DETAILING_OPTIONS.map((o) => (
                    <option key={o.value || "empty"} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            {step === 2 && showMolyarnDetails ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <div>
                  <label htmlFor={`${formId}-work-type`} className={labelClass}>
                    Что нужно сделать
                  </label>
                  <select
                    id={`${formId}-work-type`}
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value)}
                    className={fieldClass}
                  >
                    {MOLYARN_WORK_OPTIONS.map((o) => (
                      <option key={o.value || "empty"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-detail-count`} className={labelClass}>
                    Количество деталей
                  </label>
                  <input
                    id={`${formId}-detail-count`}
                    type="number"
                    min={1}
                    max={20}
                    value={detailCount}
                    onChange={(e) => setDetailCount(Math.max(1, Number(e.target.value) || 1))}
                    className={fieldClass}
                  />
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                  <div>
                    <label htmlFor={`${formId}-date`} className={labelClass}>
                      Дата записи
                    </label>
                    <input
                      id={`${formId}-date`}
                      type="date"
                      min={minDate}
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-time`} className={labelClass}>
                      Время записи
                    </label>
                    <select
                      id={`${formId}-time`}
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className={fieldClass}
                    >
                      {TIME_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={`${formId}-payment`} className={labelClass}>
                    Оплата
                  </label>
                  <select
                    id={`${formId}-payment`}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={fieldClass}
                  >
                    {PAYMENT_OPTIONS.map((o) => (
                      <option key={o.value || "empty"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <div className="rounded border border-white/20 bg-white/5 p-4 text-sm text-white/90">
                  <p className="text-xs font-bold uppercase tracking-wide text-white/70">Ваш заказ</p>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="text-white/70">Услуга:</span> {serviceLabel || "—"}
                    </p>
                    {showCarwashDetails ? (
                      <>
                        <p>
                          <span className="text-white/70">Тип мойки:</span> {serviceType || "—"}
                        </p>
                        <p>
                          <span className="text-white/70">Тип кузова:</span> {carBodyType || "—"}
                        </p>
                      </>
                    ) : null}
                    {showDetailingDetails ? (
                      <p>
                        <span className="text-white/70">Пакет детейлинга:</span> {detailingPackage || "—"}
                      </p>
                    ) : null}
                    {showMolyarnDetails ? (
                      <>
                        <p>
                          <span className="text-white/70">Тип работ:</span> {workType || "—"}
                        </p>
                        <p>
                          <span className="text-white/70">Количество деталей:</span> {detailCount}
                        </p>
                      </>
                    ) : null}
                    <p>
                      <span className="text-white/70">Дата и время:</span>{" "}
                      {appointmentDate && appointmentTime ? `${appointmentDate}, ${appointmentTime}` : "—"}
                    </p>
                    <p>
                      <span className="text-white/70">Оплата:</span> {paymentMethod || "—"}
                    </p>
                  </div>
                </div>

                <div>
                  <label htmlFor={`${formId}-name`} className={labelClass}>
                    Имя
                  </label>
                  <input
                    id={`${formId}-name`}
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
                    <TurnstileField key={captchaMountKey} siteKey={turnstileSiteKey} onToken={onTok} variant="light" />
                  </div>
                ) : null}
              </>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goPrevStep}
                disabled={step === 1}
                className="rounded border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Назад
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={goNextStep}
                  className="rounded bg-ac-vykup-cta px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:brightness-110"
                >
                  Далее
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={sending || !captchaOk}
                  className="rounded bg-ac-vykup-cta px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:brightness-110 disabled:opacity-50"
                >
                  {sending ? "Отправка..." : "Записаться и оплатить"}
                </button>
              )}
            </div>

            <p className="text-center text-xs leading-relaxed text-white/75 md:text-sm">
              Нажимая на кнопку, вы даете согласие на обработку персональных данных и соглашаетесь с{" "}
              <Link to="/page/politika-konfidencialnosti" className="text-white underline underline-offset-2 hover:text-white/90">
                политикой конфиденциальности
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

