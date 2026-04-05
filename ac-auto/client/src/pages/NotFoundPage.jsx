import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <p className="mb-4 text-neutral-600">Страница не найдена</p>
      <Link to="/" className="text-sm text-ac-red hover:underline">
        На главную
      </Link>
    </div>
  );
}
