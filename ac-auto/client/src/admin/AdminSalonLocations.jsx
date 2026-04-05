import { useCallback, useEffect, useState } from "react";
import { adminSalonLocations } from "../api/adminApi.js";
import { SALON_LOCATIONS_DATA_TEMPLATE } from "../components/SalonLocationsSection.jsx";
import { ErrBox, apiErr, btnDanger, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

const defLinks = SALON_LOCATIONS_DATA_TEMPLATE.locations[0];

const emptyForm = () => ({
  sort_order: "0",
  image: "",
  city: "",
  street: "",
  phone: "",
  yandex_maps_url: defLinks.yandex_maps_url,
  gis_url: defLinks.gis_url,
});

export default function AdminSalonLocations() {
  const [sectionTitle, setSectionTitle] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const b = await adminSalonLocations.getBundle();
      setSectionTitle(b.section_title ?? "");
      setAddresses(Array.isArray(b.addresses) ? b.addresses : []);
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function saveTitle(e) {
    e.preventDefault();
    setErr("");
    const t = sectionTitle.trim();
    if (!t) {
      setErr("Заголовок не может быть пустым");
      return;
    }
    try {
      await adminSalonLocations.patchSettings({ section_title: t });
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      sort_order: String(row.sort_order ?? 0),
      image: row.image ?? "",
      city: row.city ?? "",
      street: row.street ?? "",
      phone: row.phone ?? "",
      yandex_maps_url: row.yandex_maps_url ?? "",
      gis_url: row.gis_url ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function bodyFromForm() {
    const sort = Number(form.sort_order);
    return {
      sort_order: Number.isFinite(sort) ? sort : 0,
      image: form.image.trim(),
      city: form.city.trim(),
      street: form.street.trim(),
      phone: form.phone.trim(),
      yandex_maps_url: form.yandex_maps_url.trim(),
      gis_url: form.gis_url.trim(),
    };
  }

  async function onSubmitAddress(e) {
    e.preventDefault();
    setErr("");
    const body = bodyFromForm();
    if (!body.city && !body.street) {
      setErr("Укажите город или улицу");
      return;
    }
    try {
      if (editingId) {
        await adminSalonLocations.patchAddress(editingId, body);
      } else {
        await adminSalonLocations.createAddress(body);
      }
      cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Удалить этот адрес?")) return;
    setErr("");
    try {
      await adminSalonLocations.removeAddress(id);
      if (editingId === id) cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function moveRow(id, delta) {
    const idx = addresses.findIndex((a) => a.id === id);
    const j = idx + delta;
    if (idx < 0 || j < 0 || j >= addresses.length) return;
    const next = [...addresses];
    [next[idx], next[j]] = [next[j], next[idx]];
    setErr("");
    try {
      await adminSalonLocations.reorder({ ids: next.map((a) => a.id) });
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  if (loading) {
    return <p className="text-slate-500">Загрузка…</p>;
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-white">Адреса салона</h1>
      <p className="mb-4 max-w-2xl text-sm text-slate-400">
        Блок на главной (/katalog). Фото: положи файл в{" "}
        <code className="text-slate-300">client/public/locations/</code> и укажи путь{" "}
        <code className="text-slate-300">/locations/файл.jpg</code> или вставь полный URL.
      </p>
      <ErrBox msg={err} />

      <form
        onSubmit={saveTitle}
        className="mb-8 max-w-2xl space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
      >
        <h2 className="text-sm font-medium text-slate-300">Заголовок секции</h2>
        <input
          className={fieldClass}
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          placeholder="Адрес автосалона и автосервиса «ACT AUTO»"
        />
        <button type="submit" className={btnPrimary}>
          Сохранить заголовок
        </button>
      </form>

      <form
        onSubmit={onSubmitAddress}
        className="mb-8 max-w-2xl space-y-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
      >
        <h2 className="text-sm font-medium text-slate-300">{editingId ? `Редактировать #${editingId}` : "Новый адрес"}</h2>
        <label className="block text-xs text-slate-500">
          sort_order
          <input
            className={fieldClass}
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
          />
        </label>
        <label className="block text-xs text-slate-500">
          URL фото
          <input
            className={fieldClass}
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            placeholder="/locations/salon.jpg"
          />
        </label>
        <label className="block text-xs text-slate-500">
          Город
          <input
            className={fieldClass}
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Улица, дом
          <input
            className={fieldClass}
            value={form.street}
            onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Телефон
          <input
            className={fieldClass}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Яндекс.Карты
          <input
            className={fieldClass}
            value={form.yandex_maps_url}
            onChange={(e) => setForm((f) => ({ ...f, yandex_maps_url: e.target.value }))}
          />
        </label>
        <label className="block text-xs text-slate-500">
          2ГИС
          <input
            className={fieldClass}
            value={form.gis_url}
            onChange={(e) => setForm((f) => ({ ...f, gis_url: e.target.value }))}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className={btnPrimary}>
            {editingId ? "Сохранить адрес" : "Добавить адрес"}
          </button>
          {editingId ? (
            <button type="button" className={btnGhost} onClick={cancelEdit}>
              Отмена
            </button>
          ) : null}
        </div>
      </form>

      <h2 className="mb-2 text-sm font-medium text-slate-300">Список ({addresses.length})</h2>
      <ul className="max-w-3xl space-y-2">
        {addresses.map((a) => (
          <li
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm"
          >
            <div className="min-w-0 flex-1">
              <span className="text-slate-500">#{a.id}</span>{" "}
              <span className="text-white">
                {a.city} {a.street}
              </span>
              <span className="block truncate text-xs text-slate-500">{a.image}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <button type="button" className={btnGhost} onClick={() => moveRow(a.id, -1)} title="Вверх">
                ↑
              </button>
              <button type="button" className={btnGhost} onClick={() => moveRow(a.id, 1)} title="Вниз">
                ↓
              </button>
              <button type="button" className={btnGhost} onClick={() => startEdit(a)}>
                Изменить
              </button>
              <button type="button" className={btnDanger} onClick={() => onDelete(a.id)}>
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
