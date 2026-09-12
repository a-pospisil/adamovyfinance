type Props = { data: Record<string, unknown> | Record<string, unknown>[] };

/** Renders JSON-LD safely (escapes "<" to avoid script injection). */
export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
