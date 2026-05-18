import { marked, type Tokens } from "marked";

/**
 * Render a markdown string to HTML for /insider posts.
 *
 * Danny is the only author and posts go through an admin-gated editor, so we
 * trust the input. We still strip raw HTML for safety (block-level <script>
 * etc. would otherwise pass through), and we apply lightweight class hooks so
 * the prose styles in InsiderPostBody.css can target heading/link tags.
 */
const renderer = new marked.Renderer();

// Add a class hook to links so Tailwind prose-style rules can pick them up.
renderer.link = ({ href, title, text }: Tokens.Link) => {
  const safeHref = href ?? "#";
  const titleAttr = title ? ` title="${title}"` : "";
  return `<a href="${safeHref}"${titleAttr} class="insider-link">${text}</a>`;
};

// Block-quote: editorial pull-quote treatment.
renderer.blockquote = ({ tokens }: Tokens.Blockquote) => {
  const body = marked.parser(tokens, { renderer });
  return `<blockquote class="insider-quote">${body}</blockquote>`;
};

marked.use({ renderer });

export function renderMarkdown(md: string): string {
  if (!md) return "";
  // Disable raw HTML to keep injected scripts out of the rendered body.
  const html = marked.parse(md, { async: false, gfm: true, breaks: false });
  return typeof html === "string" ? html : "";
}
