"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Match } from "@/types/api";

interface MatchHeaderProps {
  match: Match;
}

function useCountdown(kickOffTime: string, isUpcoming: boolean) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!isUpcoming) return;

    function update() {
      const diff = new Date(kickOffTime).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("Começando...");
        return;
      }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1000);

      if (d > 0) setLabel(`${d}d ${h}h ${m}m`);
      else if (h > 0) setLabel(`${h}h ${m}m ${s}s`);
      else setLabel(`${m}m ${s}s`);
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [kickOffTime, isUpcoming]);

  return label;
}

export function MatchHeader({ match }: MatchHeaderProps) {
  const isLive = match.status === "live";
  const isUpcoming = match.status === "upcoming";
  const countdown = useCountdown(match.kick_off_time, isUpcoming);

  return (
    <div className="bg-card border border-border rounded-[14px] p-6 mb-4">
      {/* Status badge */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {isLive && (
          <div
            className="inline-flex items-center gap-1.5 rounded-[20px] text-[13px] font-bold px-3 py-1.5"
            style={{ background: "rgba(255,59,59,0.1)", color: "#FF3B3B" }}
          >
            <span className="inline-block w-[7px] h-[7px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
            {match.minute}&#39;
          </div>
        )}
        {isUpcoming && countdown && (
          <div
            className="inline-flex items-center gap-1.5 rounded-[20px] text-[13px] font-bold px-3 py-1.5 bg-(--blue-dim) text-[#012AFE]"
          >
            {countdown}
          </div>
        )}
        {match.round && (
          <span className="text-[12px] text-(--text3)">Rodada {match.round}</span>
        )}
      </div>

      {/* Teams + Score */}
      <div className="flex items-center justify-between">
        <div className="flex-1 text-center">
          {match.home.image_url ? (
            <Image
              src={match.home.image_url}
              alt={match.home.name}
              width={64}
              height={64}
              className="mx-auto rounded-full object-contain"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] mx-auto border-2 border-(--border2) bg-(--bg3)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {match.home.name.slice(0, 3).toUpperCase()}
            </div>
          )}
          <div className="text-[16px] font-bold text-(--text) mt-3">
            {match.home.name}
          </div>
        </div>

        <div className="px-6 text-center">
          {isLive || match.status === "ended" ? (
            <div
              className="text-[56px] leading-none text-(--text) tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {match.score_home} — {match.score_away}
            </div>
          ) : (
            <div
              className="text-[32px] text-(--text3)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VS
            </div>
          )}
          {isUpcoming && (
            <div className="text-[13px] text-(--text2) mt-2">
              {new Date(match.kick_off_time).toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        <div className="flex-1 text-center">
          {match.away.image_url ? (
            <Image
              src={match.away.image_url}
              alt={match.away.name}
              width={64}
              height={64}
              className="mx-auto rounded-full object-contain"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-[20px] mx-auto border-2 border-(--border2) bg-(--bg3)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {match.away.name.slice(0, 3).toUpperCase()}
            </div>
          )}
          <div className="text-[16px] font-bold text-(--text) mt-3">
            {match.away.name}
          </div>
        </div>
      </div>

      {/* Stadium + Referee */}
      <div className="flex items-center justify-center gap-4 mt-4 text-[12px] text-(--text3)">
        {match.stadium && <span>📍 {match.stadium}</span>}
        {match.referee && <span>🧑‍⚖️ {match.referee}</span>}
      </div>
    </div>
  );
}
