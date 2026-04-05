/**
 * Пункты нижнего ряда шапки, если в админке меню ещё пустое (как на ac-auto56).
 * После заполнения меню в API этот список не используется.
 */
export const DEFAULT_HEADER_NAV = [
  { id: "default-nav-katalog", label: "Каталог авто", href: "/avtomobili", parent_id: null },
  { id: "default-nav-trade", label: "Trade-In", href: "/page/trade-in", parent_id: null },
  { id: "default-nav-vykup", label: "Выкуп", href: "/page/vykup", parent_id: null },
  { id: "default-nav-servis", label: "Автосервис", href: "/page/avtoservis", parent_id: null },
  { id: "default-nav-malyar", label: "Молярный цех", href: "/page/molyarnyj-ceh", parent_id: null },
  { id: "default-nav-moyka", label: "Автомойка", href: "/rostosh_carwash", parent_id: null },
  { id: "default-nav-about", label: "О компании", href: "/o-kompanii", parent_id: null },
];
