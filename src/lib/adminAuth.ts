import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "./session";

// Data Access Layer entry point for admin-gated pages and Server Actions.
// Memoized per-request so repeated calls don't re-read cookies redundantly.
export const isAdminAuthenticated = cache(async (): Promise<boolean> => {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_SESSION_COOKIE)?.value);
});
