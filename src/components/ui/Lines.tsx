"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { getGsap, MOTION_OK, splitWords } from "@/lib/motion";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
};

/**
 * Word-by-word headline reveal. Each word rises from a masked line.
 * Text stays a single string for screen readers (aria-label) and without JS.
 */
export function Lines({ as: Tag = "h2", children, className, delay = 0, stagger = 0.045 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const { gsap } = getGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = splitWords(el);
        gsap.from(words, {
          yPercent: 130,
          duration: 1,
          delay,
          stagger,
          ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
