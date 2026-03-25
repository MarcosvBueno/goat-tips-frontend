interface RiskMeterProps {
  label: string;
  score: number;
  riskLabel?: string;
}

export function RiskMeter({ label, score, riskLabel }: RiskMeterProps) {
  const pct = (score / 10) * 100;
  const color =
    score >= 7 ? "#FF3B3B" : score >= 4 ? "#FFB800" : "#00C896";

  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[14px] uppercase tracking-[0.04em] text-(--text2) font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </div>
        {riskLabel && (
          <span
            className="text-[11px] font-bold px-2 py-[3px] rounded-[4px]"
            style={{
              background:
                score >= 7
                  ? "rgba(255,59,59,0.1)"
                  : score >= 4
                    ? "rgba(255,184,0,0.1)"
                    : "rgba(0,200,150,0.1)",
              color,
            }}
          >
            {riskLabel}
          </span>
        )}
      </div>

      <div className="flex items-end gap-3">
        <div
          className="text-[36px] leading-none"
          style={{ fontFamily: "var(--font-display)", color }}
        >
          {score.toFixed(1)}
        </div>
        <span className="text-[13px] text-(--text3) mb-1">/10</span>
      </div>

      <div className="mt-3 bg-(--bg3) rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
