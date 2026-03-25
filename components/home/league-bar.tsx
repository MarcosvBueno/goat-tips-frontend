"use client";

import { useState } from "react";

const LEAGUES = [
  { id: "premier", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", label: "Premier League" },
  { id: "laliga", flag: "🇪🇸", label: "La Liga" },
  { id: "bundesliga", flag: "🇩🇪", label: "Bundesliga" },
  { id: "seriea", flag: "🇮🇹", label: "Serie A" },
  { id: "ligue1", flag: "🇫🇷", label: "Ligue 1" },
  { id: "champions", flag: "🌍", label: "Champions League" },
  { id: "brasileirao", flag: "🇧🇷", label: "Brasileirão" },
];

export function LeagueBar() {
  const [active, setActive] = useState("premier");

  return (
    <div
      className="border-b border-border flex items-center gap-1.5 px-6 h-12 overflow-x-auto"
      style={{ background: "var(--bg2)", scrollbarWidth: "none" }}
    >
      {LEAGUES.map((league) => (
        <button
          key={league.id}
          onClick={() => setActive(league.id)}
          className={`flex items-center gap-1.5 px-[14px] py-[5px] rounded-full border text-[12px] font-medium cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 ${
            active === league.id
              ? "bg-(--blue-dim) border-[#012AFE] text-[#012AFE] font-semibold"
              : "bg-(--pill-bg) border-(--pill-border) text-(--text2) hover:text-(--text) hover:border-(--border2)"
          }`}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span className="text-[14px] leading-none">{league.flag}</span>
          {league.label}
        </button>
      ))}
    </div>
  );
}
