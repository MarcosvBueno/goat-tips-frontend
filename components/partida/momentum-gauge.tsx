import type { StatsTrend } from "@/types/api";

interface MomentumGaugeProps {
  statsTrend: StatsTrend;
  homeName: string;
  awayName: string;
}

export function MomentumGauge({ statsTrend, homeName, awayName }: MomentumGaugeProps) {
  const pct = ((statsTrend.momentum_score + 1) / 2) * 100;

  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div
        className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-3 font-semibold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Momentum
      </div>

      <div className="relative h-4 bg-(--bg3) rounded-full overflow-hidden mb-2">
        <div
          className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, #FF3B3B 0%, #FFB800 50%, #012AFE 100%)`,
          }}
        />
        <div
          className="absolute top-[-4px] w-5 h-5 rounded-full bg-white border-2 border-(--text) shadow transition-all duration-700"
          style={{ left: `calc(${pct}% - 10px)` }}
        />
      </div>

      <div className="flex justify-between text-[11px] text-(--text2)">
        <span>{awayName}</span>
        <span className="text-(--text) font-semibold text-[13px]">
          {statsTrend.momentum_label}
        </span>
        <span>{homeName}</span>
      </div>

      {/* Stats por período */}
      {statsTrend.periods.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid gap-3">
            {statsTrend.periods.map((p) => (
              <div key={p.period}>
                <div className="text-[11px] text-(--text3) font-medium uppercase mb-2">
                  {p.period === "1st_half" ? "1º Tempo" : p.period === "2nd_half" ? "2º Tempo" : p.period}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  {[
                    { label: "Posse", home: `${p.home_possession}%`, away: `${p.away_possession}%` },
                    { label: "Chutes", home: String(p.home_shots), away: String(p.away_shots) },
                    { label: "Escanteios", home: String(p.home_corners), away: String(p.away_corners) },
                    { label: "Ataques perigosos", home: String(p.home_dangerous_attacks), away: String(p.away_dangerous_attacks) },
                  ].map((stat) => (
                    <div key={stat.label} className="flex justify-between bg-(--bg2) rounded-lg px-3 py-2">
                      <span className="text-(--text) font-semibold">{stat.home}</span>
                      <span className="text-(--text3)">{stat.label}</span>
                      <span className="text-(--text) font-semibold">{stat.away}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
