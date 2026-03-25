interface JogoRowProps {
  date: string;
  teamA: string;
  teamB: string;
  score: string;
  result: "win" | "loss" | "draw";
  resultLabel: string;
  odd: string;
}

const RESULT_STYLES = {
  win: "bg-[rgba(0,200,150,0.12)] text-[#00C896]",
  loss: "bg-[rgba(255,59,59,0.1)] text-[#FF3B3B]",
  draw: "bg-[rgba(248,248,248,0.08)] text-(--text2)",
};

export function JogoRow({ date, teamA, teamB, score, result, resultLabel, odd }: JogoRowProps) {
  return (
    <div className="bg-card border border-border rounded-lg px-5 py-[14px] flex items-center gap-5 cursor-pointer hover:border-(--border2) hover:bg-(--card2) transition-all duration-200">
      <div className="text-[12px] text-(--text3) w-20 shrink-0 hidden sm:block">
        {date}
      </div>
      <div className="flex-1 flex items-center gap-3 text-[14px] font-semibold text-(--text)">
        {teamA}
        <span className="text-(--text3) font-normal mx-1.5">vs</span>
        {teamB}
      </div>
      <div
        className="text-[20px] text-(--text) shrink-0 w-[60px] text-center"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {score}
      </div>
      <div
        className={`text-[11px] font-bold px-2 py-[3px] rounded-[4px] uppercase tracking-[0.05em] shrink-0 hidden sm:block ${RESULT_STYLES[result]}`}
      >
        {resultLabel}
      </div>
      <div
        className="text-[18px] text-[#012AFE] shrink-0 hidden md:block"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {odd}
      </div>
      <svg
        className="text-(--text3) shrink-0"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
