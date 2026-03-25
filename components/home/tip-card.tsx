interface TipBet {
  label: string;
  value?: string;
}

interface TipTeam {
  initials: string;
  color: string;
}

interface TipCardProps {
  variant?: "green" | "blue" | "red" | "teal";
  badgeLabel: string;
  badgeIcon?: "lightning" | "dot" | "star";
  jerseyNumber: number;
  player: string;
  match: string;
  bets: TipBet[];
  finalOdd: string;
  teams: TipTeam[];
  usersCount: string;
}

const VARIANTS = {
  green: {
    from: "#0E2D1C",
    to: "#061209",
    jersey: "#1D5230",
    jerseyAccent: "#2A7044",
    accent: "#2DDC8A",
    badgeBg: "rgba(255,80,55,0.18)",
    badgeColor: "#FF7055",
    oddsBg: "rgba(45,220,138,0.14)",
    oddsColor: "#2DDC8A",
  },
  blue: {
    from: "#09153A",
    to: "#040B20",
    jersey: "#122268",
    jerseyAccent: "#1E389A",
    accent: "#5585FF",
    badgeBg: "rgba(85,133,255,0.18)",
    badgeColor: "#7AA3FF",
    oddsBg: "rgba(85,133,255,0.14)",
    oddsColor: "#5585FF",
  },
  red: {
    from: "#2C0A0A",
    to: "#130404",
    jersey: "#521212",
    jerseyAccent: "#7C1C1C",
    accent: "#FF5555",
    badgeBg: "rgba(255,60,60,0.18)",
    badgeColor: "#FF6060",
    oddsBg: "rgba(255,80,80,0.14)",
    oddsColor: "#FF5555",
  },
  teal: {
    from: "#092E2C",
    to: "#041615",
    jersey: "#125454",
    jerseyAccent: "#1C7A7A",
    accent: "#0DDAC8",
    badgeBg: "rgba(13,218,200,0.15)",
    badgeColor: "#0DDAC8",
    oddsBg: "rgba(13,218,200,0.13)",
    oddsColor: "#0DDAC8",
  },
};

function JerseyIcon({
  number,
  bg,
  accent,
}: {
  number: number;
  bg: string;
  accent: string;
}) {
  return (
    <div className="relative mx-auto" style={{ width: 84, height: 75 }}>
      <svg
        viewBox="0 0 84 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Left sleeve */}
        <path d="M0 20 L21 9 L30 31 L14 36 Z" fill={accent} />
        {/* Right sleeve */}
        <path d="M84 20 L63 9 L54 31 L70 36 Z" fill={accent} />
        {/* Body */}
        <path
          d="M14 36 L30 31 L33 9 Q42 17 51 9 L54 31 L70 36 L70 75 L14 75 Z"
          fill={bg}
        />
        {/* V-collar */}
        <path
          d="M33 9 L42 21 L51 9"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Subtle top highlight */}
        <path
          d="M14 36 L30 31 L33 9 Q42 17 51 9 L54 31 L70 36"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      </svg>
      {/* Number */}
      <div className="absolute inset-0 flex items-center justify-center pt-6">
        <span
          className="text-[34px] text-white/90 leading-none select-none"
          style={{
            fontFamily: "var(--font-display)",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          }}
        >
          {number}
        </span>
      </div>
    </div>
  );
}

function BadgeIcon({ type }: { type: "lightning" | "dot" | "star" }) {
  if (type === "dot")
    return (
      <span className="w-[6px] h-[6px] rounded-full bg-current shrink-0 animate-pulse-red" />
    );
  if (type === "star")
    return (
      <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
        <path d="M4.5 0L5.5 3.5H9L6.3 5.6L7.3 9L4.5 6.9L1.7 9L2.7 5.6L0 3.5H3.5Z" />
      </svg>
    );
  // lightning
  return (
    <svg width="7" height="11" viewBox="0 0 7 11" fill="currentColor">
      <path d="M4 0L0 6.5H3L2 11L7 4.5H4L4 0Z" />
    </svg>
  );
}

export function TipCard({
  variant = "green",
  badgeLabel,
  badgeIcon = "lightning",
  jerseyNumber,
  player,
  match,
  bets,
  finalOdd,
  teams,
  usersCount,
}: TipCardProps) {
  const v = VARIANTS[variant];

  return (
    <div
      className="relative w-[218px] shrink-0 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:scale-[1.01] transition-all duration-250"
      style={{
        background: `linear-gradient(170deg, ${v.from} 0%, ${v.to} 100%)`,
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Top glow from jersey color */}
      <div
        className="absolute top-0 left-0 right-0 h-[120px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% -10%, ${v.jerseyAccent}55 0%, transparent 70%)`,
        }}
      />

      {/* ── Top row ── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-4 mb-3">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.08em]"
          style={{ background: v.badgeBg, color: v.badgeColor }}
        >
          <BadgeIcon type={badgeIcon} />
          {badgeLabel}
        </div>

        {/* Users count */}
        <div className="flex items-center gap-1">
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="rgba(255,255,255,0.4)"
          >
            <path d="M6 0C4.3 0 3 1.3 3 3s1.3 3 3 3 3-1.3 3-3S7.7 0 6 0zM0 12c0-3.3 2.7-6 6-6s6 2.7 6 6H0z" />
          </svg>
          <span className="text-[11px] font-semibold text-white/50">
            {usersCount}
          </span>
        </div>
      </div>

      {/* ── Jersey visual ── */}
      <div className="relative z-10 px-4 mb-4">
        <JerseyIcon number={jerseyNumber} bg={v.jersey} accent={v.jerseyAccent} />

        {/* Team logos */}
        <div className="flex items-center justify-center gap-2.5 mt-3">
          {teams.map((team, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                style={{
                  background: team.color,
                  boxShadow: `0 0 8px ${team.color}66`,
                }}
              >
                {team.initials}
              </div>
              {i < teams.length - 1 && (
                <span className="text-[9px] text-white/30 font-semibold">
                  VS
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div
        className="relative z-10 mx-4 mb-3"
        style={{ height: "1px", background: "rgba(255,255,255,0.07)" }}
      />

      {/* ── Player + match ── */}
      <div className="relative z-10 px-4 mb-3 text-center">
        <div className="text-[13px] font-bold text-white leading-tight">
          {player}
        </div>
        <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
          {match}
        </div>
      </div>

      {/* ── Bet items ── */}
      <div className="relative z-10 px-4 mb-4 flex flex-col gap-[6px]">
        {bets.map((bet, i) => (
          <div key={i} className="flex items-start gap-2 leading-[1.35]">
            <span
              className="text-[9px] mt-[3px] shrink-0"
              style={{ color: v.accent }}
            >
              ○
            </span>
            <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {bet.label}
              {bet.value && (
                <>
                  {" "}–{" "}
                  <span className="font-semibold text-white/85">{bet.value}</span>
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* ── Odds ── */}
      <div className="relative z-10 px-4 pb-4">
        <div
          className="w-full py-2.5 rounded-xl text-center font-bold text-[20px] leading-none"
          style={{
            background: v.oddsBg,
            color: v.oddsColor,
            border: `1px solid ${v.oddsColor}33`,
            fontFamily: "var(--font-display)",
          }}
        >
          {finalOdd}
        </div>
      </div>
    </div>
  );
}
