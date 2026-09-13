import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline" | "quiet";

type Props = {
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  external?: boolean;
} & Omit<ComponentProps<"button">, "children">;

const base =
  "group inline-flex items-center justify-center gap-3 whitespace-nowrap label-sm transition-colors duration-300 ease-out";

const variants: Record<Variant, string> = {
  solid: "h-12 px-7 bg-(--btn-bg) text-(--btn-fg) hover:bg-(--accent) hover:text-(--btn-fg)",
  outline: "h-12 px-7 border border-(--line-strong) text-(--fg) hover:border-(--fg)",
  quiet:
    "pb-1 border-b border-(--line-strong) text-(--fg) hover:border-(--accent) hover:text-(--accent)",
};

/** Tenká šipka jako z rytiny; na hover se posune doprava. Sdílí ji tlačítko i textové odkazy. */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-[10px] w-5 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 ${className}`}
    >
      <path d="M0.75 5h17.5M13.5 1.25 18.25 5l-4.75 3.75" />
    </svg>
  );
}

/** Tlačítko ve stylu tištěného formuláře: bez rádiusů, bez stínů, s tenkou šipkou. */
export function Button({ href, variant = "solid", className = "", children, external, ...rest }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <Arrow />
    </>
  );

  if (href) {
    return external ? (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
