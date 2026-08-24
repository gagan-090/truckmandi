import type { StructuredData } from "@/lib/seo/structured-data";

/**
 * Serialises JSON-LD safely. Listing titles and descriptions are
 * user-generated, so `<` is escaped to stop any `</script>` sequence from
 * terminating the tag early.
 */
export function JsonLd({ data }: { data: StructuredData | StructuredData[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // Content is serialised by us from typed data, never raw HTML.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
