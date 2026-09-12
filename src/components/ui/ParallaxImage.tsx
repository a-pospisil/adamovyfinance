"use client";

import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { getGsap, MOTION_OK } from "@/lib/motion";

type Props = Omit<ImageProps, "fill"> & {
  /** Aspect ratio classes for the frame, e.g. "aspect-[4/5]". */
  frameClassName?: string;
  caption?: string;
  /** Parallax travel in percent of the image height. */
  travel?: number;
};

/** Framed image that drifts slightly slower than the page (transform only, reduced-motion aware). */
export function ParallaxImage({ frameClassName = "aspect-[4/5]", caption, travel = 10, className = "", alt, ...img }: Props) {
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = frame.current;
      if (!el) return;
      const { gsap } = getGsap();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          el.querySelector("img"),
          { yPercent: -travel },
          { yPercent: travel, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.4 } },
        );
      });
      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={`relative overflow-hidden ${frameClassName}`}>
      <Image {...img} alt={alt} fill className={`scale-[1.22] object-cover ${className}`} />
      {caption && (
        <>
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
          <p className="absolute bottom-5 left-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ivory-100/90">{caption}</p>
        </>
      )}
    </div>
  );
}
