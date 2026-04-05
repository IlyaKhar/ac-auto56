import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { staffListApplications } from "../api/staffApi.js";
import { ErrBox, apiErr, btnGhost, fieldClass } from "../admin/shared.jsx";

const LIMIT = 30;

const STATUSES = ["", "new", "in_progress", "completed", "rejected"];
const TYPES = ["", "callback", "question", "service_request"];

/** Список заявок с фильтрами и простой пагинацией. */
export default function StaffApplicationsPage() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [offset, setOffset] = useState(0);
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    setLoading(true);
    try {
      const params = { limit: LIMIT, offset };
      if (status) params.status = status;
      if (type) params.type = type;
      const data = await staffListApplications(params);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(apiErr(e));
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [status, type, offset]);

  useEffect(() => {
    load();
  }, [load]);

  const hasMore = list.length === LIMIT;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Заявки</h1>
      <ErrBox msg={err} />

      <div className="flex flex-wrap gap-3 mb-6 items-end">
        <label className="text-xs text-slate-500">
          Статус
          <select
            className={`${fieldClass} min-w-[140px]`}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setOffset(0);
            }}
          >
            {STATUSES.map((v) => (
              <option key={v || "all"} value={v}>
                {v || "все"}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-500">
          Тип
          <select
            className={`${fieldClass} min-w-[160px]`}
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setOffset(0);
            }}
          >
            {TYPES.map((v) => (
              <option key={v || "all"} value={v}>
                {v || "все"}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-slate-500">Загрузка…</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-slate-400 text-left">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Тип</th>
                  <th className="p-3">Имя</th>
                  <th className="p-3">Телефон</th>
                  <th className="p-3">Статус</th>
                  <th className="p-3">Создана</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} className="border-t border-slate-800">
                    <td className="p-3 text-slate-500">{a.id}</td>
                    <td className="p-3 text-slate-400">{a.type}</td>
                    <td className="p-3 text-white">{a.name}</td>
                    <td className="p-3 text-slate-300">{a.phone}</td>
                    <td className="p-3">
                      <span className="text-emerald-400/90">{a.status}</span>
                    </td>
                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      {a.created_at ? new Date(a.created_at).toLocaleString("ru-RU") : "—"}
                    </td>
                    <td className="p-3">
                      <Link
                        to={`/staff/applications/${a.id}`}
                        className="text-emerald-400 hover:underline"
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!list.length && !err && <p className="text-slate-500 mt-4">Пусто.</p>}
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              className={btnGhost}
              disabled={offset === 0}
              onClick={() => setOffset((o) => Math.max(0, o - LIMIT))}
            >
              Назад
            </button>
            <button
              type="button"
              className={btnGhost}
              disabled={!hasMore}
              onClick={() => setOffset((o) => o + LIMIT)}
            >
              Далее
            </button>
          </div>
        </>
      )}
    </div>
  );
}
