import { UpcomingCard } from "@/components/prejogo/upcoming-card";

const UPCOMING_MATCHES = [
  {
    countdownNum: "2h",
    countdownLabel: "Restam",
    teamA: "Arsenal",
    teamB: "Chelsea",
    league: "Premier League",
    stadium: "Emirates Stadium",
    probs: [
      { value: "67%", label: "ARS" },
      { value: "18%", label: "EMP" },
      { value: "15%", label: "CHE" },
    ],
  },
  {
    countdownNum: "4h",
    countdownLabel: "Restam",
    teamA: "Liverpool",
    teamB: "Man City",
    league: "Premier League",
    stadium: "Anfield",
    probs: [
      { value: "52%", label: "LIV" },
      { value: "22%", label: "EMP" },
      { value: "26%", label: "MCI" },
    ],
  },
  {
    countdownNum: "1d",
    countdownLabel: "Amanhã",
    teamA: "Bayern",
    teamB: "Dortmund",
    league: "Bundesliga",
    stadium: "Allianz Arena",
    probs: [
      { value: "61%", label: "BAY" },
      { value: "20%", label: "EMP" },
      { value: "19%", label: "BVB" },
    ],
  },
  {
    countdownNum: "2d",
    countdownLabel: "Qua.",
    teamA: "Barcelona",
    teamB: "Real Madrid",
    league: "La Liga",
    stadium: "Camp Nou",
    probs: [
      { value: "46%", label: "BAR" },
      { value: "22%", label: "EMP" },
      { value: "32%", label: "RMA" },
    ],
  },
];

export default function PreJogoPage() {
  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <div
        className="text-[28px] uppercase tracking-[0.02em] text-(--text) mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Próximos jogos
      </div>
      <div className="flex flex-col gap-[10px]">
        {UPCOMING_MATCHES.map((match, i) => (
          <UpcomingCard key={i} {...match} />
        ))}
      </div>
    </div>
  );
}
