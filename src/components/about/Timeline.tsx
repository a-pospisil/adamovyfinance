import { Reveal } from "@/components/ui/Reveal";

type Item = { year: string; title: string; text: string };

/** Časová osa jako řádky rejstříku: rok, název, věta. */
export function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="border-t border-(--line-strong)">
      {items.map((it, i) => (
        <Reveal
          as="li"
          key={it.year + it.title}
          delay={(i % 4) * 60}
          className="grid gap-2 border-b border-(--line) py-6 sm:grid-cols-12 sm:gap-8"
        >
          <span className="nominal text-2xl text-(--accent) sm:col-span-2">{it.year}</span>
          <h3 className="display display-sm sm:col-span-4">{it.title}</h3>
          <p className="max-w-xl text-[0.95rem] text-(--muted) sm:col-span-6">{it.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}
