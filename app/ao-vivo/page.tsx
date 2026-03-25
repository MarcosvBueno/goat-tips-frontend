"use client";

import { useLiveMatches } from "@/hooks/use-matches";
import { useMatchStore } from "@/store/use-match-store";
import { LiveCard } from "@/components/live/live-card";
import { CardSkeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export default function AoVivoPage() {
  const { data: matches, isLoading, dataUpdatedAt } = useLiveMatches();
  const setLiveMatchIds = useMatchStore((s) => s.setLiveMatchIds);

  useEffect(() => {
    if (matches) {
      setLiveMatchIds(matches.map((m) => m.event_id));
    }
  }, [matches, setLiveMatchIds]);

  const secondsAgo = dataUpdatedAt
    ? Math.round((Date.now() - dataUpdatedAt) / 1000)
    : null;

  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <div className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <span
            className="text-[28px] uppercase tracking-[0.02em] text-(--text)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ao vivo
          </span>
          {matches && (
            <span
              className="text-[16px] text-(--text3) ml-2"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                textTransform: "none",
              }}
            >
              · {matches.length} {matches.length === 1 ? "partida" : "partidas"}
            </span>
          )}
        </div>
        {secondsAgo !== null && (
          <div className="flex items-center gap-2 text-[12px] text-(--text2)">
            <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
            Atualizado há {secondsAgo}s · BetsAPI
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !matches || matches.length === 0 ? (
        <div className="mt-16 text-center">
          <div
            className="text-[48px] text-(--text3) mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ⚽
          </div>
          <div className="text-[16px] text-(--text2) font-medium">
            Nenhuma partida ao vivo no momento
          </div>
          <div className="text-[13px] text-(--text3) mt-1">
            Verifique os próximos jogos na aba Pré-jogo
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {matches.map((match, i) => (
            <LiveCard key={match.event_id} match={match} highlighted={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
