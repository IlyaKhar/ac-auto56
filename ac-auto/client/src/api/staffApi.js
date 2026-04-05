import { api } from "./client.js";

const s = "/api/v1/staff";

/** Заявки и сотрудники — JWT с ролью moderator или admin. */

export function staffListApplications(params) {
  return api.get(`${s}/applications`, { params }).then((r) => r.data);
}

export function staffGetApplication(id) {
  return api.get(`${s}/applications/${id}`).then((r) => r.data);
}

export function staffPatchApplication(id, body) {
  return api.patch(`${s}/applications/${id}`, body);
}

export function staffAddComment(id, text) {
  return api.post(`${s}/applications/${id}/comments`, { body: text }).then((r) => r.data);
}

export function staffListUsers() {
  return api.get(`${s}/users`).then((r) => r.data);
}
