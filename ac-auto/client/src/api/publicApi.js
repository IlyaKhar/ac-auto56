import { api } from "./client.js";

/** Публичные эндпоинты /api/v1 — без JWT. */

export function fetchCategories() {
  return api.get("/api/v1/service-categories").then((r) => r.data);
}

export function fetchServices(params = {}) {
  return api.get("/api/v1/services", { params }).then((r) => r.data);
}

export function fetchService(id) {
  return api.get(`/api/v1/services/${id}`).then((r) => r.data);
}

export function fetchPublishedPage(slug) {
  return api.get(`/api/v1/pages/${encodeURIComponent(slug)}`).then((r) => r.data);
}

/** Блок адресов салона на главной (настройки + точки из БД). */
export function fetchSalonLocations() {
  return api.get("/api/v1/salon-locations").then((r) => r.data);
}

/** 5 слотов слайдера «О компании» (пути к public или URL). */
export function fetchAboutGallery() {
  return api.get("/api/v1/about-gallery").then((r) => r.data);
}

/** Фото для блоков на главной: наши услуги / проверка / счастливые обладатели. */
export function fetchHomeMedia() {
  return api.get("/api/v1/home-media").then((r) => r.data);
}

export function fetchMenu() {
  return api.get("/api/v1/menu-items").then((r) => r.data);
}

export function fetchFooter() {
  return api.get("/api/v1/footer-sections").then((r) => r.data);
}

export function fetchVehicles() {
  return api.get("/api/v1/vehicles").then((r) => r.data);
}

export function fetchVehicle(id) {
  return api.get(`/api/v1/vehicles/${encodeURIComponent(id)}`).then((r) => r.data);
}

/** Заявка с сайта (капча опциональна при TURNSTILE_SKIP на бэке). */
export function createApplication(body) {
  return api.post("/api/v1/applications", body).then((r) => r.data);
}
