import { useEffect, useRef } from "react";

/**
 * Загружает api.js Cloudflare и рендерит Turnstile в контейнер.
 * key на родителе — сброс виджета после успешной отправки формы.
 */
function loadTurnstileScript() {
  if (typeof window === "undefined") return Promise.reject();
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile script"));
    document.head.appendChild(s);
  });
}

export function TurnstileField({ siteKey, onToken, variant = "dark" }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    if (!siteKey) return undefined;
    let cancelled = false;

    (async () => {
      try {
        await loadTurnstileScript();
      } catch {
        onToken("");
        return;
      }
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: variant === "light" ? "light" : "dark",
        callback: (token) => onToken(token),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
    })();

    return () => {
      cancelled = true;
      const id = widgetIdRef.current;
      widgetIdRef.current = null;
      if (id != null && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          /* уже снят */
        }
      }
    };
  }, [siteKey, onToken, variant]);

  if (!siteKey) return null;

  const wrap =
    variant === "light"
      ? "rounded-lg border border-neutral-200 bg-neutral-50 p-3 min-h-[65px]"
      : "rounded-lg border border-slate-800 bg-slate-900/50 p-3 min-h-[65px]";

  return (
    <div className={wrap}>
      <div ref={containerRef} className="cf-turnstile" />
    </div>
  );
}
