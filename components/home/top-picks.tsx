"use client";

import { useToplist } from "@/hooks/use-matches";
import type { ToplistPlayer } from "@/types/api";

function PlayerRow({ player, rank }: { player: ToplistPlayer; rank: number }) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-(--bg2) transition-colors">
      <span
        className="w-6 h-6 rounded-full bg-(--bg3) flex items-center justify-center text-[11px] font-bold text-(--text2) shrink-0"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-(--text) truncate">
          {player.player_name}
        </div>
        <div className="text-[11px] text-(--text3) truncate">{player.team_name}</div>
      </div>
      <div
        className="text-[18px] font-bold text-[#012AFE] shrink-0"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {player.value}
      </div>
    </div>
  );
}

export function TopPicks() {
  const { data: toplist, isLoading } = useToplist();

  const hasScorers = toplist?.top_scorers && toplist.top_scorers.length > 0;
  const hasAssists = toplist?.top_assists && toplist.top_assists.length > 0;

  if (isLoading) {
    return (
      <div className="px-6 pt-6 pb-2 max-w-[1280px] mx-auto">
        <div className="h-6 w-48 bg-(--bg3) rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="bg-card border border-border rounded-[14px] p-5 h-[280px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!hasScorers && !hasAssists) return null;

  return (
    <div className="px-6 pt-6 pb-2 max-w-[1280px] mx-auto">
      <div
        className="text-[28px] uppercase tracking-[0.02em] text-(--text) mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Destaques da Liga
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hasScorers && (
          <div className="bg-card border border-border rounded-[14px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[16px]">&#9917;</span>
              <div
                className="text-[14px] uppercase tracking-[0.04em] text-(--text2) font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Artilheiros
              </div>
            </div>
            <div className="flex flex-col">
              {toplist!.top_scorers.slice(0, 10).map((p, i) => (
                <PlayerRow key={p.player_name + i} player={p} rank={i + 1} />
              ))}
            </div>
          </div>
        )}

        {hasAssists && (
          <div className="bg-card border border-border rounded-[14px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[16px]">&#127942;</span>
              <div
                className="text-[14px] uppercase tracking-[0.04em] text-(--text2) font-semibold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Assistências
              </div>
            </div>
            <div className="flex flex-col">
              {toplist!.top_assists.slice(0, 10).map((p, i) => (
                <PlayerRow key={p.player_name + i} player={p} rank={i + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
