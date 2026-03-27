"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Match } from "@/types/api";
import { ChevronRight } from "lucide-react";

interface UpcomingCardProps {
  match: Match;
}

function useCountdown(kickOffTime: string) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function update() {
      const diff = new Date(kickOffTime).getTime() - Date.now();
      if (diff <= 0) {
        setLabel("AGORA");
        return;
      }
      const days = Math.floor(diff / 86_400_000);
      const hours = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);

      if (days > 0) setLabel(`${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H`);
      else if (hours > 0) setLabel(`${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`);
      else setLabel(`${minutes.toString().padStart(2, '0')}M`);
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
  }).replace(". de", "");

  // Calculate generic probability indicators based on odds
  let homeProb = 33, drawProb = 34, awayProb = 33;
  if (match.probabilities && match.probabilities.home_win > 0) {
    homeProb = Math.round(match.probabilities.home_win * 100);
    drawProb = Math.round(match.probabilities.draw * 100);
    awayProb = Math.round(match.probabilities.away_win * 100);
  } else if (match.odds && match.odds.home_win > 0) {
    const rawHome = 1 / match.odds.home_win;
    const rawDraw = 1 / match.odds.draw;
    const rawAway = 1 / match.odds.away_win;
    const totalRaw = rawHome + rawDraw + rawAway;
    
    if (totalRaw > 0) {
      homeProb = Math.round((rawHome / totalRaw) * 100);
      drawProb = Math.round((rawDraw / totalRaw) * 100);
      awayProb = Math.round((rawAway / totalRaw) * 100);
    }
  }

  return (
    <Link href={`/partida/${match.event_id}`} className="no-underline block">
      <div className="group relative bg-(--card2) hover:bg-(--surface) transition-colors duration-300 p-4 sm:p-6 flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8 overflow-hidden rounded-[14px] border border-(--border)">
        {/* Hover Highlight Bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Time & Countdown */}
        <div className="flex flex-col items-center lg:items-start min-w-[100px] lg:min-w-[120px] mb-2 lg:mb-0">
          <span 
            className="text-(--text) text-xl sm:text-2xl uppercase tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {countdown}
          </span>
          <span className="text-(--text2) text-[10px] sm:text-xs uppercase tracking-tighter mt-1 font-medium">
            {dateStr} {timeStr}
          </span>
        </div>

        {/* League / Round */}
        <div className="hidden xl:flex flex-col min-w-[140px]">
          <span className="text-(--text3) text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">
            Liga
          </span>
          <span className="text-(--text) font-bold text-xs uppercase">
            {match.round || "Premier League"}
          </span>
        </div>

        {/* Teams VS */}
        <div className="flex-1 grid grid-cols-[100px_40px_100px] sm:grid-cols-[120px_40px_120px] lg:grid-cols-[140px_60px_140px] justify-center lg:justify-start items-center w-full lg:w-auto my-2 lg:my-0">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-(--bg2) rounded-full flex items-center justify-center p-1.5 sm:p-2 border border-(--border2)">
              {match.home.image_url ? (
                <Image
                  src={match.home.image_url}
                  alt={match.home.name}
                  width={32}
                  height={32}
                  className="object-contain w-6 h-6 sm:w-8 sm:h-8"
                />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-(--border)" />
              )}
            </div>
            <span
              className="text-[10px] sm:text-sm tracking-widest text-(--text) uppercase w-full text-center truncate px-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {match.home.name}
            </span>
          </div>
          
          <div 
            className="text-(--text3) text-sm sm:text-xl opacity-30 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            VS
          </div>
          
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-(--bg2) rounded-full flex items-center justify-center p-1.5 sm:p-2 border border-(--border2)">
              {match.away.image_url ? (
                <Image
                  src={match.away.image_url}
                  alt={match.away.name}
                  width={32}
                  height={32}
                  className="object-contain w-6 h-6 sm:w-8 sm:h-8"
                />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-(--border)" />
              )}
            </div>
            <span
              className="text-[10px] sm:text-sm tracking-widest text-(--text) uppercase w-full text-center truncate px-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {match.away.name}
            </span>
          </div>
        </div>

        {/* Poisson Probability (Odds Indicator) */}
        <div className="flex flex-col items-center lg:items-end gap-2 sm:gap-3 min-w-[200px] sm:min-w-[280px] w-full lg:w-auto mt-2 lg:mt-0">
          <span className="text-(--text2) text-[10px] uppercase tracking-[0.2em] font-bold">
            Probabilidade Poisson
          </span>
          <div className="flex gap-1 w-full h-10 bg-(--bg2) rounded overflow-hidden p-1 border border-(--border2)">
            {/* Home */}
            <div 
              className={`flex flex-col justify-center items-center rounded-sm transition-all ${homeProb > Math.max(drawProb, awayProb) ? 'bg-[var(--primary)]' : 'bg-(--bg3)'}`} 
              style={{ width: `${homeProb}%` }}
            >
              <span className={`text-[10px] font-bold ${homeProb > Math.max(drawProb, awayProb) ? 'text-white' : 'text-(--text)'}`}>{homeProb}%</span>
              <span className={`text-[8px] uppercase font-semibold ${homeProb > Math.max(drawProb, awayProb) ? 'text-white/70' : 'text-(--text2)'}`}>Casa</span>
            </div>
            {/* Draw */}
            <div 
              className={`flex flex-col justify-center items-center rounded-sm transition-all ${drawProb > Math.max(homeProb, awayProb) ? 'bg-[var(--primary)]' : 'bg-(--bg3)'}`} 
              style={{ width: `${drawProb}%` }}
            >
              <span className={`text-[10px] font-bold ${drawProb > Math.max(homeProb, awayProb) ? 'text-white' : 'text-(--text)'}`}>{drawProb}%</span>
              <span className={`text-[8px] uppercase font-semibold ${drawProb > Math.max(homeProb, awayProb) ? 'text-white/70' : 'text-(--text2)'}`}>Empate</span>
            </div>
            {/* Away */}
            <div 
              className={`flex flex-col justify-center items-center rounded-sm transition-all ${awayProb > Math.max(homeProb, drawProb) ? 'bg-[var(--primary)]' : 'bg-(--bg3)'}`} 
              style={{ width: `${awayProb}%` }}
            >
              <span className={`text-[10px] font-bold ${awayProb > Math.max(homeProb, drawProb) ? 'text-white' : 'text-(--text)'}`}>{awayProb}%</span>
              <span className={`text-[8px] uppercase font-semibold ${awayProb > Math.max(homeProb, drawProb) ? 'text-white/70' : 'text-(--text2)'}`}>Fora</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="hidden lg:flex shrink-0">
          <ChevronRight className="w-5 h-5 text-(--text3) group-hover:text-[var(--primary)] transition-colors" />
        </div>
      </div>
    </Link>
  );
}
