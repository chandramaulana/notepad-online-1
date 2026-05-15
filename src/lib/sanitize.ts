import sanitizeHtml from "sanitize-html";

export function sanitizeNoteHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "b",
      "strong",
      "i",
      "em",
      "u",
      "ul",
      "ol",
      "li",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "blockquote",
      "br",
      "span"
    ],
    allowedAttributes: {
      "*": ["style", "data-type"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  });
}
