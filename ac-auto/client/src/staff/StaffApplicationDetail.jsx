import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  staffAddComment,
  staffGetApplication,
  staffListUsers,
  staffPatchApplication,
} from "../api/staffApi.js";
import { ErrBox, apiErr, btnGhost, btnPrimary, fieldClass } from "../admin/shared.jsx";

const STATUSES = ["new", "in_progress", "completed", "rejected"];
const STATUS_LABELS = {
  new: "Новая",
  in_progress: "В работе",
  completed: "Завершена",
  rejected: "Отклонена",
};

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function payloadStr(p) {
  if (p == null) return "{}";
  if (typeof p === "string") {
    try {
      return JSON.stringify(JSON.parse(p), null, 2);
    } catch {
      return p;
    }
  }
  return JSON.stringify(p, null, 2);
}

/** Карточка заявки: поля, патч статуса/менеджера, комментарии, история. */
export default function StaffApplicationDetail() {
  const { id } = useParams();
  const appId = Number(id);
  const [detail, setDetail] = useState(null);
  const [staffUsers, setStaffUsers] = useState([]);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("new");
  const [managerId, setManagerId] = useState("");
  const [clearAssigned, setClearAssigned] = useState(false);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(appId)) return;
    setErr("");
    setOkMsg("");
    setLoading(true);
    try {
      const [d, users] = await Promise.all([staffGetApplication(appId), staffListUsers()]);
      setDetail(d);
      setStaffUsers(Array.isArray(users) ? users : []);
      const app = d?.application;
      if (app) {
        setStatus(app.status || "new");
        setManagerId(app.assigned_manager_id != null ? String(app.assigned_manager_id) : "");
        setClearAssigned(false);
      }
    } catch (e) {
      setErr(apiErr(e));
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onSavePatch(e) {
    e.preventDefault();
    setErr("");
    setOkMsg("");
    setSaving(true);
    try {
      const body = {};
      if (status) body.status = status;
      if (clearAssigned) {
        body.clear_assigned = true;
      } else if (managerId.trim()) {
        const n = Number(managerId);
        if (Number.isFinite(n)) body.assigned_manager_id = n;
      }
      await staffPatchApplication(appId, body);
      setOkMsg("Сохранено");
      await load();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setSaving(false);
    }
  }

  async function onAddComment(e) {
    e.preventDefault();
    setErr("");
    setOkMsg("");
    setSaving(true);
    try {
      await staffAddComment(appId, comment);
      setComment("");
      setOkMsg("Комментарий добавлен");
      await load();
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setSaving(false);
    }
  }

  if (!Number.isFinite(appId)) {
    return <p className="text-red-400">Некорректный id</p>;
  }
  if (loading && !detail) {
    return <p className="text-slate-500">Загрузка…</p>;
  }
  if (!detail?.application) {
    return (
      <div>
        <ErrBox msg={err} />
        <Link to="/staff/applications" className="text-emerald-400 text-sm">
          ← К списку
        </Link>
      </div>
    );
  }

  const a = detail.application;

  return (
    <div>
      <div className="mb-4">
        <Link to="/staff/applications" className="text-sm text-slate-500 hover:text-emerald-400">
          ← Заявки
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-white mb-2">
        Заявка #{a.id}{" "}
        <span className="text-slate-500 text-lg font-normal">· {statusLabel(a.status)}</span>
      </h1>
      {okMsg && (
        <p className="text-emerald-400 text-sm mb-2" role="status">
          {okMsg}
        </p>
      )}
      <ErrBox msg={err} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2 text-sm">
          <h2 className="text-slate-300 font-medium mb-2">Данные</h2>
          <p>
            <span className="text-slate-500">Тип:</span> {a.type}
          </p>
          <p>
            <span className="text-slate-500">Имя:</span> {a.name}
          </p>
          <p>
            <span className="text-slate-500">Телефон:</span> {a.phone}
          </p>
          {a.email && (
            <p>
              <span className="text-slate-500">Email:</span> {a.email}
            </p>
          )}
          {a.car_brand && (
            <p>
              <span className="text-slate-500">Марка:</span> {a.car_brand}
            </p>
          )}
          {a.vin && (
            <p>
              <span className="text-slate-500">VIN:</span> {a.vin}
            </p>
          )}
          {a.service_title && (
            <p>
              <span className="text-slate-500">Услуга:</span> {a.service_title}
            </p>
          )}
          {a.message && (
            <p className="whitespace-pre-wrap">
              <span className="text-slate-500">Сообщение:</span>
              <br />
              {a.message}
            </p>
          )}
          <p className="text-xs text-slate-600 pt-2">
            Создана: {a.created_at ? new Date(a.created_at).toLocaleString("ru-RU") : "—"}
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-slate-300 font-medium mb-3">Действия</h2>
          <form onSubmit={onSavePatch} className="space-y-3">
            <label className="block text-xs text-slate-500">
              Статус
              <select className={fieldClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs text-slate-500">
              Менеджер
              <select
                className={fieldClass}
                value={managerId}
                onChange={(e) => {
                  setManagerId(e.target.value);
                  setClearAssigned(false);
                }}
                disabled={clearAssigned}
              >
                <option value="">— не назначен —</option>
                {staffUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.email} ({u.role_name})
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={clearAssigned}
                onChange={(e) => {
                  setClearAssigned(e.target.checked);
                  if (e.target.checked) setManagerId("");
                }}
              />
              Снять назначение
            </label>
            <button type="submit" disabled={saving} className={btnPrimary}>
              Сохранить статус / менеджера
            </button>
          </form>

          <form onSubmit={onAddComment} className="mt-6 space-y-2 border-t border-slate-800 pt-4">
            <h3 className="text-sm text-slate-400">Комментарий</h3>
            <textarea
              className={fieldClass}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Текст для коллег…"
            />
            <button type="submit" disabled={saving || !comment.trim()} className={btnGhost}>
              Отправить комментарий
            </button>
          </form>
        </section>
      </div>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
        <h2 className="text-slate-300 font-medium mb-3">Комментарии</h2>
        <ul className="space-y-3">
          {(detail.comments || []).map((c) => (
            <li key={c.id} className="text-sm border-l-2 border-slate-700 pl-3">
              <span className="text-slate-500">{c.user_email}</span>
              <span className="text-slate-600 text-xs ml-2">
                {c.created_at ? new Date(c.created_at).toLocaleString("ru-RU") : ""}
              </span>
              <p className="text-slate-200 mt-1 whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
        {!detail.comments?.length && <p className="text-slate-600 text-sm">Пока нет.</p>}
      </section>

      <section className="mt-8 rounded-xl border border-slate-800 bg-slate-900/30 p-4">
        <h2 className="text-slate-300 font-medium mb-3">История</h2>
        <ul className="space-y-2 text-xs font-mono text-slate-500">
          {(detail.history || []).map((h) => (
            <li key={h.id} className="border-b border-slate-800/50 pb-2">
              <span className="text-emerald-600/80">{h.event}</span>
              <span className="ml-2">
                {h.created_at ? new Date(h.created_at).toLocaleString("ru-RU") : ""}
              </span>
              <pre className="mt-1 text-slate-600 whitespace-pre-wrap overflow-x-auto">
                {payloadStr(h.payload)}
              </pre>
            </li>
          ))}
        </ul>
        {!detail.history?.length && <p className="text-slate-600 text-sm">Пока пусто.</p>}
      </section>
    </div>
  );
}
