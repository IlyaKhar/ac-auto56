import { api } from "./client.js";
import { getAccess, getRefresh, setTokens, clearTokens } from "../auth/tokenStorage.js";
import { refreshRequest } from "./authApi.js";

/**
 * Bearer на каждый запрос + одна попытка refresh при 401.
 * Подключается один раз из main.jsx.
 */
let refreshing = null;

function attachAuthInterceptor() {
  api.interceptors.request.use((config) => {
    const t = getAccess();
    if (t) {
      config.headers.Authorization = `Bearer ${t}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      const cfg = err.config;
      const status = err.response?.status;
      const url = cfg?.url ?? "";

      if (status !== 401 || !cfg || cfg._authRetry) {
        throw err;
      }
      if (url.includes("/auth/login") || url.includes("/auth/refresh")) {
        throw err;
      }

      cfg._authRetry = true;
      const rt = getRefresh();
      if (!rt) {
        clearTokens();
        throw err;
      }

      try {
        if (!refreshing) {
          refreshing = refreshRequest(rt)
            .then((data) => {
              setTokens(data.access_token, data.refresh_token);
              return data.access_token;
            })
            .finally(() => {
              refreshing = null;
            });
        }
        const access = await refreshing;
        cfg.headers.Authorization = `Bearer ${access}`;
        return api(cfg);
      } catch {
        clearTokens();
        throw err;
      }
    },
  );
}

attachAuthInterceptor();
