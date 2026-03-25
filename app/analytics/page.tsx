import { AnalyticsCard } from "@/components/analytics/analytics-card";

export default function AnalyticsPage() {
  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <div
        className="text-[28px] uppercase tracking-[0.02em] text-(--text) mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Analytics
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard
          title="Arsenal · Perfil de time"
          badge="Premier League"
          stats={[
            { label: "xG por jogo", value: "2.14", fill: 81, color: "blue" },
            { label: "xG concedido", value: "0.82", fill: 31, color: "green" },
            { label: "Posse média", value: "64%", fill: 64, color: "blue" },
            { label: "PPDA (pressão)", value: "7.2", fill: 72, color: "amber" },
            { label: "Home vs Away delta", value: "+18%", fill: 68, color: "green" },
          ]}
        />

        <AnalyticsCard
          title="Árbitro: Michael Oliver"
          badge="PL 2025-26"
          stats={[
            { label: "Cartões por jogo", value: "4.2", fill: 70, color: "red" },
            { label: "Pênaltis apitados/jogo", value: "0.3", fill: 30, color: "amber" },
            { label: "Faltas apitadas", value: "22 / jogo", fill: 55, color: "blue" },
            { label: "Bias home/away", value: "+5% casa", fill: 55, color: "green" },
          ]}
        />

        <AnalyticsCard
          title="Calibração do modelo"
          badge="StatsBomb · 1.8k partidas"
          fullWidth
          calibrationItems={[
            { num: "84%", label: "Acurácia geral" },
            { num: "0.12", label: "Brier Score (xG)" },
            { num: "78%", label: "AUC · Cartões" },
            { num: "91%", label: "Over/Under 2.5" },
          ]}
        />
      </div>
    </div>
  );
}
