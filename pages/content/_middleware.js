import { NextResponse } from "next/server";
export async function middleware(req, res) {
  const { nextUrl: url, geo } = req;
  url?.searchParams?.set("country", geo.country || "US");
  return NextResponse.rewrite(url);
}
