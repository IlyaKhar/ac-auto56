import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMenu, fetchFooter } from "../api/publicApi.js";
import { layoutFromApi } from "../config/layoutApi.js";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { LeadCaptureModal } from "../components/LeadCaptureModal.jsx";
import { FloatingContactWidget } from "../components/FloatingContactWidget.jsx";

/**
 * Публичный сайт. Шапка/подвал: по умолчанию без API (см. VITE_LAYOUT_FROM_API в .env.example).
 */
export default function PublicLayout() {
  const [menu, setMenu] = useState([]);
  const [footer, setFooter] = useState([]);

  useEffect(() => {
    if (!layoutFromApi) {
      return;
    }
    let cancelled = false;
    Promise.all([fetchMenu().catch(() => []), fetchFooter().catch(() => [])]).then(([m, f]) => {
      if (!cancelled) {
        setMenu(Array.isArray(m) ? m : []);
        setFooter(Array.isArray(f) ? f : []);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <SiteHeader items={menu} />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <SiteFooter sections={footer} />
      <LeadCaptureModal />
      <FloatingContactWidget />
    </div>
  );
}
