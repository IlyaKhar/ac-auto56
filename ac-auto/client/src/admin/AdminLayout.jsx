import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const links = [
  { to: "/admin/dashboard", label: "Обзор" },
  { to: "/staff/applications", label: "Заявки (staff)" },
  { to: "/admin/categories", label: "Категории" },
  { to: "/admin/services", label: "Услуги" },
  { to: "/admin/vehicles", label: "Автомобили" },
  { to: "/admin/salon-locations", label: "Адреса салона" },
  { to: "/admin/about-gallery", label: "О компании — слайдер" },
  { to: "/admin/pages", label: "Страницы" },
  { to: "/admin/users", label: "Пользователи" },
  { to: "/admin/menu", label: "Меню" },
  { to: "/admin/footer", label: "Футер" },
];

/** Каркас админки: боковая навигация + выход. */
export default function AdminLayout() {
  const { logout, user } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    await logout();
    nav("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <aside className="w-52 border-r border-slate-800 bg-slate-900/80 p-4 flex flex-col gap-2 shrink-0">
        <div className="text-xs text-slate-500 mb-2">Админ</div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `px-2 py-1.5 rounded text-sm ${isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
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
