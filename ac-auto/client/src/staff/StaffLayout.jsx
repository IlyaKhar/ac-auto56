import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

/** Оболочка панели сотрудников. */
export default function StaffLayout() {
  const { logout, user, isAdmin } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    await logout();
    nav("/staff/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-52 border-r border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-2 shrink-0">
        <div className="text-xs text-slate-500 mb-2">Staff</div>
        <NavLink
          to="/staff/applications"
          className={({ isActive }) =>
            `px-2 py-1.5 rounded text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`
          }
        >
          Заявки
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin/dashboard"
            className="px-2 py-1.5 rounded text-sm text-amber-500/90 hover:text-amber-400"
          >
            Админка →
          </NavLink>
        )}
        <div className="flex-1" />
        <p className="text-xs text-slate-600 truncate" title={user?.email}>
          {user?.email}
        </p>
        <button type="button" onClick={onLogout} className="text-left text-sm text-red-400 hover:underline">
          Выйти
        </button>
        <a href="/" className="text-xs text-slate-500 hover:text-emerald-400">
          На сайт →
        </a>
      </aside>
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}
