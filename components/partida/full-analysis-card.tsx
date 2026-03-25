"use client";

import { useFullAnalysis } from "@/hooks/use-predictions";
import { Skeleton } from "@/components/ui/skeleton";

interface FullAnalysisCardProps {
  eventId: string;
}

export function FullAnalysisCard({ eventId }: FullAnalysisCardProps) {
  const { data, isLoading, isFetching, refetch, isError } =
    useFullAnalysis(eventId);

  if (!data && !isLoading && !isFetching) {
    return (
      <div className="bg-card border border-border rounded-[14px] p-5">
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-[14px] uppercase tracking-[0.04em] text-(--text2) font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Análise IA
          </div>
        </div>
        <p className="text-[13px] text-(--text3) mb-4">
          Gere uma análise completa com IA combinando dados ao vivo, histórico e
          previsões estatísticas.
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-[#012AFE] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {isFetching ? "Gerando análise..." : "Gerar Análise Completa"}
        </button>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="bg-card border border-border rounded-[14px] p-5">
        <div
          className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-4 font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Análise IA
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-5 h-5 border-2 border-[#012AFE] border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] text-(--text2)">
            Gerando análise com IA... (5–15 segundos)
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["fetch_context", "fetch_historical", "generate_narrative"].map(
            (step) => (
              <span
                key={step}
                className="text-[10px] bg-(--bg3) text-(--text3) px-2 py-1 rounded font-mono"
              >
                {step}
              </span>
            ),
          )}
        </div>
        <div className="mt-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-card border border-border rounded-[14px] p-5">
        <div className="text-[14px] text-[#FF3B3B] font-semibold mb-2">
          Erro ao gerar análise
        </div>
        <button
          onClick={() => refetch()}
          className="bg-[#012AFE] text-white px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const { narrative, agent_steps, goal_risk_score, card_risk_score } = data;

  return (
    <div className="bg-card border border-[rgba(1,42,254,0.2)] rounded-[14px] p-5">
      <div className="flex items-center justify-between mb-4">
        <div
          className="text-[14px] uppercase tracking-[0.04em] text-(--text2) font-semibold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Análise IA
        </div>
        <div className="flex items-center gap-2">
          {narrative.confidence_label && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded"
              style={{
                background:
                  narrative.confidence_label === "Alta"
                    ? "rgba(0,200,150,0.1)"
                    : "rgba(255,184,0,0.1)",
                color:
                  narrative.confidence_label === "Alta"
                    ? "#00C896"
                    : "#FFB800",
              }}
            >
              {narrative.confidence_label}
            </span>
          )}
          {agent_steps && (
            <div className="flex gap-1">
              {agent_steps.map((step) => (
                <span
                  key={step}
                  className="text-[9px] bg-[rgba(0,200,150,0.1)] text-[#00C896] px-1.5 py-0.5 rounded font-mono"
                >
                  {step}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Headline */}
      <h3
        className="text-[20px] text-(--text) mb-3 leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {narrative.headline}
      </h3>

      {/* Analysis */}
      <p className="text-[13px] text-(--text2) leading-[1.6] mb-3">
        {narrative.analysis}
      </p>

      {/* Prediction */}
      <div className="bg-(--bg2) rounded-lg p-3 mb-3">
        <div className="text-[11px] text-(--text3) uppercase font-semibold mb-1">
          Previsão
        </div>
        <p className="text-[13px] text-(--text) leading-[1.5]">
          {narrative.prediction}
        </p>
      </div>

      {/* Momentum signal */}
      {narrative.momentum_signal && (
        <p className="text-[12px] text-[#012AFE] italic mb-3">
          {narrative.momentum_signal}
        </p>
      )}

      {/* Risk scores inline */}
      {(goal_risk_score || card_risk_score) && (
        <div className="flex gap-3 mt-2">
          {goal_risk_score !== undefined && (
            <span className="text-[11px] text-(--text2)">
              Risco de gol:{" "}
              <span
                className="font-bold"
                style={{
                  color:
                    goal_risk_score >= 7
                      ? "#FF3B3B"
                      : goal_risk_score >= 4
                        ? "#FFB800"
                        : "#00C896",
                }}
              >
                {goal_risk_score.toFixed(1)}/10
              </span>
            </span>
          )}
          {card_risk_score !== undefined && (
            <span className="text-[11px] text-(--text2)">
              Risco de cartão:{" "}
              <span
                className="font-bold"
                style={{
                  color:
                    card_risk_score >= 7
                      ? "#FF3B3B"
                      : card_risk_score >= 4
                        ? "#FFB800"
                        : "#00C896",
                }}
              >
                {card_risk_score.toFixed(1)}/10
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
