"use client";

import { use } from "react";
import Link from "next/link";
import {
  useMatch,
  useH2H,
  useStatsTrend,
  useLineup,
} from "@/hooks/use-matches";
import {
  usePredictionById,
  useInplayPrediction,
} from "@/hooks/use-predictions";
import { useTeamForm, useWeather, useRiskScores } from "@/hooks/use-analytics";
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
import { NarrativeCard } from "@/components/partida/narrative-card";
import { MatchChat } from "@/components/partida/match-chat";
import { WeatherOverlay } from "@/components/partida/weather-overlay";
import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";

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

  /* ── Loading ──────────────────────────────────────────────────── */
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

  /* ── 404 ──────────────────────────────────────────────────────── */
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

  /* ── Helpers ──────────────────────────────────────────────────── */
  const hasWeather = !!weather;
  const hasRisk = !!riskScores;
  const hasMomentum = !!statsTrend;
  const hasPrediction = !!activePrediction;
  const hasOdds = !!match.odds;

  return (
    <div className="relative px-6 py-6 max-w-[1280px] mx-auto animate-fade-in overflow-hidden">
      {/* ── Weather particle overlay ──────────────────────────── */}
      {hasWeather && <WeatherOverlay weather={weather} />}

      {/* ── Back link ─────────────────────────────────────────── */}
      <Link
        href={isLive ? "/ao-vivo" : "/pre-jogo"}
        className="relative z-10 text-[13px] text-[#012AFE] no-underline font-medium mb-4 inline-block hover:opacity-70 transition-opacity"
      >
        ← {isLive ? "Ao Vivo" : "Próximos Jogos"}
      </Link>

      {/* ── Match header ──────────────────────────────────────── */}
      <div className="relative z-10">
        <MatchHeader match={match} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BENTO GRID — 6 columns, cards span intelligently
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mt-4">

        {/* ─── ROW: Probabilities + Odds + Weather ─────────────── */}
        {/* Probabilities — 2 cols */}
        {hasPrediction && (
          <div className="lg:col-span-2">
            <ProbabilityBar prediction={activePrediction} />
          </div>
        )}

        {/* Odds — 2 cols */}
        {hasOdds && (
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-[14px] p-5 h-full relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#012AFE]/[0.06] dark:bg-[#012AFE]/[0.15] rounded-full blur-[24px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="text-[14px] uppercase tracking-[0.04em] text-(--text2) font-semibold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Odds
                  </div>
                  <span className="text-[9px] font-bold text-[#012AFE] bg-[#012AFE]/[0.08] dark:bg-[#012AFE]/[0.15] px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    1X2
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: match.home.name, value: match.odds!.home_win, tag: "1" },
                    { label: "Empate", value: match.odds!.draw, tag: "X" },
                    { label: match.away.name, value: match.odds!.away_win, tag: "2" },
                  ].map((odd) => {
                    const isFav =
                      odd.value ===
                      Math.min(
                        match.odds!.home_win,
                        match.odds!.draw,
                        match.odds!.away_win,
                      );
                    return (
                      <div
                        key={odd.tag}
                        className={`rounded-xl p-2.5 text-center border transition-colors ${
                          isFav
                            ? "bg-[#012AFE]/[0.06] dark:bg-[#012AFE]/[0.12] border-[#012AFE]/20 dark:border-[#012AFE]/30"
                            : "bg-(--bg2) dark:bg-white/[0.04] border-transparent"
                        }`}
                      >
                        <div
                          className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${
                            isFav
                              ? "text-[#012AFE] dark:text-[#6B8AFF]"
                              : "text-(--text3) dark:text-white/30"
                          }`}
                        >
                          {odd.tag}
                        </div>
                        <div
                          className="text-[24px] leading-none text-(--text) dark:text-white/85"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {odd.value.toFixed(2)}
                        </div>
                        <div className="text-[9px] text-(--text3) dark:text-white/25 mt-1 truncate">
                          {odd.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather — 2 cols (fills the row with probs+odds) */}
        {hasWeather && (
          <div className="lg:col-span-2">
            <WeatherCard weather={weather} />
          </div>
        )}

        {/* ─── ROW: Risk + Momentum ────────────────────────────── */}
        {/* Risk meters side by side in one cell — 2 cols */}
        {hasRisk && (
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>
        )}

        {/* Momentum — 3 cols */}
        {hasMomentum && (
          <div className={hasRisk ? "lg:col-span-3" : "lg:col-span-6"}>
            <MomentumGauge
              statsTrend={statsTrend}
              homeName={match.home.name}
              awayName={match.away.name}
            />
          </div>
        )}

        {/* ─── ROW: Prediction (wide) ──────────────────────────── */}
        {hasPrediction && (
          <div className="lg:col-span-6">
            <PredictionSection prediction={activePrediction} />
          </div>
        )}

        {/* ─── ROW: H2H + Form badges ─────────────────────────── */}
        {/* H2H — 3 cols */}
        {h2h && (
          <div className="lg:col-span-3">
            <H2HSection h2h={h2h} />
          </div>
        )}

        {/* Form badges stacked — 3 cols */}
        {(homeForm || awayForm) && (
          <div className="lg:col-span-3 grid grid-cols-1 gap-3">
            {homeForm && <FormBadge form={homeForm} />}
            {awayForm && <FormBadge form={awayForm} />}
          </div>
        )}

        {/* ─── ROW: Lineups (full) ─────────────────────────────── */}
        {lineup && (
          <div className="lg:col-span-6">
            <LineupDisplay lineup={lineup} />
          </div>
        )}

        {/* ─── ROW: Narrative (full) ───────────────────────────── */}
        <div className="lg:col-span-6">
          <NarrativeCard eventId={eventId} />
        </div>

        {/* ─── ROW: Full Analysis (full) ───────────────────────── */}
        <div className="lg:col-span-6">
          <FullAnalysisCard eventId={eventId} />
        </div>

        {/* ─── ROW: Chat (full) ────────────────────────────────── */}
        <div className="lg:col-span-6">
          <MatchChat eventId={eventId} />
        </div>
      </div>

      {/* ── Footer bar ────────────────────────────────────────── */}
      <div className="relative z-10 border-t border-(--border) dark:border-white/[0.05] mt-4 py-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#012AFE] animate-pulse" />
          <span className="text-[10px] text-(--text3) dark:text-white/22 tracking-[0.08em] uppercase font-medium">
            Modelo Poisson · StatsBomb · FBref
          </span>
        </div>
        <span className="text-[10px] text-(--text3) dark:text-white/18 tracking-wider uppercase">
          ID: {eventId.slice(0, 8)}…
        </span>
      </div>
    </div>
  );
}
