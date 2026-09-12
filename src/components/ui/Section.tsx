import type { ReactNode } from "react";

type Props = {
  id?: string;
  theme?: "paper" | "ink" | "cocoa";
  className?: string;
  children: ReactNode;
  padded?: boolean;
  as?: "section" | "div" | "article";
  ariaLabelledby?: string;
};

/** Sekce webu. Barvy dědí potomci přes --bg/--fg/--line/--accent. */
export function Section({
  id,
  theme = "paper",
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

/** Číslované záhlaví sekce: „01 — O MNĚ“ s tenkou linkou a rozetou. */
export function SectionMark({
  index,
  children,
  className = "",
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="label-sm tabular text-(--accent)">{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-(--line-strong)" />
      <span className="label-xs">{children}</span>
    </div>
  );
}
