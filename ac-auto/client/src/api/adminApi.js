import { api } from "./client.js";

const a = "/api/v1/admin";

/** Все вызовы требуют Bearer admin (интерцептор в authHttp). */

export const adminCategories = {
  list: () => api.get(`${a}/service-categories`).then((r) => r.data),
  get: (id) => api.get(`${a}/service-categories/${id}`).then((r) => r.data),
  create: (body) => api.post(`${a}/service-categories`, body).then((r) => r.data),
  patch: (id, body) => api.patch(`${a}/service-categories/${id}`, body),
  remove: (id) => api.delete(`${a}/service-categories/${id}`),
};

export const adminServices = {
  list: () => api.get(`${a}/services`).then((r) => r.data),
  get: (id) => api.get(`${a}/services/${id}`).then((r) => r.data),
  create: (body) => api.post(`${a}/services`, body).then((r) => r.data),
  patch: (id, body) => api.patch(`${a}/services/${id}`, body),
  remove: (id) => api.delete(`${a}/services/${id}`),
};

export const adminAboutGallery = {
  get: () => api.get(`${a}/about-gallery`).then((r) => r.data),
  put: (body) => api.put(`${a}/about-gallery`, body),
};

export const adminSalonLocations = {
  getBundle: () => api.get(`${a}/salon-locations`).then((r) => r.data),
  patchSettings: (body) => api.patch(`${a}/salon-locations/settings`, body),
  createAddress: (body) => api.post(`${a}/salon-locations/addresses`, body).then((r) => r.data),
  patchAddress: (id, body) => api.patch(`${a}/salon-locations/addresses/${id}`, body),
  removeAddress: (id) => api.delete(`${a}/salon-locations/addresses/${id}`),
  reorder: (body) => api.post(`${a}/salon-locations/addresses/reorder`, body),
};

export const adminVehicles = {
  list: () => api.get(`${a}/vehicles`).then((r) => r.data),
  get: (id) => api.get(`${a}/vehicles/${id}`).then((r) => r.data),
  create: (body) => api.post(`${a}/vehicles`, body).then((r) => r.data),
  patch: (id, body) => api.patch(`${a}/vehicles/${id}`, body),
  remove: (id) => api.delete(`${a}/vehicles/${id}`),
};

export const adminPages = {
  list: () => api.get(`${a}/pages`).then((r) => r.data),
  get: (id) => api.get(`${a}/pages/${id}`).then((r) => r.data),
  create: (body) => api.post(`${a}/pages`, body).then((r) => r.data),
  patch: (id, body) => api.patch(`${a}/pages/${id}`, body),
  remove: (id) => api.delete(`${a}/pages/${id}`),
};

export const adminBlocks = {
  list: (pageId) => api.get(`${a}/pages/${pageId}/blocks`).then((r) => r.data),
  create: (pageId, body) => api.post(`${a}/pages/${pageId}/blocks`, body).then((r) => r.data),
  patch: (pageId, blockId, body) => api.patch(`${a}/pages/${pageId}/blocks/${blockId}`, body),
  remove: (pageId, blockId) => api.delete(`${a}/pages/${pageId}/blocks/${blockId}`),
  reorder: (pageId, ids) => api.post(`${a}/pages/${pageId}/blocks/reorder`, { ids }),
};

export const adminUsers = {
  roles: () => api.get(`${a}/roles`).then((r) => r.data),
  list: () => api.get(`${a}/users`).then((r) => r.data),
  get: (id) => api.get(`${a}/users/${id}`).then((r) => r.data),
  create: (body) => api.post(`${a}/users`, body).then((r) => r.data),
  patch: (id, body) => api.patch(`${a}/users/${id}`, body),
  resetPassword: (id, password) => api.post(`${a}/users/${id}/reset-password`, { password }),
};

export const adminMenu = {
  list: () => api.get(`${a}/menu-items`).then((r) => r.data),
  get: (id) => api.get(`${a}/menu-items/${id}`).then((r) => r.data),
  create: (body) => api.post(`${a}/menu-items`, body).then((r) => r.data),
  patch: (id, body) => api.patch(`${a}/menu-items/${id}`, body),
  remove: (id) => api.delete(`${a}/menu-items/${id}`),
  reorder: (ids) => api.post(`${a}/menu-items/reorder`, { ids }),
};

export const adminFooter = {
  list: () => api.get(`${a}/footer-sections`).then((r) => r.data),
  get: (id) => api.get(`${a}/footer-sections/${id}`).then((r) => r.data),
  create: (body) => api.post(`${a}/footer-sections`, body).then((r) => r.data),
  patch: (id, body) => api.patch(`${a}/footer-sections/${id}`, body),
  remove: (id) => api.delete(`${a}/footer-sections/${id}`),
  reorder: (ids) => api.post(`${a}/footer-sections/reorder`, { ids }),
};
