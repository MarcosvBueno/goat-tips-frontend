import type { Prediction } from "@/types/api";

interface PredictionSectionProps {
  prediction: Prediction;
}

export function PredictionSection({ prediction }: PredictionSectionProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <div
        className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-4 font-semibold"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Previsão Estatística
      </div>

      {/* Lambda / Expected Goals */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-(--bg2) rounded-lg p-4 text-center">
          <div className="text-[11px] text-(--text3) uppercase font-medium mb-1">
            Gols esperados
          </div>
          <div
            className="text-[28px] text-[#012AFE]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {prediction.lambda_home.toFixed(2)}
          </div>
          <div className="text-[12px] text-(--text2)">{prediction.home_team}</div>
        </div>
        <div className="bg-(--bg2) rounded-lg p-4 text-center">
          <div className="text-[11px] text-(--text3) uppercase font-medium mb-1">
            Gols esperados
          </div>
          <div
            className="text-[28px] text-[#FF3B3B]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {prediction.lambda_away.toFixed(2)}
          </div>
          <div className="text-[12px] text-(--text2)">{prediction.away_team}</div>
        </div>
      </div>

      {/* Markets */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-(--bg2) rounded-lg p-3 text-center">
          <div className="text-[11px] text-(--text3) mb-1">Over 2.5</div>
          <div
            className="text-[20px] text-(--text)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {(prediction.over_2_5_prob * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-(--bg2) rounded-lg p-3 text-center">
          <div className="text-[11px] text-(--text3) mb-1">BTTS</div>
          <div
            className="text-[20px] text-(--text)"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {(prediction.btts_prob * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Top Scores */}
      <div className="text-[11px] text-(--text3) uppercase font-semibold mb-2">
        Placares mais prováveis
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {prediction.top_scores.slice(0, 5).map(([score, prob]) => (
          <div
            key={score}
            className="bg-(--bg2) border border-border rounded-lg px-3 py-2 text-center"
          >
            <div
              className="text-[16px] text-(--text)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {score}
            </div>
            <div className="text-[10px] text-(--text3)">
              {(prob * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Score Matrix Heatmap */}
      {prediction.score_matrix && prediction.score_matrix.length > 0 && (
        <div>
          <div className="text-[11px] text-(--text3) uppercase font-semibold mb-2">
            Matriz de probabilidade
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr>
                  <th className="p-1 text-(--text3)">{prediction.home_team?.slice(0, 3)}\{prediction.away_team?.slice(0, 3)}</th>
                  {prediction.score_matrix[0]?.map((_, j) => (
                    <th key={j} className="p-1 text-(--text2) font-semibold">
                      {j}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prediction.score_matrix.slice(0, 6).map((row, i) => (
                  <tr key={i}>
                    <td className="p-1 text-(--text2) font-semibold">{i}</td>
                    {row.slice(0, 6).map((val, j) => {
                      const intensity = Math.min(val * 10, 1);
                      return (
                        <td
                          key={j}
                          className="p-1 text-center rounded"
                          style={{
                            background: `rgba(1,42,254,${intensity * 0.6})`,
                            color: intensity > 0.3 ? "#fff" : "var(--text2)",
                          }}
                        >
                          {(val * 100).toFixed(1)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Weather */}
      {prediction.weather_condition && (
        <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-[12px] text-(--text2)">
          <span>
            Clima: <span className="font-semibold text-(--text)">{prediction.weather_condition}</span>
          </span>
          {prediction.weather_factor !== undefined && prediction.weather_factor < 1 && (
            <span className="text-[11px] text-[#FFB800] bg-[rgba(255,184,0,0.1)] px-2 py-0.5 rounded font-semibold">
              Impacto: -{((1 - prediction.weather_factor) * 100).toFixed(0)}% gols
            </span>
          )}
        </div>
      )}

      {/* Confidence */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-[11px] text-(--text3)">Confiança:</span>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded"
          style={{
            background:
              prediction.confidence === "Alta"
                ? "rgba(0,200,150,0.1)"
                : prediction.confidence === "Média"
                  ? "rgba(255,184,0,0.1)"
                  : "rgba(255,59,59,0.1)",
            color:
              prediction.confidence === "Alta"
                ? "#00C896"
                : prediction.confidence === "Média"
                  ? "#FFB800"
                  : "#FF3B3B",
          }}
        >
          {prediction.confidence}
        </span>
      </div>
    </div>
  );
}
