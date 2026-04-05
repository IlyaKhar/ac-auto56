import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, logoutRequest, meRequest } from "../api/authApi.js";
import { clearTokens, getAccess, getRefresh, setTokens } from "./tokenStorage.js";

const AuthContext = createContext(null);

/** Контекст сессии: после логина кладём JWT в localStorage, Bearer вешает authHttp. */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  const loadMe = useCallback(async () => {
    if (!getAccess()) {
      setUser(null);
      return;
    }
    const u = await meRequest();
    setUser(u);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await loadMe();
      } catch {
        if (alive) {
          clearTokens();
          setUser(null);
        }
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [loadMe]);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    setTokens(data.access_token, data.refresh_token);
    const u = await meRequest();
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest(getRefresh());
    } catch {
      /* гасим сеть */
    }
    clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(() => {
    const role = user?.role;
    const isAdmin = role === "admin";
    const isStaff = isAdmin || role === "moderator";
    return {
      user,
      booting,
      login,
      logout,
      loadMe,
      isAdmin,
      isStaff,
    };
  }, [user, booting, login, logout, loadMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth вне AuthProvider");
  return v;
}
