import type { Prediction } from "@/types/api";

interface ProbabilityBarProps {
  prediction: Prediction;
}

export function ProbabilityBar({ prediction }: ProbabilityBarProps) {
  const homeProb = Math.round(prediction.home_win_prob * 100);
  const drawProb = Math.round(prediction.draw_prob * 100);
  const awayProb = Math.round(prediction.away_win_prob * 100);

  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div
        className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-3 font-semibold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Probabilidades
      </div>

      <div className="flex gap-1 h-8 rounded-lg overflow-hidden mb-3">
        <div
          className="flex items-center justify-center text-[12px] font-bold text-white rounded-l-lg transition-all duration-500"
          style={{ width: `${homeProb}%`, background: "#012AFE" }}
        >
          {homeProb}%
        </div>
        <div
          className="flex items-center justify-center text-[12px] font-bold text-(--text) transition-all duration-500"
          style={{ width: `${drawProb}%`, background: "var(--bg3)" }}
        >
          {drawProb}%
        </div>
        <div
          className="flex items-center justify-center text-[12px] font-bold text-white rounded-r-lg transition-all duration-500"
          style={{ width: `${awayProb}%`, background: "#FF3B3B" }}
        >
          {awayProb}%
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-(--text2)">
        <span>{prediction.home_team}</span>
        <span>Empate</span>
        <span>{prediction.away_team}</span>
      </div>

      {prediction.model_note && (
        <div className="mt-3 text-[11px] text-(--text3) italic">
          {prediction.model_note}
        </div>
      )}
    </div>
  );
}
