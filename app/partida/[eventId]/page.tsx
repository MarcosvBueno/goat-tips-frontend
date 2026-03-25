"use client";

import { use } from "react";
import { useMatch, useH2H, useStatsTrend, useLineup } from "@/hooks/use-matches";
import {
  usePredictionById,
  useInplayPrediction,
} from "@/hooks/use-predictions";
import { useTeamForm } from "@/hooks/use-analytics";
import { useWeather } from "@/hooks/use-analytics";
import { MatchHeader } from "@/components/partida/match-header";
import { ProbabilityBar } from "@/components/partida/probability-bar";
import { MomentumGauge } from "@/components/partida/momentum-gauge";
import { RiskMeter } from "@/components/partida/risk-meter";
import { LineupDisplay } from "@/components/partida/lineup-display";
import { H2HSection } from "@/components/partida/h2h-section";
import { PredictionSection } from "@/components/partida/prediction-section";
import { WeatherCard } from "@/components/partida/weather-card";
import { FormBadge } from "@/components/partida/form-badge";
import { FullAnalysisCard } from "@/components/partida/full-analysis-card";
import { MatchChat } from "@/components/partida/match-chat";
import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";
import { useRiskScores } from "@/hooks/use-analytics";
import Link from "next/link";

export default function PartidaPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = use(params);

  const { data: match, isLoading: isLoadingMatch } = useMatch(eventId);
  const isLive = match?.status === "live";

  const { data: prediction } = usePredictionById(eventId);
  const { data: inplayPrediction } = useInplayPrediction(eventId, isLive);
  const { data: statsTrend } = useStatsTrend(eventId, isLive);
  const { data: lineup } = useLineup(eventId);
  const { data: h2h } = useH2H(eventId);
  const { data: weather } = useWeather(match?.stadium ?? undefined);
  const { data: homeForm } = useTeamForm(match?.home.name);
  const { data: awayForm } = useTeamForm(match?.away.name);

  const scoreDiff =
    match && isLive ? match.score_home - match.score_away : undefined;
  const { data: riskScores } = useRiskScores(
    isLive ? (match?.minute ?? undefined) : undefined,
    scoreDiff,
  );

  const activePrediction = inplayPrediction ?? prediction;

  if (isLoadingMatch) {
    return (
      <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
        <Skeleton className="h-10 w-32 mb-4" />
        <CardSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="px-6 py-6 max-w-[1280px] mx-auto text-center mt-20">
        <div
          className="text-[48px] text-(--text3) mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </div>
        <div className="text-[16px] text-(--text2) font-medium">
          Partida não encontrada
        </div>
        <Link
          href="/ao-vivo"
          className="text-[13px] text-[#012AFE] mt-3 inline-block"
        >
          ← Voltar para Ao Vivo
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      {/* Back link */}
      <Link
        href={isLive ? "/ao-vivo" : "/pre-jogo"}
        className="text-[13px] text-[#012AFE] no-underline font-medium mb-4 inline-block hover:opacity-70 transition-opacity"
      >
        ← {isLive ? "Ao Vivo" : "Próximos Jogos"}
      </Link>

      <MatchHeader match={match} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Probabilidades */}
        {activePrediction && <ProbabilityBar prediction={activePrediction} />}

        {/* Odds ao vivo */}
        {match.odds && (
          <div className="bg-card border border-border rounded-[14px] p-5">
            <div
              className="text-[14px] uppercase tracking-[0.04em] text-(--text2) mb-3 font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Odds
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: match.home.name, value: match.odds.home_win },
                { label: "Empate", value: match.odds.draw },
                { label: match.away.name, value: match.odds.away_win },
              ].map((odd) => (
                <div
                  key={odd.label}
                  className="bg-(--bg2) rounded-lg p-3 text-center"
                >
                  <div className="text-[10px] text-(--text3) uppercase mb-1">
                    {odd.label}
                  </div>
                  <div
                    className="text-[24px] text-(--text)"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {odd.value.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Momentum */}
        {statsTrend && (
          <MomentumGauge
            statsTrend={statsTrend}
            homeName={match.home.name}
            awayName={match.away.name}
          />
        )}

        {/* Risk Meters */}
        {riskScores && (
          <>
            <RiskMeter
              label="Risco de Gol"
              score={riskScores.goal_risk.score}
              riskLabel={riskScores.goal_risk.label}
            />
            <RiskMeter
              label="Risco de Cartão"
              score={riskScores.card_risk.score}
              riskLabel={riskScores.card_risk.label}
            />
          </>
        )}

        {/* Previsão estatística */}
        {activePrediction && (
          <PredictionSection prediction={activePrediction} />
        )}

        {/* Clima */}
        {weather && <WeatherCard weather={weather} />}

        {/* H2H */}
        {h2h && <H2HSection h2h={h2h} />}

        {/* Forma dos times */}
        {homeForm && <FormBadge form={homeForm} />}
        {awayForm && <FormBadge form={awayForm} />}

        {/* Escalações */}
        {lineup && (
          <div className="md:col-span-2">
            <LineupDisplay lineup={lineup} />
          </div>
        )}

        {/* Full Analysis */}
        <div className="md:col-span-2">
          <FullAnalysisCard eventId={eventId} />
        </div>

        {/* Chat da partida */}
        <div className="md:col-span-2">
          <MatchChat eventId={eventId} />
        </div>
      </div>
    </div>
  );
}
