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

/** Číslované záhlaví sekce: „7) Workshop“ — číslo bez nuly, závorka, popisek malými písmeny, žádná linka. */
export function SectionMark({
  index,
  children,
  className = "",
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  const n = Number(index);
  return (
    <div className={`flex items-baseline gap-3 ${className}`}>
      <span className="label-sm tabular text-(--accent)">{Number.isNaN(n) ? index : `${n})`}</span>
      <span className="label-xs normal-case tracking-[0.08em]">{children}</span>
    </div>
  );
}
