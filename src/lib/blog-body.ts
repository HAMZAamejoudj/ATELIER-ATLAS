/** True when body is a single TipTap/HTML block from the admin editor. */
export function isHtmlBlogBody(body: string[]): boolean {
  const first = body[0]?.trim() ?? "";
  return body.length === 1 && /^<(!DOCTYPE|[a-z])/i.test(first);
}

export function bodyBlocksToEditorHtml(body: string[]): string {
  const filtered = body.filter(Boolean);
  if (!filtered.length) return "";
  if (isHtmlBlogBody(filtered)) return filtered[0];
  return filtered
    .map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");
}

export function editorHtmlToBodyBlocks(html: string): string[] {
  const trimmed = html.trim();
  if (!trimmed || trimmed === "<p></p>") return [];
  return [trimmed];
}
