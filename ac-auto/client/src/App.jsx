import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layout/PublicLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import KatalogPage from "./pages/KatalogPage.jsx";
import AvtomobiliPage from "./pages/AvtomobiliPage.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import CmsPage from "./pages/CmsPage.jsx";
import StaticServiceLandingPage from "./pages/StaticServiceLandingPage.jsx";
import VykupPage from "./pages/VykupPage.jsx";
import TradeInPage from "./pages/TradeInPage.jsx";
import AvtoservisPage from "./pages/AvtoservisPage.jsx";
import MolyarnyjCehPage from "./pages/MolyarnyjCehPage.jsx";
import RostoshCarwashPage from "./pages/RostoshCarwashPage.jsx";
import AboutCompanyPage from "./pages/AboutCompanyPage.jsx";
import KomissionnayaProdazhaPage from "./pages/KomissionnayaProdazhaPage.jsx";
import AvtokreditovaniePage from "./pages/AvtokreditovaniePage.jsx";
import AvtostrakhovaniePage from "./pages/AvtostrakhovaniePage.jsx";
import IdealCarGuaranteePage from "./pages/IdealCarGuaranteePage.jsx";
import { STATIC_SERVICE_SLUGS } from "./data/staticServices.js";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import { RequireAdmin } from "./admin/RequireAdmin.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminLoginPage from "./admin/AdminLoginPage.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminCategories from "./admin/AdminCategories.jsx";
import AdminServices from "./admin/AdminServices.jsx";
import AdminPagesList from "./admin/AdminPagesList.jsx";
import AdminPageEditor from "./admin/AdminPageEditor.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import AdminMenu from "./admin/AdminMenu.jsx";
import AdminFooter from "./admin/AdminFooter.jsx";
import AdminVehicles from "./admin/AdminVehicles.jsx";
import AdminSalonLocations from "./admin/AdminSalonLocations.jsx";
import AdminAboutGallery from "./admin/AdminAboutGallery.jsx";
import AdminHomeMedia from "./admin/AdminHomeMedia.jsx";
import { RequireStaff } from "./staff/RequireStaff.jsx";
import StaffLayout from "./staff/StaffLayout.jsx";
import StaffLoginPage from "./staff/StaffLoginPage.jsx";
import StaffApplicationsPage from "./staff/StaffApplicationsPage.jsx";
import StaffApplicationDetail from "./staff/StaffApplicationDetail.jsx";

/** Публичный сайт + админка + панель staff (заявки). */
export default function App() {
  return (
    <Routes>
      <Route path="/staff/login" element={<StaffLoginPage />} />
      <Route
        path="/staff"
        element={
          <RequireStaff>
            <StaffLayout />
          </RequireStaff>
        }
      >
        <Route index element={<Navigate to="applications" replace />} />
        <Route path="applications" element={<StaffApplicationsPage />} />
        <Route path="applications/:id" element={<StaffApplicationDetail />} />
        <Route path="*" element={<Navigate to="/staff/applications" replace />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="vehicles" element={<AdminVehicles />} />
        <Route path="salon-locations" element={<AdminSalonLocations />} />
        <Route path="about-gallery" element={<AdminAboutGallery />} />
        <Route path="home-media" element={<AdminHomeMedia />} />
        <Route path="pages" element={<AdminPagesList />} />
        <Route path="pages/:pageId" element={<AdminPageEditor />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="footer" element={<AdminFooter />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route element={<PublicLayout />}>
        {/* Главная = та же витрина каталога, что и /katalog (акцент на авто). Услуги — /uslugi */}
        <Route path="/" element={<KatalogPage />} />
        <Route path="/katalog" element={<KatalogPage />} />
        <Route path="/avtomobili" element={<AvtomobiliPage />} />
        <Route path="/page/idealnyy-avtomobil-s-garantiey" element={<IdealCarGuaranteePage />} />
        <Route path="/page/vykup" element={<VykupPage />} />
        <Route path="/page/trade-in" element={<TradeInPage />} />
        <Route path="/komissionnaya-prodazha" element={<KomissionnayaProdazhaPage />} />
        <Route path="/page/komissionnaya-prodazha" element={<Navigate to="/komissionnaya-prodazha" replace />} />
        <Route path="/avtokreditovanie" element={<AvtokreditovaniePage />} />
        <Route path="/page/avtokreditovanie" element={<Navigate to="/avtokreditovanie" replace />} />
        <Route path="/avtostrakhovanie" element={<AvtostrakhovaniePage />} />
        <Route path="/page/avtostrakhovanie" element={<Navigate to="/avtostrakhovanie" replace />} />
        <Route path="/page/avtoservis" element={<AvtoservisPage />} />
        <Route path="/avtoservis" element={<Navigate to="/page/avtoservis" replace />} />
        <Route path="/page/molyarnyj-ceh" element={<MolyarnyjCehPage />} />
        <Route path="/molyarnyj-ceh" element={<Navigate to="/page/molyarnyj-ceh" replace />} />
        <Route path="/rostosh_carwash" element={<RostoshCarwashPage />} />
        <Route path="/page/avtomoyka" element={<Navigate to="/rostosh_carwash" replace />} />
        <Route path="/o-kompanii" element={<AboutCompanyPage />} />
        <Route path="/page/o-kompanii" element={<Navigate to="/o-kompanii" replace />} />
        <Route path="/uslugi" element={<HomePage />} />
        <Route path="/services/:id" element={<ServicePage />} />
        {STATIC_SERVICE_SLUGS.map((slug) => (
          <Route
            key={slug}
            path={`/page/${slug}`}
            element={<StaticServiceLandingPage slug={slug} />}
          />
        ))}
        <Route path="/page/:slug" element={<CmsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
