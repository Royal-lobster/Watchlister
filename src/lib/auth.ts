import { cookies } from "next/headers";
import type { Session } from "@/types";

export const SESSION_COOKIE = "notion_session";
export const DB_COOKIE = "notion_db_id";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days
};

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  if (!cookie) return null;
  try {
    return JSON.parse(cookie.value) as Session;
  } catch {
    return null;
  }
}

export async function getNotionDbId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(DB_COOKIE);
  return cookie?.value ?? null;
}

export function buildSessionCookieHeader(session: Session): string {
  const value = JSON.stringify(session);
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge}`;
}

export function buildDbCookieHeader(dbId: string): string {
  return `${DB_COOKIE}=${dbId}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge}`;
}

export function buildClearCookiesHeader(): string[] {
  return [
    `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
    `${DB_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
  ];
}
