import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import { ErrBox, apiErr, btnPrimary, fieldClass } from "../admin/shared.jsx";

/** Вход для moderator / admin (те же JWT, что и у админки). */
export default function StaffLoginPage() {
  const { login, logout, user, booting, isStaff } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [pending, setPending] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || "/staff/applications";

  if (!booting && user && isStaff) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setPending(true);
    try {
      const u = await login(email, password);
      if (u.role !== "admin" && u.role !== "moderator") {
        await logout();
        setErr("Нужна роль сотрудника (moderator или admin)");
        return;
      }
      nav(from, { replace: true });
    } catch (e) {
      setErr(apiErr(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
        <h1 className="text-xl font-semibold text-white">Вход для сотрудников</h1>
        <p className="text-slate-500 text-sm mt-1">Moderator или admin</p>
        <ErrBox msg={err} />
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <label className="block text-sm text-slate-400">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              autoComplete="username"
            />
          </label>
          <label className="block text-sm text-slate-400">
            Пароль
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              autoComplete="current-password"
            />
          </label>
          <button type="submit" disabled={pending} className={`w-full ${btnPrimary}`}>
            {pending ? "Входим…" : "Войти"}
          </button>
        </form>
        <a href="/" className="block text-center text-xs text-slate-500 mt-6 hover:text-emerald-400">
          На сайт
        </a>
      </div>
    </div>
  );
}
