"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { cn } from "@/lib/utils";
import {
  Navbar as ResizableNavbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";

const NAV_LINKS = [
  { href: "/", label: "Home", id: "home" },
  { href: "/ao-vivo", label: "Ao vivo", id: "live", live: true },
  { href: "/pre-jogo", label: "Pré-jogo", id: "prejogo" },
  { href: "/simulador", label: "Simulador", id: "simulador" },
  { href: "/analytics", label: "Analytics", id: "analytics" },
  { href: "/tipster", label: "Goat AI", id: "tipster" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ResizableNavbar className="fixed inset-x-0 top-0 z-50 px-4 md:px-6">
      <NavBody
        className="h-[60px] max-w-[1200px] border border-border/60 px-4"
        style={{ background: "color-mix(in oklab, transparent)" }}
      >
        <Link
          href="/"
          className="flex items-center no-underline mr-8 shrink-0"
        >
          <div className="w-[150px] h-[30px] shrink-0 relative">
            <Image
              src="/azul-logo-horizontal.svg"
              alt="Goat Tips"
              fill
              className="object-contain"
            />
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex">
          <div className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-border/60 bg-(--bg2)/60 p-1 backdrop-blur-md">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={cn(
                    "text-[13px] font-medium px-[14px] py-[6px] rounded-full transition-all duration-200 whitespace-nowrap tracking-[0.01em] flex items-center gap-1",
                    isActive
                      ? "text-[#012AFE] bg-(--blue-dim) font-semibold"
                      : "text-(--text2) hover:text-(--text) hover:bg-(--pill-bg)",
                  )}
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
        </div>

        <div className="ml-auto flex items-center gap-[10px]">
          <ThemeToggleButton
            className="shrink-0 text-(--text2) hover:bg-(--bg3) hover:text-(--text)"
            variant="polygon"
            start="top-left"
          />
        </div>
      </NavBody>

      <MobileNav
        className="border border-border/60 p-3"
        style={{ background: "color-mix(in oklab, var(--nav-bg) 92%, transparent)" }}
      >
        <MobileNavHeader>
          <Link href="/" className="flex items-center no-underline shrink-0">
            <div className="w-[128px] h-[26px] shrink-0 relative">
              <Image
                src="/azul-logo-horizontal.svg"
                alt="Goat Tips"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggleButton
              className="shrink-0 text-(--text2) hover:bg-(--bg3) hover:text-(--text)"
              variant="polygon"
              start="top-left"
            />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((current) => !current)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          className="top-[68px] border border-border/60 bg-(--surface)"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "w-full text-[14px] font-medium px-[14px] py-[8px] rounded-lg transition-all duration-200 tracking-[0.01em] flex items-center gap-2",
                  isActive
                    ? "text-[#012AFE] bg-(--blue-dim) font-semibold"
                    : "text-(--text2) hover:text-(--text) hover:bg-(--pill-bg)",
                )}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.live && (
                  <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
                )}
                {link.label}
              </Link>
            );
          })}
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
