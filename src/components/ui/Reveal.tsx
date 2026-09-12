"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { getGsap, MOTION_OK } from "@/lib/motion";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Delay in seconds after the element enters the viewport. */
  delay?: number;
  /** Distance in px the element travels upward. */
  y?: number;
  id?: string;
};

/** Fades and lifts children into view on scroll. Fully visible without JS or with reduced motion. */
export function Reveal({ as: Tag = "div", children, className, delay = 0, y = 28, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, {
          opacity: 0,
          y,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
