"use client";

import { useUpcomingMatches } from "@/hooks/use-matches";
import { UpcomingCard } from "@/components/prejogo/upcoming-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreJogoPage() {
  const { data: matches, isLoading } = useUpcomingMatches();

  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <div
        className="text-[28px] uppercase tracking-[0.02em] text-(--text) mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Próximos jogos
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-[10px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full" />
          ))}
        </div>
      ) : !matches || matches.length === 0 ? (
        <div className="mt-16 text-center">
          <div
            className="text-[48px] text-(--text3) mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            📅
          </div>
          <div className="text-[16px] text-(--text2) font-medium">
            Nenhum jogo agendado no momento
          </div>
          <div className="text-[13px] text-(--text3) mt-1">
            Os próximos jogos aparecerão aqui assim que forem anunciados
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[10px]">
          {matches.map((match) => (
            <UpcomingCard key={match.event_id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
