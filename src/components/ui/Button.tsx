"use client";

import Link from "next/link";
import { useRef, type ComponentProps, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { getGsap } from "@/lib/motion";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

type Props = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  external?: boolean;
  magnetic?: boolean;
} & Omit<ComponentProps<"button">, "children">;

const base =
  "group relative inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-[2px] font-medium tracking-[-0.01em] transition-[background-color,color,border-color,transform] duration-300 ease-out select-none";

const variants: Record<Variant, string> = {
  primary: "bg-(--btn-bg) text-(--btn-fg) hover:opacity-[0.92]",
  outline: "border border-(--line-strong) text-(--fg) hover:border-(--fg)",
  ghost: "text-(--fg) underline-offset-[6px] decoration-(--line-strong) hover:decoration-(--fg) underline px-0",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" />
    </svg>
  );
}

/** CTA with an optional magnetic pull on fine pointers. Never animates on touch or reduced motion. */
export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  external,
  magnetic = false,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const classes = `${base} ${variants[variant]} ${variant === "ghost" ? "h-auto" : sizes[size]} ${className}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !magnetic) return;
      const { gsap } = getGsap();
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * 0.22);
          yTo(dy * 0.22);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [magnetic] },
  );

  const content = (
    <>
      <span>{children}</span>
      {variant !== "ghost" && <Arrow />}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link ref={ref as React.RefObject<HTMLAnchorElement>} href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button ref={ref as React.RefObject<HTMLButtonElement>} className={classes} {...rest}>
      {content}
    </button>
  );
}
