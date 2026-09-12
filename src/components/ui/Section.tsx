import type { ReactNode } from "react";

type Props = {
  id?: string;
  theme?: "dark" | "light";
  className?: string;
  children: ReactNode;
  /** Adds the default vertical rhythm. */
  padded?: boolean;
  as?: "section" | "div" | "header" | "footer" | "article";
  ariaLabelledby?: string;
};

/** Themed page section. Children inherit --bg/--fg/--line variables. */
export function Section({
  id,
  theme = "dark",
  className = "",
  children,
  padded = true,
  as: Tag = "section",
  ariaLabelledby,
}: Props) {
  return (
    <Tag
      id={id}
      data-theme={theme}
      aria-labelledby={ariaLabelledby}
      className={`themed relative ${padded ? "section-y" : ""} ${className}`}
    >
      <div className="container-x">{children}</div>
    </Tag>
  );
}

type EyebrowProps = { index?: string; children: ReactNode; className?: string };

/** Mono section label with optional running index: "03 — Financování jako systém". */
export function Eyebrow({ index, children, className = "" }: EyebrowProps) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${className}`}>
      {index && (
        <>
          <span className="text-(--fg)">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-(--line-strong)" />
        </>
      )}
      <span>{children}</span>
    </p>
  );
}
