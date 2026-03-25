import { TipCard } from "./tip-card";

const TIPS = [
  {
    variant: "green" as const,
    badgeLabel: "CA Turbinada",
    badgeIcon: "lightning" as const,
    jerseyNumber: 42,
    player: "Flaco Lopez",
    match: "São Paulo · Palmeiras",
    teams: [
      { initials: "SP", color: "#CC0000" },
      { initials: "PAL", color: "#006B3F" },
    ],
    bets: [
      { label: "Resultado Final", value: "Palmeiras" },
      { label: "Total de Gols / Mais/Menos", value: "Mais de 1.5" },
      { label: "Marcar em qualquer momento", value: "Flaco Lopez" },
    ],
    finalOdd: "5.60",
    usersCount: "30k+",
  },
  {
    variant: "blue" as const,
    badgeLabel: "Tip Goat",
    badgeIcon: "star" as const,
    jerseyNumber: 20,
    player: "João Pedro",
    match: "Everton · Chelsea",
    teams: [
      { initials: "EVE", color: "#003399" },
      { initials: "CHE", color: "#034694" },
    ],
    bets: [
      { label: "Resultado Final", value: "Chelsea" },
      { label: "Marcar a qualquer momento", value: "João Pedro" },
      { label: "Chutes no gol", value: "2+" },
    ],
    finalOdd: "5.30",
    usersCount: "10k+",
  },
  {
    variant: "red" as const,
    badgeLabel: "Ao Vivo",
    badgeIcon: "dot" as const,
    jerseyNumber: 7,
    player: "Saka",
    match: "Arsenal · Chelsea · 73'",
    teams: [
      { initials: "ARS", color: "#EF0107" },
      { initials: "CHE", color: "#034694" },
    ],
    bets: [
      { label: "Arsenal vencer", value: "odds 1.62" },
      { label: "Over 1.5 gols", value: "95% prob." },
      { label: "Saka", value: "assistência ou gol" },
    ],
    finalOdd: "1.62",
    usersCount: "22k+",
  },
  {
    variant: "teal" as const,
    badgeLabel: "CA Turbinada",
    badgeIcon: "lightning" as const,
    jerseyNumber: 11,
    player: "Salah",
    match: "Liverpool · Man City",
    teams: [
      { initials: "LIV", color: "#C8102E" },
      { initials: "MCI", color: "#6CABDD" },
    ],
    bets: [
      { label: "Liverpool vencer ou empate" },
      { label: "Salah finalizações", value: "2+" },
      { label: "Ambas marcam", value: "Sim" },
    ],
    finalOdd: "4.75",
    usersCount: "18k+",
  },
  {
    variant: "blue" as const,
    badgeLabel: "Tip Goat",
    badgeIcon: "star" as const,
    jerseyNumber: 9,
    player: "Haaland",
    match: "Man City · Spurs",
    teams: [
      { initials: "MCI", color: "#6CABDD" },
      { initials: "TOT", color: "#132257" },
    ],
    bets: [
      { label: "Haaland marcar", value: "a qualquer momento" },
      { label: "City vencer", value: "odds 1.45" },
      { label: "Over 2.5 gols no jogo" },
    ],
    finalOdd: "3.20",
    usersCount: "41k+",
  },
];

export function TipsScroll() {
  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between px-6 mb-5 max-w-[1280px] mx-auto">
        <div
          className="text-[28px] uppercase tracking-[0.02em] text-(--text)"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Tips do dia
        </div>
        <a className="text-[13px] text-[#012AFE] no-underline font-medium cursor-pointer hover:opacity-70 transition-opacity">
          Ver todas →
        </a>
      </div>
      <div
        className="flex gap-4 px-6 pb-5 overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          paddingTop: "6px",
        }}
      >
        {TIPS.map((tip, i) => (
          <TipCard key={i} {...tip} />
        ))}
      </div>
    </div>
  );
}
