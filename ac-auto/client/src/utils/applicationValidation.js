const MIN_NAME_LEN = 2;
const MAX_NAME_LEN = 60;
const MIN_YEAR = 1950;

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

export function normalizePhoneForApi(value) {
  const digits = digitsOnly(value);
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  return String(value || "").trim();
}

export function validateName(value) {
  const name = String(value || "").trim();
  if (!name) return "Укажите имя";
  if (name.length < MIN_NAME_LEN) return "Имя слишком короткое";
  if (name.length > MAX_NAME_LEN) return "Имя слишком длинное";
  return "";
}

export function validatePhone(value) {
  const digits = digitsOnly(value);
  if (!digits) return "Укажите телефон";
  if (digits.length === 10) return "";
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) return "";
  return "Введите корректный номер телефона";
}

export function validateCity(cityMode, otherCity) {
  if (cityMode !== "other") return "";
  const city = String(otherCity || "").trim();
  if (!city) return "Укажите город";
  if (city.length < 2) return "Название города слишком короткое";
  return "";
}

export function validateCarTradeForm({ brand, model, year, mileage, name, phone, cityMode, otherCity }) {
  const brandVal = String(brand || "").trim();
  const modelVal = String(model || "").trim();
  const yearVal = String(year || "").trim();

  if (!brandVal) return "Укажите марку автомобиля";
  if (!modelVal) return "Укажите модель автомобиля";
  if (!yearVal) return "Укажите год выпуска";
  if (!/^\d{4}$/.test(yearVal)) return "Год выпуска должен быть в формате ГГГГ";

  const yearNum = Number(yearVal);
  const maxYear = new Date().getFullYear() + 1;
  if (yearNum < MIN_YEAR || yearNum > maxYear) return "Укажите корректный год выпуска";

  if (!String(mileage || "").trim()) return "Выберите пробег из списка";

  const cityErr = validateCity(cityMode, otherCity);
  if (cityErr) return cityErr;

  const nameErr = validateName(name);
  if (nameErr) return nameErr;

  const phoneErr = validatePhone(phone);
  if (phoneErr) return phoneErr;

  return "";
}
