"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  safeEqual,
} from "@/lib/session";

function resolveRedirect(target: FormDataEntryValue | null): string {
  const value = typeof target === "string" ? target : "";
  if (value.startsWith("/admin") || value.startsWith("/adminria")) {
    return value;
  }
  return "/admin";
}

export async function login(formData: FormData) {
  const username = String(formData.get("username") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = resolveRedirect(formData.get("redirectTo"));

  const expectedUsername = process.env.ADMIN_USERNAME || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    redirect(`/admin/login?error=config&redirect=${encodeURIComponent(redirectTo)}`);
  }

  const usernameOk = safeEqual(username, expectedUsername);
  const passwordOk = safeEqual(password, expectedPassword);

  if (!usernameOk || !passwordOk) {
    redirect(`/admin/login?error=invalid&redirect=${encodeURIComponent(redirectTo)}`);
  }

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect(redirectTo);
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
