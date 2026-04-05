/**
 * Меню и футер с бэка только если VITE_LAYOUT_FROM_API=true.
 * Иначе шапка/подвал целиком из локальных дефолтов + env (без запросов — не «слетает» без Docker/API).
 */
export const layoutFromApi = import.meta.env.VITE_LAYOUT_FROM_API === "true";
