import type { ElementType, ReactNode } from "react";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Zpoždění v milisekundách po vstupu do viewportu. */
  delay?: number;
  id?: string;
};

/** Jemné odhalení při scrollu. Server komponenta — animaci řeší CSS + RevealObserver. */
export function Reveal({ as: Tag = "div", children, className = "", delay = 0, id }: Props) {
  return (
    <Tag
      id={id}
      data-reveal=""
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
