"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getGsap, MOTION_OK } from "@/lib/motion";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
  duration?: number;
};

const nf = (decimals: number) =>
  new Intl.NumberFormat("cs-CZ", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Animated numeral. Renders the final value statically for no-JS and reduced motion. */
export function Counter({ value, prefix = "", suffix = "", className, decimals = 0, duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${nf(decimals).format(value)}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const { gsap } = getGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const state = { n: 0 };
        gsap.to(state, {
          n: value,
          duration,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = `${prefix}${nf(decimals).format(state.n)}${suffix}`;
          },
          onComplete: () => {
            el.textContent = final;
          },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className} aria-label={final}>
      {final}
    </span>
  );
}
