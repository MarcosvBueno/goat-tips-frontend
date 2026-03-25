interface TeamInfo {
  abbr: string;
  name: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface OddsBtn {
  label: string;
  value: string;
}

interface MatchCardProps {
  league: string;
  time: string;
  teamA: TeamInfo;
  teamB: TeamInfo;
  probA: number;
  probDraw: number;
  probB: number;
  probBarColor?: string;
  probLabelA: string;
  probLabelB: string;
  odds: OddsBtn[];
}

export function MatchCard({
  league,
  time,
  teamA,
  teamB,
  probA,
  probDraw,
  probB,
  probBarColor = "#012AFE",
  probLabelA,
  probLabelB,
  odds,
}: MatchCardProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5 cursor-pointer hover:border-(--border2) hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold text-(--text2) uppercase tracking-[0.08em] flex items-center gap-1.5">
          {league}
        </div>
        <div className="text-[12px] text-(--text3) bg-(--pill-bg) px-2 py-[3px] rounded-[20px]">
          {time}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] uppercase border-[1.5px]"
            style={{
              background: teamA.bgColor,
              color: teamA.textColor,
              borderColor: teamA.borderColor,
              fontFamily: "var(--font-display)",
            }}
          >
            {teamA.abbr}
          </div>
          <div className="text-[13px] font-semibold text-(--text) text-center">
            {teamA.name}
          </div>
        </div>

        <div
          className="text-[22px] text-(--text3) shrink-0 tracking-[0.02em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          VS
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-[14px] uppercase border-[1.5px]"
            style={{
              background: teamB.bgColor,
              color: teamB.textColor,
              borderColor: teamB.borderColor,
              fontFamily: "var(--font-display)",
            }}
          >
            {teamB.abbr}
          </div>
          <div className="text-[13px] font-semibold text-(--text) text-center">
            {teamB.name}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-(--bg3) rounded-[30px] h-1.5 overflow-hidden">
          <div
            className="h-full rounded-[30px] transition-all duration-500"
            style={{ width: `${probA}%`, background: probBarColor }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] text-(--text2)">
            {probLabelA} <span className="text-(--text) font-semibold">{probA}%</span>
          </span>
          <span className="text-[11px] text-(--text2)">
            Empate <span className="text-(--text) font-semibold">{probDraw}%</span>
          </span>
          <span className="text-[11px] text-(--text2)">
            {probLabelB} <span className="text-(--text) font-semibold">{probB}%</span>
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {odds.map((odd, i) => (
          <button
            key={i}
            className="flex-1 bg-(--pill-bg) border border-border rounded-lg py-2 px-1.5 text-center cursor-pointer hover:bg-(--blue-dim) hover:border-(--blue-mid) transition-all duration-200"
          >
            <span className="text-[10px] text-(--text2) block mb-[3px] font-medium">
              {odd.label}
            </span>
            <span
              className="text-[17px] text-(--text)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {odd.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
