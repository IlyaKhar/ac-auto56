import { useCallback, useEffect, useState } from "react";
import { fetchVehicles } from "../api/publicApi.js";
import { CarDetailModal } from "../components/CarDetailModal.jsx";
import { TradeInConsultModal } from "../components/TradeInConsultModal.jsx";
import { AvtomobiliHeroSection } from "../components/AvtomobiliHeroSection.jsx";
import { VehicleCatalogSection } from "../components/VehicleCatalogSection.jsx";

/** Полный каталог авто: герой + сетка + пагинация. */
export default function AvtomobiliPage() {
  const [vehicles, setVehicles] = useState([]);
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [tradeModalOpen, setTradeModalOpen] = useState(false);

  const loadVehicles = useCallback(() => {
    fetchVehicles()
      .then((rows) => setVehicles(Array.isArray(rows) ? rows : []))
      .catch(() => setVehicles([]));
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div>
      <AvtomobiliHeroSection catalogAnchorId="avtomobili-catalog" />
      <div id="avtomobili-catalog">
        <VehicleCatalogSection
          vehicles={vehicles}
          onOpenDetail={setDetailVehicle}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          showGoToCatalogButton={false}
          hideGridTitle
          showCatalogFilters
        />
      </div>
      <CarDetailModal
        open={Boolean(detailVehicle)}
        vehicle={detailVehicle}
        onClose={() => setDetailVehicle(null)}
        onConsult={() => setTradeModalOpen(true)}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
      <TradeInConsultModal open={tradeModalOpen} onClose={() => setTradeModalOpen(false)} />
    </div>
  );
}
