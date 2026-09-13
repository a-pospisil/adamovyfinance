import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionMark } from "@/components/ui/Section";
import { GOOGLE_PROFILE_URL, GOOGLE_RATING, REVIEWS } from "@/lib/reviews";

function Stars() {
  return (
    <p className="text-[0.95rem] tracking-[0.28em] text-(--accent)">
      <span aria-hidden="true">★★★★★</span>
      <span className="sr-only">Hodnoceno 5 hvězdami z 5</span>
    </p>
  );
}

/** 06 — Co říkají klienti. Skutečné recenze z veřejného profilu na Google. */
export function Reviews() {
  return (
    <Section theme="ink" ariaLabelledby="reviews-title">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <SectionMark index="06">Co říkají klienti</SectionMark>
          <h2 id="reviews-title" className="display display-md mt-8 max-w-[14ch]">
            Hodnocení <span className="italic-accent text-gold-300">{GOOGLE_RATING.value} z 5</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="label-xs md:text-right">
            {GOOGLE_RATING.count} recenzí na Google
            <span className="mt-1 block normal-case tracking-normal">Evergreen Finance</span>
          </p>
        </Reveal>
      </div>

      <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
        {REVIEWS.map((r, i) => (
          <Reveal
            as="li"
            key={r.author}
            delay={i * 80}
            className="flex h-full flex-col border-t border-(--line) pt-6"
          >
            <Stars />
            <blockquote className="mt-5">
              <p className="display text-[1.15rem] leading-[1.45] italic-accent">„{r.text}“</p>
            </blockquote>
            <div className="mt-auto pt-5">
              <p className="text-[0.95rem]">{r.author}</p>
              <p className="microtype mt-1.5">Google · Evergreen Finance</p>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120} className="mt-12">
        <a
          href={GOOGLE_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="label-sm tap group inline-flex items-center gap-3 border-b border-(--line-strong) pb-1 transition-colors hover:border-(--accent) hover:text-(--accent)"
        >
          Zobrazit všechny recenze
          <span aria-hidden="true" className="h-px w-5 bg-current transition-[width] duration-300 group-hover:w-8" />
        </a>
      </Reveal>
    </Section>
  );
}
