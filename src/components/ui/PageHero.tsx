import type { ReactNode } from "react";
import { Lines } from "@/components/ui/Lines";
import { Reveal } from "@/components/ui/Reveal";

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  theme?: "dark" | "light";
  size?: "lg" | "xl";
};

/** Consistent opening block for subpages: eyebrow, oversized headline, lead, optional aside. */
export function PageHero({ eyebrow, title, lead, aside, theme = "dark", size = "lg" }: Props) {
  return (
    <section data-theme={theme} className="themed pt-32 pb-16 md:pt-40 md:pb-20 lg:pt-44 lg:pb-24">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className={aside ? "lg:col-span-7" : "lg:col-span-10"}>
          <p className="eyebrow">{eyebrow}</p>
          <Lines as="h1" className={`display mt-6 ${size === "xl" ? "display-xl" : "display-lg"}`} delay={0.1}>
            {title}
          </Lines>
          {lead && (
            <Reveal delay={0.35}>
              <div className="lead mt-8 max-w-2xl text-(--muted)">{lead}</div>
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal className="lg:col-span-4 lg:col-start-9" delay={0.3}>
            {aside}
          </Reveal>
        )}
      </div>
    </section>
  );
}
