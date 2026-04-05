/**
 * Плоский список меню с бэка: телефон (href tel:), все корневые пункты в один ряд навигации, дети по parent_id.
 */
export function buildMenuParts(flatItems) {
  if (!Array.isArray(flatItems)) {
    return { phone: null, navRoots: [], childrenMap: new Map() };
  }
  const sorted = [...flatItems].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id,
  );
  const roots = sorted.filter((i) => i.parent_id == null);
  const phone = roots.find((r) => r.href?.trim().startsWith("tel:")) ?? null;
  const navRoots = roots.filter((r) => r.id !== phone?.id);

  const childrenMap = new Map();
  for (const i of sorted) {
    if (i.parent_id != null) {
      const list = childrenMap.get(i.parent_id) ?? [];
      list.push(i);
      childrenMap.set(i.parent_id, list);
    }
  }
  for (const [, list] of childrenMap) {
    list.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id);
  }
  return { phone, navRoots, childrenMap };
}
