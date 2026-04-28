import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchVehicles } from "../api/publicApi.js";
import { AvtomobiliHeroSection } from "../components/AvtomobiliHeroSection.jsx";
import { CarDetailModal } from "../components/CarDetailModal.jsx";
import { TradeInConsultModal } from "../components/TradeInConsultModal.jsx";
import { VehicleCatalogSection } from "../components/VehicleCatalogSection.jsx";
import { useFavoriteVehicles } from "../hooks/useFavoriteVehicles.js";

/** Страница избранных автомобилей. */
export default function FavoritesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const { favoriteIds, toggleFavorite } = useFavoriteVehicles();

  const loadVehicles = useCallback(() => {
    fetchVehicles()
      .then((rows) => setVehicles(Array.isArray(rows) ? rows : []))
      .catch(() => setVehicles([]));
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const favoriteVehicles = useMemo(
    () => vehicles.filter((v) => favoriteIds.has(Number(v?.id))),
    [vehicles, favoriteIds],
  );

  return (
    <div>
      <AvtomobiliHeroSection catalogAnchorId="favorites-catalog" />
      <div id="favorites-catalog">
        <VehicleCatalogSection
          vehicles={favoriteVehicles}
          onOpenDetail={setDetailVehicle}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          showGoToCatalogButton={false}
          hideGridTitle
          showCatalogFilters={false}
        />
      </div>

      {favoriteVehicles.length === 0 ? (
        <section className="bg-white pb-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-sm text-neutral-500 md:text-base">
              Пока нет избранных автомобилей. Добавьте авто через кнопку с сердцем в каталоге.
            </p>
          </div>
        </section>
      ) : null}

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

