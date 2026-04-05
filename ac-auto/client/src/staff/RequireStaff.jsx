import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

/** Доступ к /staff — moderator или admin. */
export function RequireStaff({ children }) {
  const { user, booting, isStaff } = useAuth();
  const loc = useLocation();

  if (booting) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Загрузка сессии…
      </div>
    );
  }
  if (!user || !isStaff) {
    return <Navigate to="/staff/login" replace state={{ from: loc.pathname }} />;
  }
  return children;
}
