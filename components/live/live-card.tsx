"use client";

import Link from "next/link";
import Image from "next/image";
import type { Match } from "@/types/api";

interface LiveCardProps {
  match: Match;
  highlighted?: boolean;
}

export function LiveCard({ match, highlighted = false }: LiveCardProps) {
  const homeProb = match.probabilities?.home_win
    ? Math.round(match.probabilities.home_win * 100)
    : null;

  return (
    <Link href={`/partida/${match.event_id}`} className="no-underline">
      <div
        className={`bg-card border rounded-[14px] p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden ${
          highlighted
            ? "border-[rgba(1,42,254,0.25)] hover:border-(--blue-mid)"
            : "border-border hover:border-(--blue-mid)"
        }`}
      >
        {highlighted && (
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#012AFE] rounded-t-[14px]" />
        )}

        <div className="flex items-center justify-between mb-4">
          <div
            className="inline-flex items-center gap-1.5 rounded-[20px] text-[12px] font-bold px-[10px] py-1"
            style={{ background: "rgba(255,59,59,0.1)", color: "#FF3B3B" }}
          >
            <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
            {match.minute ? `${match.minute}'` : "AO VIVO"}
          </div>
          {match.round && (
            <span className="text-[11px] text-(--text3) font-medium">
              Rodada {match.round}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="text-center flex-1">
            {match.home.image_url ? (
              <Image
                src={match.home.image_url}
                alt={match.home.name}
                width={48}
                height={48}
                className="mx-auto rounded-full object-contain"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] mx-auto border-[1.5px] border-(--border2) bg-(--bg3)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.home.name.slice(0, 3).toUpperCase()}
              </div>
            )}
            <div className="text-[13px] font-semibold text-(--text) mt-2">
              {match.home.name}
            </div>
          </div>

          <div
            className="text-[44px] leading-none text-(--text) tracking-[-0.02em] px-4 shrink-0"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {match.score_home} — {match.score_away}
          </div>

          <div className="text-center flex-1">
            {match.away.image_url ? (
              <Image
                src={match.away.image_url}
                alt={match.away.name}
                width={48}
                height={48}
                className="mx-auto rounded-full object-contain"
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] mx-auto border-[1.5px] border-(--border2) bg-(--bg3)"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {match.away.name.slice(0, 3).toUpperCase()}
              </div>
            )}
            <div className="text-[13px] font-semibold text-(--text) mt-2">
              {match.away.name}
            </div>
          </div>
        </div>

        {match.odds && (
          <div className="flex gap-2 mb-4">
            {[
              { label: match.home.name, value: match.odds.home_win },
              { label: "Empate", value: match.odds.draw },
              { label: match.away.name, value: match.odds.away_win },
            ].map((odd) => (
              <div
                key={odd.label}
                className="flex-1 bg-(--bg3) rounded-lg py-2 text-center"
              >
                <div className="text-[10px] text-(--text3) font-medium uppercase">
                  {odd.label}
                </div>
                <div
                  className="text-[16px] text-(--text)"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {odd.value.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        {match.probabilities && (
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex-1">
              <div className="flex gap-1 h-[6px] rounded-full overflow-hidden bg-(--bg3)">
                <div
                  className="rounded-full bg-[#012AFE]"
                  style={{
                    width: `${match.probabilities.home_win * 100}%`,
                  }}
                />
                <div
                  className="rounded-full bg-(--text3)"
                  style={{ width: `${match.probabilities.draw * 100}%` }}
                />
                <div
                  className="rounded-full bg-[#FF3B3B]"
                  style={{
                    width: `${match.probabilities.away_win * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1.5 text-[11px] text-(--text2)">
                <span>{Math.round(match.probabilities.home_win * 100)}%</span>
                <span>{Math.round(match.probabilities.draw * 100)}%</span>
                <span>{Math.round(match.probabilities.away_win * 100)}%</span>
              </div>
            </div>
            {homeProb !== null && (
              <div
                className="text-[22px] w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ml-4"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#012AFE",
                  background: "var(--blue-dim)",
                }}
              >
                {homeProb}%
              </div>
            )}
          </div>
        )}

        {match.stadium && (
          <div className="mt-3 text-[11px] text-(--text3) truncate">
            {match.stadium}
            {match.referee && ` · ${match.referee}`}
          </div>
        )}
      </div>
    </Link>
  );
}
