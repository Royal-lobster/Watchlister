import { NextRequest, NextResponse } from "next/server";
import { buildSessionCookieHeader, DB_COOKIE } from "@/lib/auth";
import type { Session } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url));
  }

  try {
    // Exchange code for access token
    const credentials = Buffer.from(
      `${process.env.NOTION_OAUTH_CLIENT_ID}:${process.env.NOTION_OAUTH_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.APPLICATION_URL}/auth/notion/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.json().catch(() => tokenResponse.text());
      console.error("Token exchange failed:", tokenResponse.status, errBody);
      throw new Error("Token exchange failed");
    }

    const tokenData = await tokenResponse.json();

    const session: Session = {
      access_token: tokenData.access_token,
      workspace_name: tokenData.workspace_name ?? "My Workspace",
      workspace_icon: tokenData.workspace_icon ?? null,
      bot_id: tokenData.bot_id,
    };

    // Determine redirect target
    const existingDbId = request.cookies.get(DB_COOKIE)?.value;
    const redirectPath = existingDbId ? "/dashboard" : "/set-watchlist";

    const response = NextResponse.redirect(
      new URL(redirectPath, request.url)
    );

    // Set HTTP-only session cookie
    response.headers.append("Set-Cookie", buildSessionCookieHeader(session));

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url));
  }
}
