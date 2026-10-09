export const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
export const MAX_MANUAL_RECIPIENTS = 500;

/** Splits a pasted blob on commas/semicolons/whitespace and keeps valid, unique addresses. */
export function parseEmailList(input: string | string[]): string[] {
  const raw = Array.isArray(input) ? input : input.split(/[\s,;]+/);
  const seen = new Set<string>();
  for (const item of raw) {
    const email = item.trim().toLowerCase();
    if (EMAIL_RE.test(email)) seen.add(email);
  }
  return [...seen];
}

/** Entries that look like an address but aren't valid — surfaced in the composer. */
export function invalidEmails(input: string): string[] {
  return input
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !EMAIL_RE.test(s.toLowerCase()));
}
