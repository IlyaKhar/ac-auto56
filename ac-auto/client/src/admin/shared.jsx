/** Сообщение об ошибке из axios (поле error у API). */
export function apiErr(e) {
  return e.response?.data?.error || e.message || "Ошибка";
}

export function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div
      className="rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-sm px-3 py-2 mb-4"
      role="alert"
    >
      {msg}
    </div>
  );
}

export const fieldClass =
  "mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100";

export const btnPrimary =
  "px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 disabled:opacity-50";

export const btnGhost =
  "px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-800";

export const btnDanger =
  "px-3 py-1.5 rounded-lg border border-red-900 text-red-300 text-sm hover:bg-red-950/40";
