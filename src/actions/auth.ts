"use server";

import { actionClient } from "@/lib/safe-action";
import { cookies } from "next/headers";
import { SESSION_COOKIE, DB_COOKIE } from "@/lib/auth";
import { redirect } from "next/navigation";

export const logoutAction = actionClient.action(async () => {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(DB_COOKIE);
  redirect("/");
});
