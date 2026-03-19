"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { href: "#features", label: "機能" },
  { href: "#how-it-works", label: "使い方" },
  { href: "#pricing", label: "料金" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border/60 bg-surface/80 backdrop-blur-xl shadow-lg shadow-black/5"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="text-lg font-bold">
          <span className="text-primary">Meta Ads</span> MCP
        </a>

        <div className="hidden sm:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-muted transition hover:text-text"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#pricing"
            className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark shadow-sm"
          >
            導入する
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:bg-surface-light transition cursor-pointer"
          aria-label="メニューを開く"
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-surface/95 backdrop-blur-xl">
          <div className="flex flex-col gap-1 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition hover:bg-surface-light hover:text-text"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              導入する
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
