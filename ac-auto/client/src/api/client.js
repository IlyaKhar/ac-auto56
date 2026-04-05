import axios from "axios";

/** База API без завершающего слэша — как в Vite env. */
const baseURL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: baseURL || undefined,
  headers: { Accept: "application/json" },
});
