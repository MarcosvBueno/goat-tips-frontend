import type { H2HResponse } from "@/types/api";

interface H2HSectionProps {
  h2h: H2HResponse;
}

export function H2HSection({ h2h }: H2HSectionProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div
        className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-4 font-semibold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Confrontos diretos
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        <div className="bg-(--bg2) rounded-lg p-3">
          <div
            className="text-[24px] text-[#012AFE] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {h2h.home_wins}
          </div>
          <div className="text-[11px] text-(--text2) mt-1">{h2h.home_team}</div>
        </div>
        <div className="bg-(--bg2) rounded-lg p-3">
          <div
            className="text-[24px] text-(--text3) leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {h2h.draws}
          </div>
          <div className="text-[11px] text-(--text2) mt-1">Empates</div>
        </div>
        <div className="bg-(--bg2) rounded-lg p-3">
          <div
            className="text-[24px] text-[#FF3B3B] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {h2h.away_wins}
          </div>
          <div className="text-[11px] text-(--text2) mt-1">{h2h.away_team}</div>
        </div>
      </div>

      <div className="flex justify-between text-[12px] text-(--text2) mb-4">
        <span>
          Média gols {h2h.home_team}:{" "}
          <span className="text-(--text) font-semibold">
            {h2h.home_goals_avg.toFixed(2)}
          </span>
        </span>
        <span>
          Média gols {h2h.away_team}:{" "}
          <span className="text-(--text) font-semibold">
            {h2h.away_goals_avg.toFixed(2)}
          </span>
        </span>
      </div>

      {/* Last matches */}
      {h2h.last_matches.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="text-[11px] text-(--text3) uppercase font-semibold mb-2">
            Últimos jogos ({h2h.total_matches} total)
          </div>
          <div className="flex flex-col gap-1.5">
            {h2h.last_matches.map((m) => (
              <div
                key={m.event_id}
                className="flex items-center justify-between text-[12px] bg-(--bg2) rounded-lg px-3 py-2"
              >
                <span className="text-(--text3)">{m.date}</span>
                <span className="text-(--text) font-semibold">
                  {m.home_team} {m.score_home} — {m.score_away} {m.away_team}
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background:
                      m.winner === "home"
                        ? "rgba(1,42,254,0.1)"
                        : m.winner === "away"
                          ? "rgba(255,59,59,0.1)"
                          : "rgba(255,184,0,0.1)",
                    color:
                      m.winner === "home"
                        ? "#012AFE"
                        : m.winner === "away"
                          ? "#FF3B3B"
                          : "#FFB800",
                  }}
                >
                  {m.winner === "home" ? "Casa" : m.winner === "away" ? "Fora" : "Emp"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
