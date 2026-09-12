"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getGsap, MOTION_OK } from "@/lib/motion";

type Item = { year: string; title: string; text: string };

/** Vertical timeline with a line that draws as the reader scrolls. */
export function Timeline({ items }: { items: Item[] }) {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const { gsap } = getGsap();
      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          q("[data-line]"),
          { scaleY: 0 },
          { scaleY: 1, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 75%", scrub: 0.5 } },
        );
        q("[data-item]").forEach((item) => {
          gsap.from(item, { opacity: 0, x: -16, duration: 0.9, scrollTrigger: { trigger: item, start: "top 85%", once: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <ol ref={root} className="relative pl-8 sm:pl-12">
      <span aria-hidden="true" className="absolute left-[5px] top-2 h-[calc(100%-1rem)] w-px bg-(--line) sm:left-[7px]">
        <span data-line className="block h-full w-px bg-(--accent)" />
      </span>
      {items.map((it) => (
        <li key={it.year + it.title} data-item className="relative grid gap-2 border-b border-(--line) py-7 sm:grid-cols-[7rem_1fr] sm:gap-8">
          <span aria-hidden="true" className="absolute -left-8 top-[2.35rem] size-3 rounded-full border border-(--accent) bg-(--bg) sm:-left-12 sm:size-[15px]" />
          <span className="numeral text-[1.5rem] text-(--accent)">{it.year}</span>
          <div>
            <h3 className="display display-sm text-[1.35rem] sm:text-[1.5rem]">{it.title}</h3>
            <p className="mt-2 max-w-xl text-(--muted)">{it.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
