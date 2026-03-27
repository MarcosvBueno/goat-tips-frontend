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
    <div className="relative w-full rounded-[24px] overflow-hidden mt-2 mb-8 border border-black/10 dark:border-white/10 shadow-[0_14px_34px_rgba(0,0,0,0.08)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.45)] bg-[linear-gradient(165deg,rgba(1,42,254,0.08),rgba(255,255,255,0)_42%),linear-gradient(180deg,#FFFFFF,#F4F7FC)] dark:bg-[linear-gradient(165deg,rgba(1,42,254,0.22),rgba(10,13,19,0)_42%),linear-gradient(180deg,#10141C,#090B10)]">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_tr,rgba(1,42,254,0.06),rgba(255,255,255,0.03),rgba(255,255,255,0))] dark:bg-[linear-gradient(to_tr,rgba(1,42,254,0.22),rgba(0,0,0,0.25),rgba(0,0,0,0.42))]" />
      <div className="absolute -left-24 -top-24 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -right-24 -bottom-24 w-64 h-64 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10 px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* HOME TEAM */}
        <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
          {match.home.image_url ? (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black/[0.04] dark:bg-white/10 rounded-full p-4 backdrop-blur-sm border border-black/[0.08] dark:border-white/10 flex items-center justify-center">
              <Image
                src={match.home.image_url}
                alt={match.home.name}
                width={100}
                height={100}
                className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
              />
            </div>
          ) : (
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-[32px] border-2 border-black/[0.12] dark:border-white/20 bg-black/[0.04] dark:bg-white/10 text-(--text) dark:text-white backdrop-blur-sm shadow-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {match.home.name.slice(0, 3).toUpperCase()}
            </div>
          )}
          <div className="text-[20px] md:text-[24px] font-bold text-(--text) dark:text-white mt-4 uppercase tracking-wider">
            {match.home.name}
          </div>
        </div>

        {/* CENTER / SCORE */}
        <div className="flex flex-col items-center justify-center min-w-[180px]">
          {/* Status badge */}
          <div className="mb-4">
            {isLive ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-bold px-4 py-1.5 text-sm uppercase tracking-widest backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live • {match.minute}&#39;
              </div>
            ) : isUpcoming && countdown ? (
              <div className="inline-flex items-center rounded-full bg-black/[0.05] dark:bg-white/10 border border-black/[0.12] dark:border-white/20 text-(--text) dark:text-white font-medium px-4 py-1.5 text-sm backdrop-blur-md">
                {countdown}
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full bg-black/[0.05] dark:bg-white/10 border border-black/[0.12] dark:border-white/20 text-(--text2) dark:text-white/70 font-medium px-4 py-1.5 text-sm backdrop-blur-md uppercase">
                Finalizado
              </div>
            )}
          </div>

          {/* Score */}
          {isLive || match.status === "ended" ? (
            <div className="flex items-center gap-4 md:gap-6">
              <div
                className="text-[64px] md:text-[80px] leading-none text-(--text) dark:text-white drop-shadow-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.score_home}
              </div>
              <div className="text-[32px] text-(--text3) dark:text-white/50 font-light">-</div>
              <div
                className="text-[64px] md:text-[80px] leading-none text-(--text) dark:text-white drop-shadow-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.score_away}
              </div>
            </div>
          ) : (
            <div
              className="text-[40px] md:text-[56px] text-(--text2) dark:text-white/80 drop-shadow-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              VS
            </div>
          )}

          {isUpcoming && (
            <div className="text-[14px] text-(--text2) dark:text-white/60 mt-3 font-medium uppercase tracking-wider">
              {new Date(match.kick_off_time).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        {/* AWAY TEAM */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          {match.away.image_url ? (
            <div className="w-24 h-24 md:w-32 md:h-32 bg-black/[0.04] dark:bg-white/10 rounded-full p-4 backdrop-blur-sm border border-black/[0.08] dark:border-white/10 flex items-center justify-center">
              <Image
                src={match.away.image_url}
                alt={match.away.name}
                width={100}
                height={100}
                className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
              />
            </div>
          ) : (
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-[32px] border-2 border-black/[0.12] dark:border-white/20 bg-black/[0.04] dark:bg-white/10 text-(--text) dark:text-white backdrop-blur-sm shadow-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {match.away.name.slice(0, 3).toUpperCase()}
            </div>
          )}
          <div className="text-[20px] md:text-[24px] font-bold text-(--text) dark:text-white mt-4 uppercase tracking-wider">
            {match.away.name}
          </div>
        </div>
      </div>

      {/* Floating Odds Bar */}
      {match.odds && (
        <div className="relative z-10 w-full bg-black/[0.04] dark:bg-white/5 backdrop-blur-md border-t border-black/[0.08] dark:border-white/10 py-4 px-6 mt-2">
          <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center">
              <span className="text-(--text2) dark:text-white/60 text-[11px] uppercase tracking-wider font-bold mb-1">1</span>
              <span className="text-(--text) dark:text-white text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {match.odds.home_win.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center border-x border-black/[0.08] dark:border-white/10">
              <span className="text-(--text2) dark:text-white/60 text-[11px] uppercase tracking-wider font-bold mb-1">X</span>
              <span className="text-(--text) dark:text-white text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {match.odds.draw.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-(--text2) dark:text-white/60 text-[11px] uppercase tracking-wider font-bold mb-1">2</span>
              <span className="text-(--text) dark:text-white text-[18px] font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {match.odds.away_win.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
