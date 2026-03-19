"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLogin() {
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) {
      setError("ライセンスキーを入力してください");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey.trim() }),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "認証に失敗しました");
      }
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="gradient-blob gradient-blob-primary w-[600px] h-[600px] top-[10%] left-[20%]" />
        <div
          className="gradient-blob gradient-blob-accent w-[400px] h-[400px] bottom-[10%] right-[10%]"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="text-2xl font-bold">
            <span className="text-primary">Meta Ads</span> MCP
          </a>
          <p className="mt-2 text-text-muted">ダッシュボードにログイン</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-surface-light/60 backdrop-blur-sm p-8"
        >
          <div>
            <label
              htmlFor="license-key"
              className="block text-sm font-medium mb-2"
            >
              ライセンスキー
            </label>
            <input
              id="license-key"
              type="text"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                setError("");
              }}
              placeholder="MMCP-XXXX-XXXX-XXXX-XXXX"
              className="w-full rounded-xl border border-border bg-surface py-3 px-4 text-sm text-text placeholder:text-text-muted/40 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              autoFocus
            />
            <p className="mt-2 text-xs text-text-muted">
              購入時にメールで届いたライセンスキーを入力してください
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                認証中...
              </span>
            ) : (
              "ログイン"
            )}
          </button>

          <div className="mt-6 text-center">
            <a
              href="/#pricing"
              className="text-sm text-text-muted transition hover:text-primary"
            >
              ライセンスを購入する →
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
