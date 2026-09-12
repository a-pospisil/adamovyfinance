import { formatCzk } from "@/lib/format";
import { formatDayMonth, formatWorkshopDate, workshopStatus, type Workshop } from "@/lib/workshops";

type Props = { workshop: Workshop; now: Date; compact?: boolean };

/** One workshop edition with date-aware pricing (early bird / regular / past). Rendered on the server. */
export function WorkshopCard({ workshop, now, compact = false }: Props) {
  const status = workshopStatus(workshop, now);
  const when = formatWorkshopDate(workshop);

  return (
    <article className="flex flex-col justify-between border border-(--line) p-6 sm:p-8">
      <div>
        <p className="mono-label text-(--accent)">{workshop.level}</p>
        <h3 className="display display-sm mt-3">{workshop.title}</h3>
        <p className="mt-3 text-(--muted)">{workshop.claim}</p>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-(--line) pt-6">
        <div>
          <dt className="eyebrow">Termín</dt>
          <dd className="mt-1.5 font-medium">
            {status.phase === "past" ? "Další termín připravuji" : when.date}
            {status.phase !== "past" && <span className="block text-[0.85rem] text-(--muted)">{when.weekday}, {when.time}</span>}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Místo</dt>
          <dd className="mt-1.5 font-medium">
            {workshop.place.name}
            <span className="block text-[0.85rem] text-(--muted)">{workshop.place.street}, {workshop.place.city}</span>
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Cena</dt>
          <dd className="mt-1.5 font-medium">
            {status.phase === "past" ? (
              <span>od {formatCzk(workshop.earlyBird?.price ?? workshop.price)}</span>
            ) : (
              <>
                <span className="tabular">{formatCzk(status.priceNow)}</span>
                {status.phase === "early" && status.earlyUntil && (
                  <span className="block text-[0.85rem] text-(--muted)">
                    early bird do {formatDayMonth(status.earlyUntil)}, poté {formatCzk(status.regularPrice)}
                  </span>
                )}
              </>
            )}
          </dd>
        </div>
        <div>
          <dt className="eyebrow">Kapacita</dt>
          <dd className="mt-1.5 font-medium">
            {workshop.capacity} míst
            <span className="block text-[0.85rem] text-(--muted)">záměrně malá skupina</span>
          </dd>
        </div>
      </dl>

      {!compact && (
        <ul className="mt-6 space-y-2 border-t border-(--line) pt-6 text-[0.95rem]">
          {workshop.audience.map((a) => (
            <li key={a} className="flex gap-3">
              <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 bg-(--accent)" />
              <span className="text-(--muted)">{a}</span>
            </li>
          ))}
        </ul>
      )}

      <a
        href={status.phase === "past" ? "/kontakt" : workshop.url}
        className="group mt-8 inline-flex h-12 items-center justify-between gap-4 border border-(--line-strong) px-5 text-[0.95rem] font-medium transition-colors hover:border-(--fg)"
        {...(status.phase === "past" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
      >
        <span>{status.phase === "past" ? "Chci vědět o dalším termínu" : "Chci na workshop"}</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </article>
  );
}
