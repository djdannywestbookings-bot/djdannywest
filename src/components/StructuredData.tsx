import { jsonLd } from "@/lib/seo";

/**
 * Inject one or more JSON-LD schemas into the page <head>-equivalent slot.
 * Google + social crawlers read these to build rich snippets.
 */
export function StructuredData({ schemas }: { schemas: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: schema must be raw JSON, not escaped
      dangerouslySetInnerHTML={{ __html: jsonLd(schemas) }}
    />
  );
}
