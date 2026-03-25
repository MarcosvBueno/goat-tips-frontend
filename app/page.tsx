import { LeagueBar } from "@/components/home/league-bar";
import { Hero } from "@/components/home/hero";
import { TickerBand } from "@/components/home/ticker-band";
import { TipsScroll } from "@/components/home/tips-scroll";
import { CtaBanner } from "@/components/home/cta-banner";
import { MatchCard } from "@/components/home/match-card";
import { JogoRow } from "@/components/home/jogo-row";

const POPULAR_MATCHES = [
  {
    league: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
    time: "Hoje 20:45",
    teamA: { abbr: "ARS", name: "Arsenal", bgColor: "rgba(239,0,0,0.1)", textColor: "#EF0000", borderColor: "rgba(239,0,0,0.2)" },
    teamB: { abbr: "CHE", name: "Chelsea", bgColor: "rgba(3,70,148,0.1)", textColor: "#034694", borderColor: "rgba(3,70,148,0.2)" },
    probA: 67, probDraw: 18, probB: 15,
    probBarColor: "#012AFE",
    probLabelA: "Arsenal", probLabelB: "Chelsea",
    odds: [{ label: "Arsenal", value: "1.62" }, { label: "Empate", value: "4.10" }, { label: "Chelsea", value: "5.90" }],
  },
  {
    league: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
    time: "Hoje 18:30",
    teamA: { abbr: "LIV", name: "Liverpool", bgColor: "rgba(200,16,46,0.1)", textColor: "#C8102E", borderColor: "rgba(200,16,46,0.2)" },
    teamB: { abbr: "MCI", name: "Man City", bgColor: "rgba(108,171,221,0.1)", textColor: "#6CABDD", borderColor: "rgba(108,171,221,0.2)" },
    probA: 52, probDraw: 22, probB: 26,
    probBarColor: "#FF6B35",
    probLabelA: "Liverpool", probLabelB: "City",
    odds: [{ label: "Liverpool", value: "2.15" }, { label: "Empate", value: "3.60" }, { label: "City", value: "3.40" }],
  },
  {
    league: "🇩🇪 Bundesliga",
    time: "Amanhã 15:30",
    teamA: { abbr: "BAY", name: "Bayern", bgColor: "rgba(252,75,35,0.1)", textColor: "#FC4B23", borderColor: "rgba(252,75,35,0.2)" },
    teamB: { abbr: "BVB", name: "Dortmund", bgColor: "rgba(255,205,0,0.1)", textColor: "#FFCD00", borderColor: "rgba(255,205,0,0.2)" },
    probA: 61, probDraw: 20, probB: 19,
    probBarColor: "#012AFE",
    probLabelA: "Bayern", probLabelB: "BVB",
    odds: [{ label: "Bayern", value: "1.75" }, { label: "Empate", value: "4.20" }, { label: "BVB", value: "4.80" }],
  },
  {
    league: "🇪🇸 La Liga",
    time: "Amanhã 21:00",
    teamA: { abbr: "ATM", name: "Atlético", bgColor: "rgba(164,0,0,0.1)", textColor: "#A40000", borderColor: "rgba(164,0,0,0.2)" },
    teamB: { abbr: "BAR", name: "Barcelona", bgColor: "rgba(0,100,168,0.1)", textColor: "#0064A8", borderColor: "rgba(0,100,168,0.2)" },
    probA: 38, probDraw: 25, probB: 37,
    probBarColor: "#00C896",
    probLabelA: "Atlético", probLabelB: "Barça",
    odds: [{ label: "Atlético", value: "2.80" }, { label: "Empate", value: "3.30" }, { label: "Barça", value: "2.75" }],
  },
];

const PREVIOUS_GAMES = [
  { date: "23 Mar 2026", teamA: "Arsenal", teamB: "Chelsea", score: "2 — 0", result: "win" as const, resultLabel: "Acerto", odd: "5.30" },
  { date: "22 Mar 2026", teamA: "Liverpool", teamB: "Man City", score: "1 — 1", result: "draw" as const, resultLabel: "Empate", odd: "3.60" },
  { date: "21 Mar 2026", teamA: "Bayern", teamB: "Dortmund", score: "3 — 1", result: "win" as const, resultLabel: "Acerto", odd: "1.75" },
  { date: "20 Mar 2026", teamA: "Barcelona", teamB: "Real Madrid", score: "2 — 3", result: "loss" as const, resultLabel: "Erro", odd: "4.50" },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <LeagueBar />
      <Hero />
      <TickerBand />
      <TipsScroll />
      <CtaBanner />

      {/* Populares */}
      <div className="px-6 pt-8 pb-2 max-w-[1280px] mx-auto mb-10">
        <div className="flex items-baseline justify-between mb-4">
          <div
            className="text-[28px] uppercase tracking-[0.02em] text-(--text)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Populares
          </div>
          <a className="text-[13px] text-[#012AFE] no-underline font-medium cursor-pointer hover:opacity-70 transition-opacity">
            Ver mais →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          {POPULAR_MATCHES.map((match, i) => (
            <MatchCard key={i} {...match} />
          ))}
        </div>
      </div>

      {/* Jogos anteriores */}
      <div className="mb-10">
        <div className="flex items-baseline justify-between px-6 mb-4 max-w-[1280px] mx-auto">
          <div
            className="text-[28px] uppercase tracking-[0.02em] text-(--text)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Jogos anteriores
          </div>
          <a className="text-[13px] text-[#012AFE] no-underline font-medium cursor-pointer hover:opacity-70 transition-opacity">
            Histórico →
          </a>
        </div>
        <div className="flex flex-col gap-2 px-6 max-w-[1280px] mx-auto">
          {PREVIOUS_GAMES.map((game, i) => (
            <JogoRow key={i} {...game} />
          ))}
        </div>
      </div>
    </div>
  );
}
