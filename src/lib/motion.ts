"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers GSAP plugins once (client only). */
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    gsap.defaults({ ease: "power3.out", duration: 0.9 });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Splits text into word spans for staggered reveals while keeping nested
 * elements (e.g. serif accents) and a readable aria-label for assistive tech.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split === "1") return Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
  el.setAttribute("aria-label", (el.textContent ?? "").replace(/\s+/g, " ").trim());
  const spans: HTMLElement[] = [];

  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const w of (child.textContent ?? "").split(/(\s+)/)) {
          if (!w) continue;
          if (/^\s+$/.test(w)) {
            frag.appendChild(document.createTextNode(" "));
            continue;
          }
          const outer = document.createElement("span");
          outer.className = "inline-block overflow-hidden align-bottom pt-[0.2em] -mt-[0.2em] pb-[0.2em] -mb-[0.2em]";
          outer.setAttribute("aria-hidden", "true");
          const inner = document.createElement("span");
          inner.className = "inline-block";
          inner.dataset.word = "";
          inner.textContent = w;
          outer.appendChild(inner);
          frag.appendChild(outer);
          spans.push(inner);
        }
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.nodeName !== "BR") {
        walk(child);
      }
    });
  };

  walk(el);
  el.dataset.split = "1";
  return spans;
}
