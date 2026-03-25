"use client";

import Link from "next/link";
import { useLiveMatches, useUpcomingMatches } from "@/hooks/use-matches";
import { MatchCard } from "@/components/home/match-card";
import { CardSkeleton } from "@/components/ui/skeleton";
import type { Match } from "@/types/api";

export function HomeMatches() {
  const { data: liveMatches, isLoading: isLoadingLive } = useLiveMatches();
  const { data: upcomingMatches, isLoading: isLoadingUpcoming } =
    useUpcomingMatches();

  const isLoading = isLoadingLive && isLoadingUpcoming;

  const popularMatches: Match[] = [
    ...(liveMatches ?? []),
    ...(upcomingMatches ?? []),
  ].slice(0, 4);

  return (
    <div className="px-6 pt-8 pb-2 max-w-[1280px] mx-auto mb-10">
      <div className="flex items-baseline justify-between mb-4">
        <div
          className="text-[28px] uppercase tracking-[0.02em] text-(--text)"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Populares
        </div>
        <Link
          href="/ao-vivo"
          className="text-[13px] text-[#012AFE] no-underline font-medium cursor-pointer hover:opacity-70 transition-opacity"
        >
          Ver mais →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : popularMatches.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-[16px] text-(--text2) font-medium">
            Nenhuma partida disponível no momento
          </div>
          <div className="text-[13px] text-(--text3) mt-1">
            Volte mais tarde para ver as partidas da Premier League
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          {popularMatches.map((match) => (
            <MatchCard key={match.event_id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
