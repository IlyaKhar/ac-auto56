import { useCallback, useEffect, useState } from "react";
import { adminVehicles } from "../api/adminApi.js";
import { ErrBox, apiErr, btnDanger, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

const empty = {
  title: "",
  brand_label: "",
  price_rub: "",
  description: "",
  features_text: "",
  images_text: "",
  sort_order: "0",
  is_published: false,
  is_new: false,
};

function linesToArr(s) {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function AdminVehicles() {
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const rows = await adminVehicles.list();
      setList(Array.isArray(rows) ? rows : []);
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function startEdit(row) {
    setEditingId(row.id);
    setForm({
      title: row.title ?? "",
      brand_label: row.brand_label ?? "",
      price_rub: String(row.price_rub ?? 0),
      description: row.description ?? "",
      features_text: Array.isArray(row.features) ? row.features.join("\n") : "",
      images_text: Array.isArray(row.images) ? row.images.join("\n") : "",
      sort_order: String(row.sort_order ?? 0),
      is_published: Boolean(row.is_published),
      is_new: Boolean(row.is_new),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(empty);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    const price = Number(form.price_rub);
    if (!Number.isFinite(price) || price < 0) {
      setErr("Укажите корректную цену (руб., целое число)");
      return;
    }
    const sort = Number(form.sort_order);
    const body = {
      title: form.title.trim(),
      brand_label: form.brand_label.trim(),
      price_rub: Math.round(price),
      description: form.description,
      features: linesToArr(form.features_text),
      images: linesToArr(form.images_text),
      sort_order: Number.isFinite(sort) ? sort : 0,
      is_published: form.is_published,
      is_new: form.is_new,
    };
    try {
      if (editingId) {
        await adminVehicles.patch(editingId, body);
      } else {
        await adminVehicles.create(body);
      }
      cancelEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onDelete(id) {
    if (!confirm("Удалить автомобиль из каталога?")) return;
    setErr("");
    try {
      await adminVehicles.remove(id);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-white">Автомобили (каталог)</h1>
      <p className="mb-4 max-w-xl text-sm text-slate-400">
        Показываются на главной. Фото — URL по одному в строке. Преимущества — по одному в строке.
      </p>
      <ErrBox msg={err} />

      <form
        onSubmit={onSubmit}
        className="mb-8 max-w-2xl space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
      >
        <h2 className="text-sm font-medium text-slate-300">
          {editingId ? `Редактировать #${editingId}` : "Новый автомобиль"}
        </h2>
        <label className="block text-xs text-slate-500">
          Полное название (как на карточке) *
          <input
            className={fieldClass}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Марка (подзаголовок)
          <input
            className={fieldClass}
            value={form.brand_label}
            onChange={(e) => setForm({ ...form, brand_label: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Цена, руб. *
          <input
            className={fieldClass}
            type="number"
            min={0}
            step={1}
            value={form.price_rub}
            onChange={(e) => setForm({ ...form, price_rub: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Описание
          <textarea
            className={fieldClass}
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Преимущества (строка = пункт с галочкой)
          <textarea
            className={fieldClass}
            rows={4}
            value={form.features_text}
            onChange={(e) => setForm({ ...form, features_text: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Фото (URL, по одному в строке)
          <textarea
            className={fieldClass}
            rows={4}
            value={form.images_text}
            onChange={(e) => setForm({ ...form, images_text: e.target.value })}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Порядок сортировки
          <input
            className={fieldClass}
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={form.is_new}
            onChange={(e) => setForm({ ...form, is_new: e.target.checked })}
          />
          Новый (не снята галочка = с пробегом / Б/У)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          На сайте (опубликовано)
        </label>
        <div className="flex gap-2">
          <button type="submit" className={btnPrimary}>
            {editingId ? "Сохранить" : "Создать"}
          </button>
          {editingId && (
            <button type="button" className={btnGhost} onClick={cancelEdit}>
              Отмена
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-slate-500">Загрузка…</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900 text-left text-slate-400">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Название</th>
                <th className="p-3">Цена</th>
                <th className="p-3">Новый</th>
                <th className="p-3">На сайте</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id} className="border-t border-slate-800">
                  <td className="p-3 text-slate-500">{row.id}</td>
                  <td className="max-w-xs truncate p-3 text-white" title={row.title}>
                    {row.title}
                  </td>
                  <td className="p-3 text-slate-400">{row.price_rub}</td>
                  <td className="p-3">{row.is_new ? "да" : "нет"}</td>
                  <td className="p-3">{row.is_published ? "да" : "нет"}</td>
                  <td className="flex flex-wrap gap-2 p-3">
                    <button type="button" className={btnGhost} onClick={() => startEdit(row)}>
                      Изменить
                    </button>
                    <button type="button" className={btnDanger} onClick={() => onDelete(row.id)}>
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
