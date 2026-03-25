"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Match } from "@/types/api";

interface UpcomingCardProps {
  match: Match;
}

function useCountdown(kickOffTime: string) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(kickOffTime).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("Agora");
        return;
      }
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);

      if (days > 0) setLabel(`${days}d ${hours}h`);
      else if (hours > 0) setLabel(`${hours}h ${minutes}m`);
      else setLabel(`${minutes}m`);
    }

    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [kickOffTime]);

  return label;
}

export function UpcomingCard({ match }: UpcomingCardProps) {
  const countdown = useCountdown(match.kick_off_time);

  const kickOff = new Date(match.kick_off_time);
  const timeStr = kickOff.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = kickOff.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return (
    <Link href={`/partida/${match.event_id}`} className="no-underline">
      <div className="bg-card border border-border rounded-[14px] px-6 py-5 flex items-center gap-5 cursor-pointer hover:border-(--border2) hover:bg-(--card2) transition-all duration-200 flex-wrap">
        <div className="bg-(--blue-dim) rounded-lg px-[14px] py-[10px] text-center min-w-[72px] shrink-0">
          <div
            className="text-[20px] text-[#012AFE] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {countdown}
          </div>
          <div className="text-[10px] text-[#012AFE] opacity-70 mt-0.5 font-medium uppercase">
            {dateStr} · {timeStr}
          </div>
        </div>

        <div className="flex-1 flex items-center gap-[14px]">
          <div className="flex items-center gap-2">
            {match.home.image_url && (
              <Image
                src={match.home.image_url}
                alt={match.home.name}
                width={24}
                height={24}
                className="rounded-full object-contain"
              />
            )}
            <span className="text-[15px] font-bold text-(--text)">
              {match.home.name}
            </span>
          </div>
          <span className="text-[12px] text-(--text3) font-medium">vs</span>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-(--text)">
              {match.away.name}
            </span>
            {match.away.image_url && (
              <Image
                src={match.away.image_url}
                alt={match.away.name}
                width={24}
                height={24}
                className="rounded-full object-contain"
              />
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] text-(--text2) font-semibold uppercase tracking-[0.06em]">
            Premier League
          </div>
          <div className="text-[11px] text-(--text3) mt-0.5">
            {match.stadium ?? ""}
          </div>
        </div>

        {match.odds && (
          <div className="hidden sm:flex gap-1.5 shrink-0">
            {[
              {
                value: match.odds.home_win.toFixed(2),
                label: match.home.name.slice(0, 3).toUpperCase(),
              },
              { value: match.odds.draw.toFixed(2), label: "EMP" },
              {
                value: match.odds.away_win.toFixed(2),
                label: match.away.name.slice(0, 3).toUpperCase(),
              },
            ].map((prob) => (
              <div
                key={prob.label}
                className="bg-(--pill-bg) border border-border rounded-lg px-3 py-2 text-center"
              >
                <span
                  className="text-[16px] text-(--text) block leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {prob.value}
                </span>
                <span className="text-[10px] text-(--text2) font-medium mt-0.5 block">
                  {prob.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
