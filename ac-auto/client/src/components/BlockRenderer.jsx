import { SalonLocationsSection } from "./SalonLocationsSection.jsx";

/**
 * Блоки страницы из CMS. theme=light — светлый фон публичного сайта.
 */
export function BlockRenderer({ blocks, theme = "dark" }) {
  const light = theme === "light";
  if (!blocks?.length) {
    return null;
  }

  const sec = light
    ? "rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
    : "rounded-xl border border-slate-800 bg-slate-900/40 p-6";

  return (
    <div className="space-y-8">
      {blocks.map((b) => {
        const bare = b.block_type === "salon_locations";
        return (
          <section key={b.id} className={bare ? "contents" : sec}>
            <BlockOne block={b} light={light} />
          </section>
        );
      })}
    </div>
  );
}

function BlockOne({ block, light }) {
  const d = block.data && typeof block.data === "object" ? block.data : {};

  switch (block.block_type) {
    case "hero":
      return (
        <div className="space-y-2 text-center">
          {d.title && (
            <h2
              className={
                light ? "text-2xl font-bold uppercase text-neutral-900" : "text-2xl font-semibold text-white"
              }
            >
              {d.title}
            </h2>
          )}
          {d.subtitle && (
            <p className={light ? "text-neutral-600" : "text-slate-400"}>{d.subtitle}</p>
          )}
        </div>
      );
    case "text":
    case "rich_text":
      return (
        <div className={light ? "prose prose-sm max-w-none text-neutral-800" : "prose prose-invert prose-sm max-w-none"}>
          {(d.text || d.body || d.content) && (
            <p className={`whitespace-pre-wrap ${light ? "text-neutral-800" : "text-slate-300"}`}>
              {d.text ?? d.body ?? d.content}
            </p>
          )}
        </div>
      );
    case "html":
      if (d.html && typeof d.html === "string") {
        return (
          <div
            className={
              light
                ? "prose prose-sm max-w-none text-neutral-800"
                : "prose prose-invert prose-sm max-w-none text-slate-300"
            }
            dangerouslySetInnerHTML={{ __html: d.html }}
          />
        );
      }
      break;
    case "salon_locations":
      return <SalonLocationsSection data={d} />;
    default:
      break;
  }

  return (
    <div>
      <p
        className={`mb-2 text-xs uppercase tracking-wide ${light ? "text-neutral-400" : "text-slate-500"}`}
      >
        {block.block_type}
      </p>
      <pre
        className={`overflow-x-auto text-xs ${light ? "text-neutral-600" : "text-slate-400"}`}
      >
        {JSON.stringify(block.data ?? {}, null, 2)}
      </pre>
    </div>
  );
}
