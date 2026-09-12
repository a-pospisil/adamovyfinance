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

function Rule() {
  return (
    <span
      aria-hidden="true"
      className="h-px w-5 bg-current transition-[width] duration-300 ease-out group-hover:w-8"
    />
  );
}

/** Tlačítko ve stylu tištěného formuláře: bez rádiusů, bez stínů, s tenkou linkou místo šipky. */
export function Button({ href, variant = "solid", className = "", children, external, ...rest }: Props) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <Rule />
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
