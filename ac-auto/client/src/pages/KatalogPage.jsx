import { useCallback, useEffect, useState } from "react";
import { fetchHomeMedia, fetchSalonLocations, fetchVehicles } from "../api/publicApi.js";
import { VehicleCatalogSection } from "../components/VehicleCatalogSection.jsx";
import { CarDetailModal } from "../components/CarDetailModal.jsx";
import { CarSelectionQuiz } from "../components/CarSelectionQuiz.jsx";
import { KatalogHeroSection } from "../components/KatalogHeroSection.jsx";
import { CarInspectionSection } from "../components/CarInspectionSection.jsx";
import { IdealCarGuaranteeSection } from "../components/IdealCarGuaranteeSection.jsx";
import { HappyOwnersSection } from "../components/HappyOwnersSection.jsx";
import { PartnerBanksSection } from "../components/PartnerBanksSection.jsx";
import { ReviewsSection } from "../components/ReviewsSection.jsx";
import { SalonLocationsSection } from "../components/SalonLocationsSection.jsx";
import { OurServicesSection } from "../components/OurServicesSection.jsx";
import { TradeInConsultModal } from "../components/TradeInConsultModal.jsx";

/**
 * Главная / и /katalog: герой (как раньше), квиз, каталог, кнопка на /avtomobili, блоки ниже.
 */
export default function KatalogPage() {
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  /** Ответ API адресов; null — ошибка сети, в секции покажутся дефолты */
  const [salonLocationsData, setSalonLocationsData] = useState(null);
  const [homeMedia, setHomeMedia] = useState(null);

  const loadVehicles = useCallback(() => {
    fetchVehicles()
      .then((rows) => setVehicles(Array.isArray(rows) ? rows : []))
      .catch(() => setVehicles([]));
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  useEffect(() => {
    let cancelled = false;
    fetchSalonLocations()
      .then((res) => {
        if (!cancelled) setSalonLocationsData(res ?? null);
      })
      .catch(() => {
        if (!cancelled) setSalonLocationsData(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetchHomeMedia()
      .then((res) => {
        if (!cancelled) setHomeMedia(res ?? null);
      })
      .catch(() => {
        if (!cancelled) setHomeMedia(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
      <KatalogHeroSection onLearnMore={() => setTradeModalOpen(true)} />
      <CarSelectionQuiz />
      <VehicleCatalogSection
        vehicles={vehicles}
        onOpenDetail={setDetailVehicle}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        showGoToCatalogButton
      />
      <OurServicesSection adminImages={homeMedia?.our_services ?? []} />
      <IdealCarGuaranteeSection />
      <CarInspectionSection adminImages={homeMedia?.car_inspection ?? []} />
      <HappyOwnersSection adminImages={homeMedia?.happy_owners ?? []} />
      <PartnerBanksSection />
      <ReviewsSection />
      <SalonLocationsSection data={salonLocationsData} />
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
