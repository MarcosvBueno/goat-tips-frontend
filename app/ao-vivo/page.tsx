import { LiveCard } from "@/components/live/live-card";

const LIVE_MATCHES = [
  {
    minute: "73'",
    teamA: { abbr: "ARS", name: "Arsenal", bgColor: "rgba(239,0,0,0.1)", textColor: "#EF0000" },
    teamB: { abbr: "CHE", name: "Chelsea", bgColor: "rgba(3,70,148,0.1)", textColor: "#034694" },
    score: "1 — 0",
    meters: [
      { label: "Posse", valueA: "Arsenal 67%", valueB: "Chelsea 33%", fillA: 67, fillB: 33 },
      { label: "xG", valueA: "1.4", valueB: "0.9", fillA: 60, fillB: 40 },
    ],
    insightStrong: undefined,
    insight: "Chelsea acumulou 4 escanteios seguidos — padrão precede gol em 58% dos casos.",
    probability: "71%",
    probColor: "#012AFE",
    probBg: "var(--blue-dim)",
    highlighted: true,
  },
  {
    minute: "51'",
    teamA: { abbr: "LIV", name: "Liverpool", bgColor: "rgba(200,16,46,0.1)", textColor: "#C8102E" },
    teamB: { abbr: "MCI", name: "Man City", bgColor: "rgba(108,171,221,0.1)", textColor: "#6CABDD" },
    score: "0 — 0",
    meters: [
      { label: "Posse", valueA: "LIV 48%", valueB: "MCI 52%", fillA: 48, fillB: 52 },
      { label: "xG", valueA: "0.6", valueB: "0.8", fillA: 43, fillB: 57 },
    ],
    insightStrong: "Jogo equilibrado.",
    insight: "City com leve pressão — ambos converteram todas as grandes chances.",
    probability: "48%",
    probColor: "#012AFE",
    probBg: "var(--blue-dim)",
    highlighted: false,
  },
  {
    minute: "38'",
    teamA: { abbr: "BAY", name: "Bayern", bgColor: "rgba(252,75,35,0.1)", textColor: "#FC4B23" },
    teamB: { abbr: "LEI", name: "Leverkusen", bgColor: "rgba(0,0,0,0.05)", textColor: "var(--text2)" },
    score: "2 — 0",
    meters: [
      { label: "Posse", valueA: "BAY 71%", valueB: "LEV 29%", fillA: 71, fillAColor: "#FC4B23" },
      { label: "xG", valueA: "2.1", valueB: "0.3", fillA: 87, fillAColor: "#FC4B23" },
    ],
    insightStrong: undefined,
    insight: "Bayern domina. Haaland com hat-trick é histórico — prob. 3º gol: 44%.",
    probability: "91%",
    probColor: "#FC4B23",
    probBg: "rgba(252,75,35,0.1)",
    highlighted: false,
  },
  {
    minute: "82'",
    teamA: { abbr: "ATM", name: "Atlético", bgColor: "rgba(164,0,0,0.1)", textColor: "#A40000" },
    teamB: { abbr: "BAR", name: "Barcelona", bgColor: "rgba(0,100,168,0.1)", textColor: "#0064A8" },
    score: "1 — 1",
    meters: [
      { label: "Posse", valueA: "ATM 38%", valueB: "BAR 62%", fillA: 38, fillAColor: "#A40000", fillB: 62 },
      { label: "xG", valueA: "1.1", valueB: "1.6", fillA: 40, fillAColor: "#A40000", fillB: 60 },
    ],
    insightStrong: "82' empatado.",
    insight: "Pressão Barça crescente nos últimos 10 min — gol em 63% dos casos.",
    probability: "63%",
    probColor: "#00C896",
    probBg: "rgba(0,200,150,0.1)",
    highlighted: false,
  },
];

export default function AoVivoPage() {
  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <div className="flex items-baseline justify-between flex-wrap gap-3">
        <div>
          <span
            className="text-[28px] uppercase tracking-[0.02em] text-(--text)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ao vivo
          </span>
          <span
            className="text-[16px] text-(--text3) ml-2"
            style={{ fontFamily: "var(--font-body)", fontWeight: 400, textTransform: "none" }}
          >
            · 4 partidas
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-(--text2)">
          <span className="inline-block w-[6px] h-[6px] rounded-full bg-[#FF3B3B] animate-pulse-red" />
          Atualizado há 8s · BetsAPI
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {LIVE_MATCHES.map((match, i) => (
          <LiveCard key={i} {...match} />
        ))}
      </div>
    </div>
  );
}
