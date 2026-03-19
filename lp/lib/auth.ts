import { NextRequest, NextResponse } from "next/server";

export const AUTH_COOKIE = "mcp_session";
export const PLAN_COOKIE = "mcp_plan";

export function setAuthCookies(
  response: NextResponse,
  licenseKey: string,
  plan: string
) {
  const maxAge = 60 * 60 * 24 * 30; // 30 days
  response.cookies.set(AUTH_COOKIE, licenseKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  response.cookies.set(PLAN_COOKIE, plan, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.delete(AUTH_COOKIE);
  response.cookies.delete(PLAN_COOKIE);
}

export function getSession(request: NextRequest) {
  const licenseKey = request.cookies.get(AUTH_COOKIE)?.value;
  const plan = request.cookies.get(PLAN_COOKIE)?.value;
  return licenseKey ? { licenseKey, plan: plan ?? "unknown" } : null;
}
