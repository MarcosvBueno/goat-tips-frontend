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

  const timeLabel = isLive
    ? `${match.minute}'`
    : new Date(match.kick_off_time).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <Link href={`/partida/${match.event_id}`} className="no-underline">
      <div className="bg-card border border-border rounded-[14px] p-5 cursor-pointer hover:border-(--border2) hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold text-(--text2) uppercase tracking-[0.08em] flex items-center gap-1.5">
            {isLive && (
              <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
            )}
            Premier League
          </div>
          <div className="text-[12px] text-(--text3) bg-(--pill-bg) px-2 py-[3px] rounded-[20px]">
            {isLive ? `🔴 ${timeLabel}` : timeLabel}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col items-center gap-2 flex-1">
            {match.home.image_url ? (
              <Image
                src={match.home.image_url}
                alt={match.home.name}
                width={44}
                height={44}
                className="rounded-full object-contain"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] uppercase border-[1.5px] border-(--border2) bg-(--bg3)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.home.name.slice(0, 3).toUpperCase()}
              </div>
            )}
            <div className="text-[13px] font-semibold text-(--text) text-center">
              {match.home.name}
            </div>
          </div>

          <div className="shrink-0 text-center">
            {isLive ? (
              <div
                className="text-[28px] text-(--text) tracking-[-0.02em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.score_home} — {match.score_away}
              </div>
            ) : (
              <div
                className="text-[22px] text-(--text3) tracking-[0.02em]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                VS
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            {match.away.image_url ? (
              <Image
                src={match.away.image_url}
                alt={match.away.name}
                width={44}
                height={44}
                className="rounded-full object-contain"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] uppercase border-[1.5px] border-(--border2) bg-(--bg3)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.away.name.slice(0, 3).toUpperCase()}
              </div>
            )}
            <div className="text-[13px] font-semibold text-(--text) text-center">
              {match.away.name}
            </div>
          </div>
        </div>

        {probA !== null && probDraw !== null && probB !== null && (
          <div>
            <div className="bg-(--bg3) rounded-[30px] h-1.5 overflow-hidden">
              <div
                className="h-full rounded-[30px] transition-all duration-500"
                style={{ width: `${probA}%`, background: "#012AFE" }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-(--text2)">
                {match.home.name}{" "}
                <span className="text-(--text) font-semibold">{probA}%</span>
              </span>
              <span className="text-[11px] text-(--text2)">
                Empate{" "}
                <span className="text-(--text) font-semibold">{probDraw}%</span>
              </span>
              <span className="text-[11px] text-(--text2)">
                {match.away.name}{" "}
                <span className="text-(--text) font-semibold">{probB}%</span>
              </span>
            </div>
          </div>
        )}

        {match.odds && (
          <div className="flex gap-2">
            {[
              { label: match.home.name, value: match.odds.home_win },
              { label: "Empate", value: match.odds.draw },
              { label: match.away.name, value: match.odds.away_win },
            ].map((odd) => (
              <div
                key={odd.label}
                className="flex-1 bg-(--pill-bg) border border-border rounded-lg py-2 px-1.5 text-center"
              >
                <span className="text-[10px] text-(--text2) block mb-[3px] font-medium">
                  {odd.label}
                </span>
                <span
                  className="text-[17px] text-(--text)"
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
