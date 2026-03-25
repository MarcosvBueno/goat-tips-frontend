interface ProbChip {
  value: string;
  label: string;
}

interface UpcomingCardProps {
  countdownNum: string;
  countdownLabel: string;
  teamA: string;
  teamB: string;
  league: string;
  stadium: string;
  probs: ProbChip[];
}

export function UpcomingCard({
  countdownNum,
  countdownLabel,
  teamA,
  teamB,
  league,
  stadium,
  probs,
}: UpcomingCardProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] px-6 py-5 flex items-center gap-5 cursor-pointer hover:border-(--border2) hover:bg-(--card2) transition-all duration-200 flex-wrap">
      <div className="bg-(--blue-dim) rounded-lg px-[14px] py-[10px] text-center min-w-[72px] shrink-0">
        <div
          className="text-[20px] text-[#012AFE] leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {countdownNum}
        </div>
        <div className="text-[10px] text-[#012AFE] opacity-70 mt-0.5 font-medium uppercase">
          {countdownLabel}
        </div>
      </div>

      <div className="flex-1 flex items-center gap-[14px]">
        <span className="text-[15px] font-bold text-(--text)">{teamA}</span>
        <span className="text-[12px] text-(--text3) font-medium">vs</span>
        <span className="text-[15px] font-bold text-(--text)">{teamB}</span>
      </div>

      <div className="text-right shrink-0">
        <div className="text-[11px] text-(--text2) font-semibold uppercase tracking-[0.06em]">
          {league}
        </div>
        <div className="text-[11px] text-(--text3) mt-0.5">{stadium}</div>
      </div>

      <div className="hidden sm:flex gap-1.5 shrink-0">
        {probs.map((prob, i) => (
          <div
            key={i}
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
    </div>
  );
}
