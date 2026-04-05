import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CarCatalogGrid } from "./CarCatalogGrid.jsx";
import { CatalogPagination } from "./CatalogPagination.jsx";

const DEFAULT_PAGE_SIZE = 8;

/** Варианты сортировки в селекте «Порядок» */
const SORT_OPTIONS = [
  { value: "default", label: "Как в каталоге" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "new_first", label: "Сначала новые авто" },
  { value: "used_first", label: "Сначала с пробегом" },
  { value: "date_desc", label: "По дате добавления" },
];

function clamp(n, lo, hi) {
  return Math.min(Math.max(n, lo), hi);
}

function priceOf(v) {
  const n = Number(v?.price_rub);
  return Number.isFinite(n) ? n : 0;
}

function ts(v) {
  const t = v?.created_at ? Date.parse(v.created_at) : NaN;
  return Number.isFinite(t) ? t : 0;
}

/**
 * Фильтр + сортировка списка перед пагинацией.
 * @param {"all"|"new"|"used"} condition
 */
function filterAndSort(list, { search, sort, condition, priceMin, priceMax }) {
  const q = search.trim().toLowerCase();
  let rows = list.filter((v) => {
    const p = priceOf(v);
    if (p < priceMin || p > priceMax) return false;
    if (condition === "new" && !v.is_new) return false;
    if (condition === "used" && v.is_new) return false;
    if (!q) return true;
    const title = String(v.title ?? "").toLowerCase();
    const brand = String(v.brand_label ?? "").toLowerCase();
    return title.includes(q) || brand.includes(q);
  });

  const byOrder = (a, b) => {
    const so = (a.sort_order ?? 0) - (b.sort_order ?? 0);
    if (so !== 0) return so;
    return (a.id ?? 0) - (b.id ?? 0);
  };

  rows = [...rows];
  switch (sort) {
    case "price_asc":
      rows.sort((a, b) => priceOf(a) - priceOf(b) || byOrder(a, b));
      break;
    case "price_desc":
      rows.sort((a, b) => priceOf(b) - priceOf(a) || byOrder(a, b));
      break;
    case "new_first":
      rows.sort((a, b) => Number(Boolean(b.is_new)) - Number(Boolean(a.is_new)) || byOrder(a, b));
      break;
    case "used_first":
      rows.sort((a, b) => Number(Boolean(a.is_new)) - Number(Boolean(b.is_new)) || byOrder(a, b));
      break;
    case "date_desc":
      rows.sort((a, b) => ts(b) - ts(a) || byOrder(a, b));
      break;
    default:
      rows.sort(byOrder);
  }
  return rows;
}

/**
 * Сайдбар: цена (ползунки + числа), состояние авто.
 */
function CatalogFilterAside({ boundsMin, boundsMax, lo, hi, setLo, setHi, condition, setCondition, step }) {
  const safeStep = step > 0 ? step : 1;

  const onMinRange = (e) => {
    const v = Number(e.target.value);
    setLo(clamp(v, boundsMin, hi));
  };
  const onMaxRange = (e) => {
    const v = Number(e.target.value);
    setHi(clamp(v, lo, boundsMax));
  };

  const onMinInput = (e) => {
    const v = Number(e.target.value);
    if (!Number.isFinite(v)) return;
    setLo(clamp(Math.round(v), boundsMin, hi));
  };
  const onMaxInput = (e) => {
    const v = Number(e.target.value);
    if (!Number.isFinite(v)) return;
    setHi(clamp(Math.round(v), lo, boundsMax));
  };

  return (
    <aside className="w-full shrink-0 space-y-8 lg:w-64 xl:w-72">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-800">Цена</h3>
        <p className="mt-2 text-xs text-neutral-500">Нижняя граница</p>
        <input
          type="range"
          min={boundsMin}
          max={boundsMax}
          step={safeStep}
          value={clamp(lo, boundsMin, hi)}
          onChange={onMinRange}
          className="mt-1 w-full cursor-pointer accent-neutral-800"
          aria-label="Минимальная цена"
        />
        <p className="mt-3 text-xs text-neutral-500">Верхняя граница</p>
        <input
          type="range"
          min={boundsMin}
          max={boundsMax}
          step={safeStep}
          value={clamp(hi, lo, boundsMax)}
          onChange={onMaxRange}
          className="mt-1 w-full cursor-pointer accent-neutral-800"
          aria-label="Максимальная цена"
        />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs text-neutral-500">
            от, ₽
            <input
              type="number"
              min={boundsMin}
              max={hi}
              step={safeStep}
              value={lo}
              onChange={onMinInput}
              className="mt-1 w-full rounded-md border border-neutral-200 px-2 py-2 text-sm text-neutral-900"
            />
          </label>
          <label className="text-xs text-neutral-500">
            до, ₽
            <input
              type="number"
              min={lo}
              max={boundsMax}
              step={safeStep}
              value={hi}
              onChange={onMaxInput}
              className="mt-1 w-full rounded-md border border-neutral-200 px-2 py-2 text-sm text-neutral-900"
            />
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-800">Состояние</h3>
        <div className="mt-3 flex flex-col gap-2 text-sm text-neutral-800">
          {[
            { value: "all", label: "Все" },
            { value: "new", label: "Новые" },
            { value: "used", label: "С пробегом (Б/У)" },
          ].map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="vehicle-condition"
                value={opt.value}
                checked={condition === opt.value}
                onChange={() => setCondition(opt.value)}
                className="h-4 w-4 accent-neutral-800"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

/**
 * Сетка каталога: пагинация, кнопка на /avtomobili, опционально фильтры как на макете.
 */
export function VehicleCatalogSection({
  vehicles,
  onOpenDetail,
  favoriteIds,
  onToggleFavorite,
  pageSize = DEFAULT_PAGE_SIZE,
  showGoToCatalogButton = false,
  hideGridTitle = false,
  showCatalogFilters = false,
}) {
  const list = Array.isArray(vehicles) ? vehicles : [];

  const { boundsMin, boundsMax, step } = useMemo(() => {
    if (!list.length) {
      return { boundsMin: 0, boundsMax: 1, step: 1 };
    }
    const prices = list.map(priceOf);
    const mn = Math.min(...prices);
    const mx = Math.max(...prices);
    if (mn === mx) {
      return { boundsMin: mn, boundsMax: mx + 1, step: 1 };
    }
    const st = Math.max(1000, Math.round((mx - mn) / 150));
    return { boundsMin: mn, boundsMax: mx, step: st };
  }, [list]);

  const [lo, setLo] = useState(boundsMin);
  const [hi, setHi] = useState(boundsMax);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [condition, setCondition] = useState("all");

  useEffect(() => {
    setLo(boundsMin);
    setHi(boundsMax);
  }, [boundsMin, boundsMax]);

  const processed = useMemo(() => {
    if (!showCatalogFilters) return list;
    return filterAndSort(list, {
      search,
      sort,
      condition,
      priceMin: lo,
      priceMax: hi,
    });
  }, [showCatalogFilters, list, search, sort, condition, lo, hi]);

  const [page, setPage] = useState(1);
  const total = processed.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);

  useEffect(() => {
    setPage(1);
  }, [list.length]);

  useEffect(() => {
    if (!showCatalogFilters) return;
    setPage(1);
  }, [showCatalogFilters, search, sort, condition, lo, hi]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const slice = total === 0 ? [] : processed.slice((page - 1) * pageSize, page * pageSize);

  const footer =
    total === 0 ? null : (
      <>
        {totalPages >= 1 ? (
          <CatalogPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        ) : null}
        {showGoToCatalogButton ? (
          <Link
            to="/avtomobili"
            className="inline-block rounded-md bg-ac-bright-orange px-10 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:brightness-105 sm:px-14"
          >
            Перейти в каталог
          </Link>
        ) : null}
      </>
    );

  const emptyFiltered =
    showCatalogFilters && list.length > 0 && processed.length === 0
      ? "Ничего не подошло под фильтры — измените цену, состояние или поиск."
      : undefined;

  const gridProps = {
    vehicles: slice,
    onOpenDetail,
    favoriteIds,
    onToggleFavorite,
    footer,
    hideTitle: hideGridTitle,
    emptyMessage: emptyFiltered,
  };

  if (!showCatalogFilters) {
    return <CarCatalogGrid {...gridProps} />;
  }

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {!hideGridTitle ? (
          <h2 className="text-center text-base font-bold uppercase tracking-[0.08em] text-neutral-900 md:text-lg">
            Каталог автомобилей
          </h2>
        ) : null}

        <div className={`flex flex-col gap-10 ${hideGridTitle ? "mt-6" : "mt-10"} lg:flex-row lg:items-start`}>
          <CatalogFilterAside
            boundsMin={boundsMin}
            boundsMax={boundsMax}
            lo={lo}
            hi={hi}
            setLo={setLo}
            setHi={setHi}
            condition={condition}
            setCondition={setCondition}
            step={step}
          />

          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block min-w-0 flex-1 sm:max-w-md">
                <span className="sr-only">Поиск</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск"
                  className="w-full rounded-md border border-neutral-200 py-2.5 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400"
                />
              </label>
              <label className="flex shrink-0 items-center gap-2 text-sm text-neutral-700">
                <span className="whitespace-nowrap text-neutral-500">Порядок:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="min-w-[11rem] rounded-md border border-neutral-200 bg-white py-2 pl-2 pr-8 text-sm text-neutral-900"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <CarCatalogGrid {...gridProps} embedded hideTitle />
          </div>
        </div>
      </div>
    </section>
  );
}
