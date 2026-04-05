import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminBlocks, adminPages } from "../api/adminApi.js";
import {
  SALON_LOCATIONS_BLOCK_TYPE,
  SALON_LOCATIONS_DATA_TEMPLATE,
} from "../components/SalonLocationsSection.jsx";
import { SalonLocationsBlockEditor, parseSalonLocationsAdminData } from "./SalonLocationsBlockEditor.jsx";
import { ErrBox, apiErr, btnDanger, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

/** Редактор страницы и блоков (JSON data для блоков). */
export default function AdminPageEditor() {
  const { pageId } = useParams();
  const id = Number(pageId);
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("draft");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [ogImage, setOgImage] = useState("");

  const [newType, setNewType] = useState("text");
  const [newData, setNewData] = useState("{}");
  const [reorderIds, setReorderIds] = useState("");
  const [loadKey, setLoadKey] = useState(0);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) return;
    setErr("");
    setLoading(true);
    try {
      const res = await adminPages.get(id);
      const p = res.page;
      setPage(p);
      setSlug(p.slug);
      setTitle(p.title);
      setStatus(p.status);
      setSeoTitle(p.seo_title ?? "");
      setSeoDesc(p.seo_description ?? "");
      setOgImage(p.og_image_url ?? "");
      setBlocks(Array.isArray(res.blocks) ? res.blocks : []);
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setLoading(false);
      setLoadKey((k) => k + 1);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function savePage(e) {
    e.preventDefault();
    setErr("");
    try {
      await adminPages.patch(id, {
        slug,
        title,
        status,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDesc.trim() || null,
        og_image_url: ogImage.trim() || null,
      });
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function addBlock(e) {
    e.preventDefault();
    setErr("");
    let dataObj;
    try {
      dataObj = JSON.parse(newData || "{}");
    } catch {
      setErr("data блока: невалидный JSON");
      return;
    }
    try {
      await adminBlocks.create(id, { block_type: newType, data: dataObj });
      setNewData("{}");
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function saveBlock(b, dataStr, sortStr) {
    setErr("");
    let dataObj;
    try {
      dataObj = JSON.parse(dataStr || "{}");
    } catch {
      setErr("Блок: невалидный JSON");
      return;
    }
    const sort = parseInt(sortStr, 10);
    try {
      await adminBlocks.patch(id, b.id, {
        block_type: b.block_type,
        sort_order: Number.isFinite(sort) ? sort : b.sort_order,
        data: dataObj,
      });
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function deleteBlock(blockId) {
    if (!confirm("Удалить блок?")) return;
    setErr("");
    try {
      await adminBlocks.remove(id, blockId);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function doReorder(e) {
    e.preventDefault();
    const ids = reorderIds
      .split(/[\s,]+/)
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n));
    if (!ids.length) {
      setErr("Укажи id блоков через запятую");
      return;
    }
    setErr("");
    try {
      await adminBlocks.reorder(id, ids);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  if (!Number.isFinite(id)) {
    return <p className="text-red-400">Некорректный id</p>;
  }
  if (loading && !page) {
    return <p className="text-slate-500">Загрузка…</p>;
  }
  if (!page) {
    return (
      <div>
        <ErrBox msg={err} />
        <Link to="/admin/pages" className="text-emerald-400 text-sm">
          К списку страниц
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/pages" className="text-sm text-slate-500 hover:text-emerald-400">
          ← Страницы
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">Редактор страницы</h1>
      <ErrBox msg={err} />

      <form
        onSubmit={savePage}
        className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-w-xl"
      >
        <h2 className="text-sm font-medium text-slate-300">Мета страницы</h2>
        <label className="block text-xs text-slate-500">
          Slug
          <input className={fieldClass} value={slug} onChange={(e) => setSlug(e.target.value)} required />
        </label>
        <label className="block text-xs text-slate-500">
          Заголовок
          <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="block text-xs text-slate-500">
          Статус
          <select className={fieldClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="block text-xs text-slate-500">
          SEO title
          <input className={fieldClass} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </label>
        <label className="block text-xs text-slate-500">
          SEO description
          <input className={fieldClass} value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} />
        </label>
        <label className="block text-xs text-slate-500">
          OG image URL
          <input className={fieldClass} value={ogImage} onChange={(e) => setOgImage(e.target.value)} />
        </label>
        <button type="submit" className={btnPrimary}>
          Сохранить страницу
        </button>
      </form>

      <h2 className="text-lg font-medium text-white mb-3">Блоки</h2>
      <form onSubmit={doReorder} className="mb-6 flex flex-wrap gap-2 items-end max-w-xl">
        <label className="flex-1 min-w-[200px] text-xs text-slate-500">
          Порядок (id через запятую)
          <input
            className={fieldClass}
            value={reorderIds}
            onChange={(e) => setReorderIds(e.target.value)}
            placeholder="1, 2, 3"
          />
        </label>
        <button type="submit" className={btnGhost}>
          Применить порядок
        </button>
      </form>

      <div className="space-y-6 mb-10">
        {blocks.map((b) => (
          <BlockRow key={`${b.id}-${loadKey}`} b={b} onSave={saveBlock} onDelete={deleteBlock} />
        ))}
      </div>

      <form onSubmit={addBlock} className="rounded-xl border border-dashed border-slate-700 p-4 space-y-3 max-w-3xl">
        <h3 className="text-sm text-slate-400">Новый блок</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnGhost}
            onClick={() => {
              setNewType(SALON_LOCATIONS_BLOCK_TYPE);
              setNewData(JSON.stringify(SALON_LOCATIONS_DATA_TEMPLATE, null, 2));
            }}
          >
            Вставить шаблон «Адреса салона»
          </button>
        </div>
        <label className="block text-xs text-slate-500">
          block_type
          <input className={fieldClass} value={newType} onChange={(e) => setNewType(e.target.value)} required />
        </label>
        <label className="block text-xs text-slate-500">
          data (JSON)
          <textarea
            className={fieldClass}
            rows={4}
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            spellCheck={false}
          />
        </label>
        <button type="submit" className={btnPrimary}>
          Добавить блок
        </button>
      </form>
    </div>
  );
}

function BlockRow({ b, onSave, onDelete }) {
  const [dataStr, setDataStr] = useState(() => JSON.stringify(b.data ?? {}, null, 2));
  const [sort, setSort] = useState(String(b.sort_order));
  const [type, setType] = useState(b.block_type);
  const [salonForm, setSalonForm] = useState(() =>
    b.block_type === SALON_LOCATIONS_BLOCK_TYPE ? parseSalonLocationsAdminData(b.data) : null
  );

  function onTypeInput(e) {
    const next = e.target.value;
    if (type === SALON_LOCATIONS_BLOCK_TYPE && next !== SALON_LOCATIONS_BLOCK_TYPE && salonForm) {
      setDataStr(JSON.stringify(salonForm, null, 2));
    }
    if (next === SALON_LOCATIONS_BLOCK_TYPE && type !== SALON_LOCATIONS_BLOCK_TYPE) {
      try {
        setSalonForm(parseSalonLocationsAdminData(JSON.parse(dataStr || "{}")));
      } catch {
        setSalonForm(parseSalonLocationsAdminData(SALON_LOCATIONS_DATA_TEMPLATE));
      }
    }
    setType(next);
  }

  const isSalon = type === SALON_LOCATIONS_BLOCK_TYPE;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 space-y-2 max-w-3xl">
      <div className="text-xs text-slate-500">Блок id={b.id}</div>
      <label className="block text-xs text-slate-500">
        block_type
        <input className={fieldClass} value={type} onChange={onTypeInput} />
      </label>
      <label className="block text-xs text-slate-500">
        sort_order
        <input className={fieldClass} value={sort} onChange={(e) => setSort(e.target.value)} />
      </label>

      {isSalon && salonForm ? (
        <SalonLocationsBlockEditor form={salonForm} setForm={setSalonForm} />
      ) : (
        <label className="block text-xs text-slate-500">
          data (JSON)
          <textarea
            className={fieldClass}
            rows={5}
            value={dataStr}
            onChange={(e) => setDataStr(e.target.value)}
            spellCheck={false}
          />
        </label>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          className={btnPrimary}
          onClick={() =>
            onSave(
              { ...b, block_type: type },
              isSalon && salonForm ? JSON.stringify(salonForm) : dataStr,
              sort
            )
          }
        >
          Сохранить блок
        </button>
        <button type="button" className={btnDanger} onClick={() => onDelete(b.id)}>
          Удалить
        </button>
      </div>
    </div>
  );
}
