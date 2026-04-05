import { useState } from "react";
import {
  SALON_LOCATIONS_DATA_TEMPLATE,
} from "../components/SalonLocationsSection.jsx";
import { btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

/** Приводит произвольный data к структуре формы (для админки). */
export function parseSalonLocationsAdminData(data) {
  const d = data && typeof data === "object" ? data : {};
  const fallback = SALON_LOCATIONS_DATA_TEMPLATE.locations[0];
  const locs =
    Array.isArray(d.locations) && d.locations.length > 0
      ? d.locations
      : SALON_LOCATIONS_DATA_TEMPLATE.locations;
  return {
    title: typeof d.title === "string" && d.title.trim() ? d.title.trim() : SALON_LOCATIONS_DATA_TEMPLATE.title,
    locations: locs.map((loc) => ({
      image: String(loc.image ?? ""),
      city: String(loc.city ?? ""),
      street: String(loc.street ?? ""),
      phone: String(loc.phone ?? ""),
      yandex_maps_url: String(loc.yandex_maps_url ?? fallback.yandex_maps_url),
      gis_url: String(loc.gis_url ?? fallback.gis_url),
    })),
  };
}

function emptyLocationFromDefaults() {
  const f = SALON_LOCATIONS_DATA_TEMPLATE.locations[0];
  return {
    image: "",
    city: "",
    street: "",
    phone: "",
    yandex_maps_url: f.yandex_maps_url,
    gis_url: f.gis_url,
  };
}

/**
 * Форма блока salon_locations: заголовок, список адресов, без сырого JSON.
 */
export function SalonLocationsBlockEditor({ form, setForm }) {
  const [showJson, setShowJson] = useState(false);

  function updateLocation(i, field, value) {
    setForm((prev) => {
      const locations = prev.locations.map((row, j) => (j === i ? { ...row, [field]: value } : row));
      return { ...prev, locations };
    });
  }

  function addLocation() {
    setForm((prev) => ({
      ...prev,
      locations: [...prev.locations, emptyLocationFromDefaults()],
    }));
  }

  function removeLocation(i) {
    setForm((prev) => {
      if (prev.locations.length <= 1) return prev;
      return { ...prev, locations: prev.locations.filter((_, j) => j !== i) };
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Фото: загрузи файл в папку{" "}
        <code className="text-slate-300">client/public/locations/</code> на сервере сборки и укажи путь вида{" "}
        <code className="text-slate-300">/locations/имя.jpg</code>. Либо вставь полный URL картинки (https://…).
      </p>

      <label className="block text-xs text-slate-500">
        Заголовок секции
        <input
          className={fieldClass}
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />
      </label>

      <div className="space-y-6">
        {form.locations.map((loc, i) => (
          <div key={i} className="rounded-lg border border-slate-700 bg-slate-950/40 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-400">Адрес {i + 1}</span>
              <button type="button" className={`${btnGhost} text-xs py-1 px-2`} onClick={() => removeLocation(i)}>
                Удалить адрес
              </button>
            </div>
            <label className="block text-xs text-slate-500">
              URL фото ( /locations/… или https:// )
              <input
                className={fieldClass}
                value={loc.image}
                onChange={(e) => updateLocation(i, "image", e.target.value)}
                placeholder="/locations/salon.jpg"
              />
            </label>
            <label className="block text-xs text-slate-500">
              Город
              <input
                className={fieldClass}
                value={loc.city}
                onChange={(e) => updateLocation(i, "city", e.target.value)}
              />
            </label>
            <label className="block text-xs text-slate-500">
              Улица, дом
              <input
                className={fieldClass}
                value={loc.street}
                onChange={(e) => updateLocation(i, "street", e.target.value)}
              />
            </label>
            <label className="block text-xs text-slate-500">
              Телефон (как на сайте)
              <input
                className={fieldClass}
                value={loc.phone}
                onChange={(e) => updateLocation(i, "phone", e.target.value)}
              />
            </label>
            <label className="block text-xs text-slate-500">
              Ссылка Яндекс.Карты
              <input
                className={fieldClass}
                value={loc.yandex_maps_url}
                onChange={(e) => updateLocation(i, "yandex_maps_url", e.target.value)}
              />
            </label>
            <label className="block text-xs text-slate-500">
              Ссылка 2ГИС
              <input
                className={fieldClass}
                value={loc.gis_url}
                onChange={(e) => updateLocation(i, "gis_url", e.target.value)}
              />
            </label>
          </div>
        ))}
      </div>

      <button type="button" className={btnGhost} onClick={addLocation}>
        + Добавить адрес
      </button>

      <div>
        <button type="button" className={`${btnGhost} text-xs`} onClick={() => setShowJson((v) => !v)}>
          {showJson ? "Скрыть JSON" : "Показать JSON (копия)"}
        </button>
        {showJson && (
          <pre className="mt-2 max-h-48 overflow-auto rounded border border-slate-700 p-2 text-[10px] text-slate-500">
            {JSON.stringify(form, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
