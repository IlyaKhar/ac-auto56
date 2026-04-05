import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

/** Пускаем только admin (роль из JWT /me). */
export function RequireAdmin({ children }) {
  const { user, booting, isAdmin } = useAuth();
  const loc = useLocation();

  if (booting) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Загрузка сессии…
      </div>
    );
  }
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
