"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home", id: "home" },
  { href: "/ao-vivo", label: "Ao vivo", id: "live", live: true },
  { href: "/pre-jogo", label: "Pré-jogo", id: "prejogo" },
  { href: "/simulador", label: "Simulador", id: "simulador" },
  { href: "/analytics", label: "Analytics", id: "analytics" },
  { href: "/tipster", label: "Tipster IA", id: "tipster" },
];

function toggleTheme() {
  document.documentElement.classList.toggle("dark");
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center px-6 gap-0 border-b border-border backdrop-blur-lg"
        style={{ background: "var(--nav-bg)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline mr-8 shrink-0"
        >
          <div className="w-8 h-8 shrink-0 relative">
            <Image
              src="/goat-tips-logo.svg"
              alt="Goat Tips"
              fill
              className="object-contain"
            />
          </div>
          <span
            className="text-[20px] uppercase tracking-[0.02em] text-(--text) leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            GOAT <span className="text-[#012AFE]">TIPS</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                className={`text-[13px] font-medium px-[14px] py-[6px] rounded-lg transition-all duration-200 whitespace-nowrap tracking-[0.01em] flex items-center gap-1 ${
                  isActive
                    ? "text-[#012AFE] bg-(--blue-dim) font-semibold"
                    : "text-(--text2) hover:text-(--text) hover:bg-(--pill-bg)"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.live && (
                  <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-[10px] ml-auto">
          <button
            onClick={toggleTheme}
            title="Alternar tema"
            className="w-9 h-9 rounded-lg border border-(--border2) bg-(--pill-bg) flex items-center justify-center cursor-pointer text-(--text2) hover:bg-(--bg3) hover:text-(--text) transition-all duration-200 shrink-0"
          >
            {/* Ícone sol — visível no modo escuro */}
            <span className="hidden dark:block">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5A5.5 5.5 0 118 2.5a5.5 5.5 0 010 11z" opacity="0.3" />
                <path d="M8 3a5 5 0 000 10V3z" />
              </svg>
            </span>
            {/* Ícone lua — visível no modo claro */}
            <span className="block dark:hidden">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 1a5 5 0 010 10V3z" />
              </svg>
            </span>
          </button>
          <button
            className="text-[13px] font-semibold bg-[#012AFE] text-white border-none px-[18px] py-[8px] rounded-lg cursor-pointer tracking-[0.02em] hover:opacity-[0.88] hover:-translate-y-px transition-all duration-200 whitespace-nowrap"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* Mobile nav bar */}
      <div
        className="md:hidden fixed top-[60px] left-0 right-0 z-40 flex items-center gap-1 px-4 h-11 overflow-x-auto border-b border-border"
        style={{ background: "var(--bg2)", scrollbarWidth: "none" }}
      >
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.id}
              href={link.href}
              className={`text-[13px] font-medium px-[14px] py-[6px] rounded-lg transition-all duration-200 whitespace-nowrap tracking-[0.01em] flex items-center gap-1 shrink-0 ${
                isActive
                  ? "text-[#012AFE] bg-(--blue-dim) font-semibold"
                  : "text-(--text2) hover:text-(--text) hover:bg-(--pill-bg)"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {link.live && (
                <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>
    </>
  );
}
