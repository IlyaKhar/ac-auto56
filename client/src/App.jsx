import { useEffect, useState } from "react";
import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL ?? "";

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    const url = `${apiBase}/api/v1/health`;
    axios
      .get(url)
      .then((r) => setHealth(r.data))
      .catch(() => setHealth({ status: "error" }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold tracking-tight">AC Auto</h1>
        <p className="mt-2 text-slate-400 text-sm">
          Каркас SPA: дальше весь контент только из API.
        </p>
        <p className="mt-6 text-sm font-mono text-emerald-400">
          GET /api/v1/health → {health ? JSON.stringify(health) : "…"}
        </p>
      </div>
    </div>
  );
}
