"use client";

import Link from "next/link";
import Image from "next/image";
import type { Match } from "@/types/api";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const probA = match.probabilities
    ? Math.round(match.probabilities.home_win * 100)
    : null;
  const probDraw = match.probabilities
    ? Math.round(match.probabilities.draw * 100)
    : null;
  const probB = match.probabilities
    ? Math.round(match.probabilities.away_win * 100)
    : null;

  const isLive = match.status === "live";
  const isHomeFav = probA !== null && probA > 45;
  const isAwayFav = probB !== null && probB > 45;

  const timeLabel = isLive
    ? `${match.minute}'`
    : new Date(match.kick_off_time).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <Link href={`/partida/${match.event_id}`} className="no-underline block group h-full">
      <div className="relative overflow-hidden border rounded-2xl p-5 transition-all duration-500 hover:scale-[1.015] h-full shadow-[0_14px_34px_rgba(0,0,0,0.08)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.45)] flex flex-col bg-[linear-gradient(165deg,rgba(1,42,254,0.08),rgba(255,255,255,0)_42%),linear-gradient(180deg,#FFFFFF,#F4F7FC)] dark:bg-[linear-gradient(165deg,rgba(1,42,254,0.24),rgba(10,13,19,0)_42%),linear-gradient(180deg,#10141C,#090B10)] border-black/10 dark:border-white/10 hover:border-[#012AFE]/35 dark:hover:border-[#2f53ff]/50">
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#012AFE]/15 dark:bg-[#012AFE]/30 rounded-full blur-[40px] pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF3B3B]/12 dark:bg-[#FF3B3B]/20 rounded-full blur-[40px] pointer-events-none" />

        {/* Marca d'água no fundo do card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] dark:opacity-[0.05] pointer-events-none select-none">
          <span 
             className="text-[140px] leading-none font-bold tracking-tighter text-black/[0.06] dark:text-white/[0.07]" 
             style={{ fontFamily: 'var(--font-display)' }}
          >
            {isLive ? `${match.score_home}-${match.score_away}` : "VS"}
          </span>
        </div>

        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="text-[10px] font-bold text-black/45 dark:text-white/55 uppercase tracking-[0.1em] flex items-center gap-1.5">
            {isLive && (
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse shadow-[0_0_8px_#FF3B3B]" />
            )}
            {match.round || "Premier League"}
          </div>
          <div className="text-[11px] font-semibold text-black/70 dark:text-white/75 bg-black/[0.04] dark:bg-white/[0.07] px-2.5 py-[4px] rounded-full border border-black/[0.08] dark:border-white/[0.09] backdrop-blur-sm">
            {isLive ? `🔴 ${timeLabel}` : timeLabel}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-2 mb-6">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-3 flex-1 group-hover:-translate-y-1 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-[#012AFE]/20 dark:bg-[#012AFE]/30 blur-xl rounded-full" />
              {match.home.image_url ? (
                <Image
                  src={match.home.image_url}
                  alt={match.home.name}
                  width={56}
                  height={56}
                  className="rounded-full object-contain relative z-10 drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-[16px] uppercase border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-md relative z-10 text-(--text) dark:text-white shadow-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {match.home.name.slice(0, 3).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-[13px] font-bold text-(--text) dark:text-white/92 text-center leading-tight truncate w-full px-1">
              {match.home.name}
            </div>
          </div>

          {/* Score / VS Center */}
          <div className="shrink-0 text-center relative pointer-events-none drop-shadow-2xl">
            {isLive ? (
              <div
                className="text-[36px] text-(--text) dark:text-white tracking-[-0.03em] font-medium"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.score_home} - {match.score_away}
              </div>
            ) : (
              <div
                className="text-[28px] text-black/20 dark:text-white/22 tracking-[0.02em] font-medium"
                style={{ fontFamily: "var(--font-display)" }}
              >
                VS
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-3 flex-1 group-hover:-translate-y-1 transition-transform duration-500">
             <div className="relative">
              <div className="absolute inset-0 bg-[#FF3B3B]/20 dark:bg-[#FF3B3B]/30 blur-xl rounded-full" />
              {match.away.image_url ? (
                <Image
                  src={match.away.image_url}
                  alt={match.away.name}
                  width={56}
                  height={56}
                  className="rounded-full object-contain relative z-10 drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
                />
              ) : (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-[16px] uppercase border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/45 backdrop-blur-md relative z-10 text-(--text) dark:text-white shadow-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {match.away.name.slice(0, 3).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-[13px] font-bold text-(--text) dark:text-white/92 text-center leading-tight truncate w-full px-1">
              {match.away.name}
            </div>
          </div>
        </div>

        {/* Probability Bar Segmented */}
        {probA !== null && probDraw !== null && probB !== null && (
          <div className="mb-5 relative z-10 mt-auto">
            <div className="flex w-full h-[6px] rounded-full overflow-hidden bg-black/[0.06] dark:bg-white/[0.07] border border-black/[0.08] dark:border-white/[0.09]">
              <div
                className="h-full transition-all duration-1000 ease-out flex items-center justify-end pr-1"
                style={{ width: `${probA}%`, background: 'linear-gradient(90deg, #012AFE 0%, #3B5FFF 100%)' }}
              />
               <div
                className="h-full transition-all duration-1000 ease-out bg-white/20"
                style={{ width: `${probDraw}%` }}
              />
              <div
                className="h-full transition-all duration-1000 ease-out"
                style={{ width: `${probB}%`, background: 'linear-gradient(90deg, #FF3B3B 0%, #FF5A5A 100%)' }}
              />
            </div>
            <div className="flex justify-between mt-2 px-0.5">
              <span className="text-[10px] text-black/45 dark:text-white/50 uppercase tracking-widest font-semibold">
                <span className="text-(--text) dark:text-white/92">{probA}%</span> H
              </span>
              <span className="text-[10px] text-black/45 dark:text-white/50 uppercase tracking-widest font-semibold">
                D <span className="text-(--text) dark:text-white/92">{probDraw}%</span>
              </span>
              <span className="text-[10px] text-black/45 dark:text-white/50 uppercase tracking-widest font-semibold">
                A <span className="text-(--text) dark:text-white/92">{probB}%</span>
              </span>
            </div>
          </div>
        )}

        {/* Bet Slip Styled Odds */}
        {match.odds && (
          <div className="flex gap-2 relative z-10 mt-auto pt-2">
            {[
              { label: "1", value: match.odds.home_win, active: isHomeFav },
              { label: "X", value: match.odds.draw },
              { label: "2", value: match.odds.away_win, active: isAwayFav },
            ].map((odd, idx) => (
              <div
                key={idx}
                className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl border backdrop-blur-md transition-colors 
                  ${odd.active 
                    ? 'border-[#012AFE]/35 bg-[#012AFE]/8 dark:bg-[#012AFE]/14' 
                    : 'border-black/[0.09] dark:border-white/[0.1] bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1]'}`}
              >
                <span className={`text-[11px] font-bold ${odd.active ? 'text-[#012AFE] dark:text-[#7f95ff]' : 'text-black/40 dark:text-white/40'}`}>
                  {odd.label}
                </span>
                <span
                  className={`text-[15px] font-medium ${odd.active ? 'text-(--text) dark:text-white' : 'text-(--text) dark:text-white/82'}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {odd.value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
