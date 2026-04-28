import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ac_auto_favorite_vehicle_ids";

function parseFavoriteIds(raw) {
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((v) => Number.isFinite(Number(v))).map((v) => Number(v)));
  } catch {
    return new Set();
  }
}

/**
 * Единое избранное авто в localStorage.
 * Храним как массив числовых id, в компонентах используем Set.
 */
export function useFavoriteVehicles() {
  const [favoriteIds, setFavoriteIds] = useState(() => {
    if (typeof window === "undefined") return new Set();
    return parseFavoriteIds(window.localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const list = [...favoriteIds].sort((a, b) => a - b);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }, [favoriteIds]);

  const toggleFavorite = useCallback((id) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return;
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(numericId)) next.delete(numericId);
      else next.add(numericId);
      return next;
    });
  }, []);

  return { favoriteIds, toggleFavorite };
}

