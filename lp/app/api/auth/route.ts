import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies, clearAuthCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { license_key } = await request.json();

    if (!license_key || typeof license_key !== "string") {
      return NextResponse.json(
        { success: false, error: "ライセンスキーを入力してください" },
        { status: 400 }
      );
    }

    const verifyUrl = new URL("/api/verify", request.url);
    const verifyRes = await fetch(verifyUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ license_key }),
    });

    const data = await verifyRes.json();

    if (!data.valid) {
      return NextResponse.json(
        { success: false, error: data.error || "無効なライセンスキーです" },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      plan: data.plan,
    });

    setAuthCookies(response, license_key, data.plan);
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "認証に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
