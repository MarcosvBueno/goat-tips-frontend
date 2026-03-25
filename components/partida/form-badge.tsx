import type { TeamForm } from "@/types/api";

interface FormBadgeProps {
  form: TeamForm;
}

export function FormBadge({ form }: FormBadgeProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[14px] uppercase tracking-[0.04em] text-(--text2) font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {form.team_name}
        </div>
        <span className="text-[11px] bg-(--blue-dim) text-[#012AFE] px-2 py-[2px] rounded-[4px] font-semibold">
          Últimos {form.last_n_matches}
        </span>
      </div>

      <div className="flex gap-1.5 mb-3">
        {form.form_string.split("").map((r, i) => (
          <span
            key={i}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
            style={{
              background:
                r === "W" ? "#00C896" : r === "D" ? "#FFB800" : "#FF3B3B",
            }}
          >
            {r}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-[12px]">
        <div className="bg-(--bg2) rounded-lg px-3 py-2">
          <span className="text-(--text3)">Gols marcados/jogo: </span>
          <span className="text-(--text) font-semibold">
            {form.avg_goals_scored.toFixed(1)}
          </span>
        </div>
        <div className="bg-(--bg2) rounded-lg px-3 py-2">
          <span className="text-(--text3)">Gols sofridos/jogo: </span>
          <span className="text-(--text) font-semibold">
            {form.avg_goals_conceded.toFixed(1)}
          </span>
        </div>
      </div>

      {form.matches.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex flex-col gap-1">
            {form.matches.slice(0, 5).map((m) => (
              <div
                key={m.event_id}
                className="flex items-center justify-between text-[11px] bg-(--bg2) rounded-lg px-3 py-1.5"
              >
                <span className="text-(--text3)">{m.date}</span>
                <span className="text-(--text)">
                  vs {m.opponent} ({m.home_or_away === "home" ? "C" : "F"})
                </span>
                <span className="font-semibold text-(--text)">
                  {m.goals_scored} — {m.goals_conceded}
                </span>
                <span
                  className="font-bold"
                  style={{
                    color:
                      m.result === "W"
                        ? "#00C896"
                        : m.result === "D"
                          ? "#FFB800"
                          : "#FF3B3B",
                  }}
                >
                  {m.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
