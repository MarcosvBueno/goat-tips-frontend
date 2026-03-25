interface LiveMeter {
  label: string;
  valueA: string;
  valueB: string;
  fillA: number;
  fillB?: number;
  fillAColor?: string;
  fillBColor?: string;
}

interface TeamInfo {
  abbr: string;
  name: string;
  bgColor: string;
  textColor: string;
}

interface LiveCardProps {
  minute: string;
  teamA: TeamInfo;
  teamB: TeamInfo;
  score: string;
  meters: LiveMeter[];
  insight: string;
  insightStrong?: string;
  probability: string;
  probColor?: string;
  probBg?: string;
  highlighted?: boolean;
}

export function LiveCard({
  minute,
  teamA,
  teamB,
  score,
  meters,
  insight,
  insightStrong,
  probability,
  probColor = "#012AFE",
  probBg = "var(--blue-dim)",
  highlighted = false,
}: LiveCardProps) {
  return (
    <div
      className={`bg-card border rounded-[14px] p-5 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden ${
        highlighted
          ? "border-[rgba(1,42,254,0.25)] hover:border-(--blue-mid)"
          : "border-border hover:border-(--blue-mid)"
      }`}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#012AFE] rounded-t-[14px]" />
      )}

      <div
        className="inline-flex items-center gap-1.5 rounded-[20px] text-[12px] font-bold px-[10px] py-1 mb-4"
        style={{ background: "rgba(255,59,59,0.1)", color: "#FF3B3B" }}
      >
        <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
        {minute}
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="text-center flex-1">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] mx-auto border-[1.5px] border-(--border2)"
            style={{
              background: teamA.bgColor,
              color: teamA.textColor,
              fontFamily: "var(--font-display)",
            }}
          >
            {teamA.abbr}
          </div>
          <div className="text-[13px] font-semibold text-(--text) mt-2">{teamA.name}</div>
        </div>

        <div
          className="text-[44px] leading-none text-(--text) tracking-[-0.02em] px-4 shrink-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {score}
        </div>

        <div className="text-center flex-1">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] mx-auto border-[1.5px] border-(--border2)"
            style={{
              background: teamB.bgColor,
              color: teamB.textColor,
              fontFamily: "var(--font-display)",
            }}
          >
            {teamB.abbr}
          </div>
          <div className="text-[13px] font-semibold text-(--text) mt-2">{teamB.name}</div>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        {meters.map((meter, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-(--text2) font-medium">
              <span>{meter.label}</span>
              <span>
                {meter.valueA} · {meter.valueB}
              </span>
            </div>
            <div className="bg-(--bg3) rounded-[4px] h-[5px] overflow-hidden relative">
              <div
                className="absolute left-0 top-0 bottom-0 rounded-[4px]"
                style={{
                  width: `${meter.fillA}%`,
                  background: meter.fillAColor || "#012AFE",
                }}
              />
              {meter.fillB !== undefined && (
                <div
                  className="absolute right-0 top-0 bottom-0 rounded-[4px]"
                  style={{
                    width: `${meter.fillB}%`,
                    background: meter.fillBColor || "rgba(255,59,59,0.5)",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-[14px] border-t border-border">
        <div className="text-[12px] text-(--text2) leading-[1.4] flex-1">
          {insightStrong && (
            <strong className="text-(--text)">{insightStrong}</strong>
          )}{" "}
          {insight}
        </div>
        <div
          className="text-[22px] w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 ml-3"
          style={{
            fontFamily: "var(--font-display)",
            color: probColor,
            background: probBg,
          }}
        >
          {probability}
        </div>
      </div>
    </div>
  );
}
