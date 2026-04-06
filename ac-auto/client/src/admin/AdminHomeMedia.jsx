import { useCallback, useEffect, useState } from "react";
import { adminHomeMedia } from "../api/adminApi.js";
import { ErrBox, apiErr, btnPrimary, fieldClass } from "./shared.jsx";

const OUR_LEN = 8;
const INSPECTION_LEN = 6;
const OWNERS_LEN = 9;
const INSURANCE_LEN = 4;

function emptyList(n) {
  return Array.from({ length: n }, () => "");
}

function normalizeList(arr, n) {
  const src = Array.isArray(arr) ? arr : [];
  const out = emptyList(n);
  for (let i = 0; i < n; i++) out[i] = typeof src[i] === "string" ? src[i] : "";
  return out;
}

function SlotsEditor({ title, hint, values, onChange, placeholder }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <div className="mt-3 space-y-2">
        {values.map((v, i) => (
          <label key={i} className="block text-xs text-slate-500">
            Слот {i + 1}
            <input
              className={fieldClass}
              value={v}
              onChange={(e) => onChange((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
              placeholder={placeholder}
              autoComplete="off"
            />
          </label>
        ))}
      </div>
    </section>
  );
}

export default function AdminHomeMedia() {
  const [ourServices, setOurServices] = useState(() => emptyList(OUR_LEN));
  const [carInspection, setCarInspection] = useState(() => emptyList(INSPECTION_LEN));
  const [happyOwners, setHappyOwners] = useState(() => emptyList(OWNERS_LEN));
  const [insuranceServices, setInsuranceServices] = useState(() => emptyList(INSURANCE_LEN));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setErr("");
    try {
      const d = await adminHomeMedia.get();
      setOurServices(normalizeList(d?.our_services, OUR_LEN));
      setCarInspection(normalizeList(d?.car_inspection, INSPECTION_LEN));
      setHappyOwners(normalizeList(d?.happy_owners, OWNERS_LEN));
      setInsuranceServices(normalizeList(d?.insurance_services, INSURANCE_LEN));
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSave(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await adminHomeMedia.put({
        our_services: ourServices.map((v) => String(v || "").trim()),
        car_inspection: carInspection.map((v) => String(v || "").trim()),
        happy_owners: happyOwners.map((v) => String(v || "").trim()),
        insurance_services: insuranceServices.map((v) => String(v || "").trim()),
      });
      await load();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl space-y-6 p-6 text-slate-100">
      <h1 className="text-xl font-semibold">Главная — фото блоков</h1>
      <p className="text-sm text-slate-400">
        Вставляй пути из <code className="text-slate-300">client/public</code> (например{" "}
        <code className="text-slate-300">/home/our-1.jpg</code>) или полный URL{" "}
        <code className="text-slate-300">https://…</code>.
      </p>
      {err ? <ErrBox message={err} /> : null}

      {loading ? (
        <p className="text-slate-500">Загрузка…</p>
      ) : (
        <form onSubmit={onSave} className="space-y-4">
          <SlotsEditor
            title="Наши услуги (8)"
            hint="Порядок совпадает с карточками в секции."
            values={ourServices}
            onChange={setOurServices}
            placeholder="/services/our-1.jpg"
          />
          <SlotsEditor
            title="Как мы проверяем автомобиль (6)"
            hint="Порядок: двигатель, кузов, салон, ходовая, диагностика, документы."
            values={carInspection}
            onChange={setCarInspection}
            placeholder="/car-inspection/custom-1.jpg"
          />
          <SlotsEditor
            title="Счастливые обладатели наших машин (9)"
            hint="Порядок слотов коллажа слева направо по текущему шаблону."
            values={happyOwners}
            onChange={setHappyOwners}
            placeholder="/happy-owners/custom-1.jpg"
          />
          <SlotsEditor
            title="Услуги страхования от «ACT AUTO» (4)"
            hint="Порядок: ОСАГО, КАСКО, Страхование жизни, GAP."
            values={insuranceServices}
            onChange={setInsuranceServices}
            placeholder="/insurance-services/custom-1.jpg"
          />
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </form>
      )}
    </div>
  );
}
