"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Jediný IntersectionObserver pro celý web. Prvky s `data-reveal` dostanou
 * po vstupu do viewportu `data-shown="true"`, zbytek řeší CSS (utilita `reveal`).
 * Bez JS i při prefers-reduced-motion je obsah vidět rovnou.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.setAttribute("data-shown", "true"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "true");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
