#!/usr/bin/env sh
# Копирует фото из images/ (Tilda) в client/public/ для Docker и сидов БД.
# Запуск из корня репо: ./scripts/sync-media-to-public.sh

set -eu

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/images"
DST="$ROOT/client/public"

if [ ! -d "$SRC" ]; then
  echo "Нет папки images/ — положи туда экспорт с Tilda" >&2
  exit 1
fi

mkdir -p \
  "$DST/locations" \
  "$DST/home/our-services" \
  "$DST/car-inspection" \
  "$DST/happy-owners" \
  "$DST/insurance-services" \
  "$DST/about-gallery" \
  "$DST/vehicles" \
  "$DST/services"

copy() {
  src_name="$1"
  dest_rel="$2"
  src="$SRC/$src_name"
  dest="$DST/$dest_rel"
  if [ ! -f "$src" ]; then
    echo "Пропуск (нет файла): $src_name" >&2
    return 0
  fi
  mkdir -p "$(dirname "$dest")"
  cp -f "$src" "$dest"
  echo "  $dest_rel"
}

echo "Копируем медиа в client/public …"

echo "Адреса салонов:"
copy "tild6164-3862-4164-b961-393364323161__photo_2025-08-22_10-.jpg" "locations/salon-3a.jpg"
copy "tild3935-3232-4864-a339-353232383437__photo_2024-04-11_17-.jpg" "locations/salon-3.jpg"

echo "Наши услуги (8):"
copy "tild3261-3736-4765-b037-616662386533__family-moving-using-.jpg" "home/our-services/01-vykup.jpg"
copy "tild3436-3937-4234-a534-643534656235___1.jpg" "home/our-services/02-trade-in.jpg"
copy "tild3136-3262-4533-a364-313630303430__car-salesperson-with.jpg" "home/our-services/03-komissiya.jpg"
copy "tild6539-3431-4539-a565-616163313032__stylish-and-elegant-.jpg" "home/our-services/04-avtokredit.jpg"
copy "tild6364-3435-4562-b266-323761633938__close-up-car-bonnet_.png" "home/our-services/05-strakhovanie.png"
copy "tild6661-3834-4237-b137-393561313566__mechanics-using-prog.png" "home/our-services/06-avtoservis.png"
copy "tild3132-6364-4636-a533-646433643030__selective-focus-on-m.jpg" "home/our-services/07-malyarka.jpg"
copy "tild6363-3561-4133-b638-633266383635___.jpg" "home/our-services/08-avtomoyka.jpg"

echo "Проверка авто (6):"
copy "tild6661-3834-4237-b137-393561313566__mechanics-using-prog.png" "car-inspection/01-dvigatel.png"
copy "tild3132-6364-4636-a533-646433643030__selective-focus-on-m.jpg" "car-inspection/02-kuzov.jpg"
copy "tild6539-3431-4539-a565-616163313032__stylish-and-elegant-.jpg" "car-inspection/03-salon.jpg"
copy "tild6639-3363-4932-b466-313333313131__close-up-on-car-care.jpg" "car-inspection/04-hodovaya.jpg"
copy "tild6233-6230-4665-a536-666166343365__man-photographing-hi.jpg" "car-inspection/05-diagnostika.jpg"
copy "tild6432-6332-4833-b334-303134323164__top-view-photo-of-bu.jpg" "car-inspection/06-dokumenty.jpg"

echo "Счастливые клиенты (9):"
copy "tild6639-3539-4564-a330-323761613665__happy-customers-in-c.jpg" "happy-owners/01.jpg"
copy "tild3136-3262-4533-a364-313630303430__car-salesperson-with.jpg" "happy-owners/02.jpg"
copy "tild6535-3764-4637-a539-313665646166__2c61c6d0-ad3f-4add-9.jpeg" "happy-owners/03.jpg"
copy "tild6563-3732-4333-b362-333033646636__2ac41f87-6b5d-4136-b.jpeg" "happy-owners/04.jpg"
copy "tild6662-3461-4533-a638-333436323234__a9ef5b60-b448-4ce8-a.jpeg" "happy-owners/05.jpg"
copy "tild3464-3933-4032-b664-303566646130__7ff4a98d-473d-493c-a.jpeg" "happy-owners/06.jpg"
copy "tild3437-3833-4761-a335-306238643235__375c5885-c0a8-435a-8.jpeg" "happy-owners/07.jpg"
copy "tild6438-6434-4838-b835-643531613466__photo_2026-03-23_12-.jpg" "happy-owners/08.jpg"
copy "tild6565-3438-4533-b139-393432333336__img_0688.jpg" "happy-owners/09.jpg"

echo "Страхование (4):"
copy "tild6364-3435-4562-b266-323761633938__close-up-car-bonnet_.png" "insurance-services/osago.png"
copy "tild3436-3937-4234-a534-643534656235___1.jpg" "insurance-services/kasko.jpg"
copy "tild3261-3736-4765-b037-616662386533__family-moving-using-.jpg" "insurance-services/life.jpg"
copy "tild6539-3431-4539-a565-616163313032__stylish-and-elegant-.jpg" "insurance-services/gap.jpg"

echo "О компании — слайдер (5):"
copy "tild6131-6431-4166-b661-313039343530__photo_2024-03-15_19-.jpg" "about-gallery/01.jpg"
copy "tild6164-3862-4164-b961-393364323161__photo_2025-08-22_10-.jpg" "about-gallery/02.jpg"
copy "tild3935-3232-4864-a339-353232383437__photo_2024-04-11_17-.jpg" "about-gallery/03.jpg"
copy "tild6565-3438-4533-b139-393432333336__img_0688.jpg" "about-gallery/04.jpg"
copy "tild6639-3539-4564-a330-323761613665__happy-customers-in-c.jpg" "about-gallery/05.jpg"

echo "Демо-каталог (4 авто):"
copy "tild6535-3764-4637-a539-313665646166__2c61c6d0-ad3f-4add-9.jpeg" "vehicles/toyota-camry-1.jpg"
copy "tild6662-3461-4533-a638-333436323234__a9ef5b60-b448-4ce8-a.jpeg" "vehicles/kia-rio-1.jpg"
copy "tild3464-3933-4032-b664-303566646130__7ff4a98d-473d-493c-a.jpeg" "vehicles/hyundai-solaris-1.jpg"
copy "tild3437-3833-4761-a335-306238643235__375c5885-c0a8-435a-8.jpeg" "vehicles/vw-polo-1.jpg"

# Дубли в services/ — запасной путь для карточек без админки
copy "tild3163-3162-4737-a637-626431623861___1.jpg" "services/vykup-hero.jpg"
copy "tild3436-3937-4234-a534-643534656235___1.jpg" "services/trade-in.jpg"
copy "tild6363-3561-4133-b638-633266383635___.jpg" "services/avtomoyka.jpg"

echo "Готово. Дальше: docker compose up --build"
