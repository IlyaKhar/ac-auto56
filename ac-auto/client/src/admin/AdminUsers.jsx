import { useCallback, useEffect, useState } from "react";
import { adminUsers } from "../api/adminApi.js";
import { ErrBox, apiErr, btnGhost, btnPrimary, fieldClass } from "./shared.jsx";

const emptyUser = { email: "", password: "", role: "moderator" };

const ROLE_LABELS = {
  admin: "Администратор",
  moderator: "Модератор",
};

function roleLabel(roleName) {
  return ROLE_LABELS[roleName] || roleName;
}

/** Список пользователей, создание, правка, сброс пароля. */
export default function AdminUsers() {
  const [roles, setRoles] = useState([]);
  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [form, setForm] = useState(emptyUser);
  const [editing, setEditing] = useState(null);
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("moderator");
  const [editActive, setEditActive] = useState(true);
  const [resetPwd, setResetPwd] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setErr("");
    try {
      const [r, u] = await Promise.all([adminUsers.roles(), adminUsers.list()]);
      setRoles(Array.isArray(r) ? r : []);
      setList(Array.isArray(u) ? u : []);
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openEdit(row) {
    setEditing(row.id);
    setEditEmail(row.email);
    setEditRole(row.role_name || "moderator");
    setEditActive(row.is_active);
    setResetPwd("");
  }

  function closeEdit() {
    setEditing(null);
  }

  async function onCreate(e) {
    e.preventDefault();
    setErr("");
    try {
      await adminUsers.create({
        email: form.email,
        password: form.password,
        role: form.role,
      });
      setForm(emptyUser);
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  async function onPatch(e) {
    e.preventDefault();
    setErr("");
    try {
      await adminUsers.patch(editing, {
        email: editEmail,
        role: editRole,
        is_active: editActive,
      });
      if (resetPwd.trim().length >= 8) {
        await adminUsers.resetPassword(editing, resetPwd.trim());
      }
      closeEdit();
      await load();
    } catch (e) {
      setErr(apiErr(e));
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Пользователи</h1>
      <ErrBox msg={err} />

      <form
        onSubmit={onCreate}
        className="mb-8 rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3 max-w-lg"
      >
        <h2 className="text-sm font-medium text-slate-300">Новый пользователь</h2>
        <label className="block text-xs text-slate-500">
          Email
          <input
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className="block text-xs text-slate-500">
          Пароль (мин. 8)
          <input
            type="password"
            className={fieldClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            minLength={8}
          />
        </label>
        <label className="block text-xs text-slate-500">
          Роль
          <select
            className={fieldClass}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {roles.map((r) => (
              <option key={r.id} value={r.name}>
                {roleLabel(r.name)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className={btnPrimary}>
          Создать
        </button>
      </form>

      {loading ? (
        <p className="text-slate-500">Загрузка…</p>
      ) : (
        <div className="space-y-4">
          {list.map((u) => (
            <div key={u.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <span className="text-white font-medium">{u.email}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    {roleLabel(u.role_name)} · {u.is_active ? "активен" : "выкл"}
                  </span>
                </div>
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => (editing === u.id ? closeEdit() : openEdit(u))}
                >
                  {editing === u.id ? "Свернуть" : "Изменить"}
                </button>
              </div>
              {editing === u.id && (
                <form onSubmit={onPatch} className="mt-4 space-y-3 border-t border-slate-800 pt-4 max-w-lg">
                  <label className="block text-xs text-slate-500">
                    Email
                    <input
                      type="email"
                      className={fieldClass}
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-xs text-slate-500">
                    Роль
                    <select
                      className={fieldClass}
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {roleLabel(r.name)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-400">
                    <input
                      type="checkbox"
                      checked={editActive}
                      onChange={(e) => setEditActive(e.target.checked)}
                    />
                    Активен
                  </label>
                  <label className="block text-xs text-slate-500">
                    Новый пароль (оставь пустым, если не менять; мин. 8 символов)
                    <input
                      type="password"
                      className={fieldClass}
                      value={resetPwd}
                      onChange={(e) => setResetPwd(e.target.value)}
                      minLength={8}
                    />
                  </label>
                  <div className="flex gap-2">
                    <button type="submit" className={btnPrimary}>
                      Сохранить
                    </button>
                    <button type="button" className={btnGhost} onClick={closeEdit}>
                      Отмена
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
