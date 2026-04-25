/**
 * Validates a post-auth redirect target.
 * Allows:
 *   - Internal app paths starting with "/" (but NOT "//" protocol-relative)
 *   - Same-origin absolute URLs (returns the path+search portion)
 * Rejects:
 *   - External origins
 *   - Protocol-relative URLs ("//evil.com")
 *   - javascript:, data:, vbscript:, file: schemes
 *   - null/undefined/empty
 *
 * Returns a safe internal path. Falls back to `fallback` (default "/").
 */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target || typeof target !== "string") return fallback;
  const trimmed = target.trim();
  if (!trimmed) return fallback;

  // Block dangerous schemes outright
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return fallback;

  // Block protocol-relative URLs ("//host/path")
  if (trimmed.startsWith("//")) return fallback;

  // Internal path: must start with single "/"
  if (trimmed.startsWith("/")) {
    // Disallow embedded newlines / control chars
    if (/[\u0000-\u001f]/.test(trimmed)) return fallback;
    return trimmed;
  }

  // Same-origin absolute URL → extract path+search+hash
  if (typeof window !== "undefined") {
    try {
      const url = new URL(trimmed, window.location.origin);
      if (url.origin === window.location.origin) {
        return `${url.pathname}${url.search}${url.hash}` || fallback;
      }
    } catch {
      /* fall through */
    }
  }

  return fallback;
}

/**
 * Returns an absolute same-origin URL for OAuth callbacks.
 * `target` is first sanitized through `safeRedirect`.
 */
export function safeOAuthRedirectURL(target: string | null | undefined, fallback = "/"): string {
  const path = safeRedirect(target, fallback);
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}
