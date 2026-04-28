import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ServiceOrderCartSection } from "../components/ServiceOrderCartSection.jsx";

function normalizeMode(raw) {
  return raw === "molyarn" ? "molyarn" : "carwash";
}

const ALLOWED_SERVICES = {
  carwash: new Set(["body_wash", "full_wash", "detailing"]),
  molyarn: new Set(["paint", "local_repair", "polish"]),
};

export default function ServiceOrderPage() {
  const [params, setParams] = useSearchParams();
  const mode = normalizeMode(params.get("mode"));
  const rawService = params.get("service") || "";
  const initialService = ALLOWED_SERVICES[mode].has(rawService) ? rawService : "";

  const content = useMemo(() => {
    if (mode === "molyarn") {
      return {
        title: "Корзина услуг малярно-кузовного цеха",
        subtitle: "Выберите вид работ, количество деталей, дату/время записи и способ оплаты",
        messagePrefix: "Заявка: малярно-кузовной цех ROSTOSH",
      };
    }
    return {
      title: "Корзина услуг автомойки и детейлинга",
      subtitle: "Выберите услугу, параметры, способ оплаты и удобные дату/время записи",
      messagePrefix: "Заявка: автомойка и детейлинг ROSTOSH",
    };
  }, [mode]);

  function setMode(nextMode) {
    setParams({ mode: nextMode });
  }

  return (
    <div className="bg-[#121212] py-8 md:py-10">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setMode("carwash")}
            className={`rounded px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
              mode === "carwash"
                ? "bg-ac-vykup-cta text-white"
                : "border border-white/30 text-white hover:bg-white/10"
            }`}
          >
            Автомойка / детейлинг
          </button>
          <button
            type="button"
            onClick={() => setMode("molyarn")}
            className={`rounded px-4 py-2 text-sm font-bold uppercase tracking-wide transition ${
              mode === "molyarn"
                ? "bg-ac-vykup-cta text-white"
                : "border border-white/30 text-white hover:bg-white/10"
            }`}
          >
            Малярно-кузовной цех
          </button>
        </div>
      </div>

      <ServiceOrderCartSection
        anchorId="service-order-form"
        title={content.title}
        subtitle={content.subtitle}
        messagePrefix={content.messagePrefix}
        mode={mode}
        initialService={initialService}
      />
    </div>
  );
}

