/** Формат цены для РФ: «1 070 000 р.» */
export function formatRub(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "—";
  return `${new Intl.NumberFormat("ru-RU").format(n)} р.`;
}
