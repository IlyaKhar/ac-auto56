const A = "ac_auto_access";
const R = "ac_auto_refresh";

export function getAccess() {
  return localStorage.getItem(A) ?? "";
}

export function getRefresh() {
  return localStorage.getItem(R) ?? "";
}

export function setTokens(access, refresh) {
  localStorage.setItem(A, access);
  localStorage.setItem(R, refresh);
}

export function clearTokens() {
  localStorage.removeItem(A);
  localStorage.removeItem(R);
}
