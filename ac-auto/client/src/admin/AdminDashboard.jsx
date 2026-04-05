import { Link } from "react-router-dom";

const cards = [
  { to: "/admin/categories", title: "Категории услуг", desc: "CRUD + slug" },
  { to: "/admin/services", title: "Услуги", desc: "Привязка к категории" },
  { to: "/admin/pages", title: "Страницы CMS", desc: "Контент + блоки" },
  { to: "/admin/users", title: "Пользователи", desc: "admin / moderator" },
  { to: "/admin/menu", title: "Меню сайта", desc: "Пункты и порядок" },
  { to: "/admin/footer", title: "Футер", desc: "Секции HTML" },
];

/** Стартовый экран со ссылками на разделы. */
export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white mb-2">Панель</h1>
      <p className="text-slate-500 text-sm mb-8">Выбери раздел слева или ниже.</p>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.to}>
            <Link
              to={c.to}
              className="block rounded-xl border border-slate-800 bg-slate-900/50 p-5 hover:border-slate-600 transition"
            >
              <span className="text-white font-medium">{c.title}</span>
              <span className="block text-slate-500 text-sm mt-1">{c.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
