import { useCallback, useEffect, useState } from "react";
import { adminAboutGallery } from "../api/adminApi.js";
import { ErrBox, apiErr, btnPrimary, fieldClass } from "./shared.jsx";

const emptyFive = () => ["", "", "", "", ""];

export default function AdminAboutGallery() {
  const [urls, setUrls] = useState(emptyFive);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setErr("");
    try {
      const d = await adminAboutGallery.get();
      const list = Array.isArray(d?.image_urls) ? d.image_urls : [];
      const next = emptyFive();
      for (let i = 0; i < 5; i++) next[i] = typeof list[i] === "string" ? list[i] : "";
      setUrls(next);
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
      await adminAboutGallery.put({ image_urls: urls.map((u) => String(u || "").trim()) });
      await load();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6 p-6 text-slate-100">
      <h1 className="text-xl font-semibold">Слайдер «О компании»</h1>
      <p className="text-sm text-slate-400">
        Ровно 5 полей — пути от корня сайта (как в адресе салона), например{" "}
        <code className="text-slate-300">/about/salon-1.jpg</code>. Файлы положите в{" "}
        <code className="text-slate-300">client/public</code>.
      </p>
      {err ? <ErrBox message={err} /> : null}
      {loading ? (
        <p className="text-slate-500">Загрузка…</p>
      ) : (
        <form onSubmit={onSave} className="space-y-4">
          {urls.map((u, i) => (
            <label key={i} className="block text-sm">
              <span className="mb-1 block text-slate-400">Слайд {i + 1}</span>
              <input
                className={fieldClass}
                value={u}
                onChange={(e) => setUrls((prev) => prev.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder="/about/slide-1.jpg"
                autoComplete="off"
              />
            </label>
          ))}
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </form>
      )}
    </div>
  );
}
