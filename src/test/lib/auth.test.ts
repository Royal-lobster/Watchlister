import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/headers
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

import { getSession, SESSION_COOKIE, DB_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";
import type { Session } from "@/types";

const mockSession: Session = {
  access_token: "test-token",
  workspace_name: "My Workspace",
  workspace_icon: null,
  bot_id: "bot-123",
};

describe("getSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns session when cookie is present", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === SESSION_COOKIE
          ? { name: SESSION_COOKIE, value: JSON.stringify(mockSession) }
          : undefined,
    } as any);

    const session = await getSession();
    expect(session).toEqual(mockSession);
  });

  it("returns null when session cookie is missing", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => undefined,
    } as any);

    const session = await getSession();
    expect(session).toBeNull();
  });

  it("returns null when session cookie value is invalid JSON", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === SESSION_COOKIE
          ? { name: SESSION_COOKIE, value: "not-json" }
          : undefined,
    } as any);

    const session = await getSession();
    expect(session).toBeNull();
  });
});

describe("getNotionDbId", () => {
  it("returns database ID when cookie is present", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: (name: string) =>
        name === DB_COOKIE
          ? { name: DB_COOKIE, value: "db-id-123" }
          : undefined,
    } as any);

    const { getNotionDbId } = await import("@/lib/auth");
    const dbId = await getNotionDbId();
    expect(dbId).toBe("db-id-123");
  });
});
