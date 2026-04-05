import axios from "axios";
import { api } from "./client.js";

/** Логин / me — через общий клиент (без Bearer до логина). */

export function loginRequest(email, password) {
  return api.post("/api/v1/auth/login", { email, password }).then((r) => r.data);
}

export function meRequest() {
  return api.get("/api/v1/auth/me").then((r) => r.data);
}

export function logoutRequest(refreshToken) {
  return api.post("/api/v1/auth/logout", { refresh_token: refreshToken || "" });
}

/** Refresh отдельным вызовом, чтобы не зациклить интерцептор. */
export function refreshRequest(refreshToken) {
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  return axios
    .post(
      `${base ? base : ""}/api/v1/auth/refresh`,
      { refresh_token: refreshToken },
      { headers: { Accept: "application/json" } },
    )
    .then((r) => r.data);
}
