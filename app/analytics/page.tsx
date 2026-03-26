"use client";

import { useState } from "react";
import {
  useTeams,
  useTeamProfile,
  useTeamStats,
  useTeamForm,
  useReferees,
  useRefereeStats,
  useGoalPatterns,
  useCardPatterns,
  useCalibration,
  useAnalyticsH2H,
} from "@/hooks/use-analytics";
import { AnalyticsCard } from "@/components/analytics/analytics-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>();
  const [selectedTeam2, setSelectedTeam2] = useState<string | undefined>();
  const [selectedReferee, setSelectedReferee] = useState<string | undefined>();

  const { data: teamsData } = useTeams();
  const { data: refereesData } = useReferees();
  const { data: teamProfile, isLoading: isLoadingProfile } =
    useTeamProfile(selectedTeam);
  const { data: teamStats } = useTeamStats(selectedTeam);
  const { data: teamForm } = useTeamForm(selectedTeam, 10);
  const { data: h2hData, isLoading: isLoadingH2H } = useAnalyticsH2H(selectedTeam, selectedTeam2, 10);

  const { data: refereeStats, isLoading: isLoadingReferee } =
    useRefereeStats(selectedReferee);
  const { data: goalPatterns } = useGoalPatterns();
  const { data: cardPatterns } = useCardPatterns();
  const { data: calibration } = useCalibration(500);

  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <div
        className="text-[28px] uppercase tracking-[0.02em] text-(--text) mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Analytics
      </div>

      {/* Seletores */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedTeam ?? ""}
          onChange={(e) => setSelectedTeam(e.target.value || undefined)}
          className="bg-(--bg3) border border-border rounded-lg px-4 py-2.5 text-[13px] text-(--text) outline-none focus:border-(--blue-mid) transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <option value="">Selecione um time (Casa)</option>
          {teamsData?.teams.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={selectedTeam2 ?? ""}
          onChange={(e) => setSelectedTeam2(e.target.value || undefined)}
          className="bg-(--bg3) border border-border rounded-lg px-4 py-2.5 text-[13px] text-(--text) outline-none focus:border-(--blue-mid) transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <option value="">Selecione outro time (Fora - H2H)</option>
          {teamsData?.teams.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={selectedReferee ?? ""}
          onChange={(e) => setSelectedReferee(e.target.value || undefined)}
          className="bg-(--bg3) border border-border rounded-lg px-4 py-2.5 text-[13px] text-(--text) outline-none focus:border-(--blue-mid) transition-colors"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <option value="">Selecione um árbitro</option>
          {refereesData?.referees.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Perfil do time */}
        {selectedTeam && (
          isLoadingProfile ? (
            <Skeleton className="h-[300px]" />
          ) : teamProfile ? (
            <AnalyticsCard
              title={`${teamProfile.team_name} · Perfil`}
              badge={`${teamProfile.sample_size} jogos`}
            >
              <div className="flex flex-col gap-3">
                {[
                  {
                    label: "xG por jogo",
                    value: teamProfile.avg_xg.toFixed(2),
                    fill: Math.min(teamProfile.avg_xg * 40, 100),
                    color: "blue" as const,
                  },
                  {
                    label: "Eficiência de chute",
                    value: `${(teamProfile.shot_efficiency * 100).toFixed(1)}%`,
                    fill: teamProfile.shot_efficiency * 100,
                    color: "green" as const,
                  },
                  {
                    label: "Gols em casa/jogo",
                    value: teamProfile.home_goals_avg.toFixed(2),
                    fill: Math.min(teamProfile.home_goals_avg * 33, 100),
                    color: "blue" as const,
                  },
                  {
                    label: "Gols fora/jogo",
                    value: teamProfile.away_goals_avg.toFixed(2),
                    fill: Math.min(teamProfile.away_goals_avg * 33, 100),
                    color: "amber" as const,
                  },
                  {
                    label: "Win rate casa",
                    value: `${(teamProfile.home_win_rate * 100).toFixed(0)}%`,
                    fill: teamProfile.home_win_rate * 100,
                    color: "green" as const,
                  },
                  {
                    label: "Win rate fora",
                    value: `${(teamProfile.away_win_rate * 100).toFixed(0)}%`,
                    fill: teamProfile.away_win_rate * 100,
                    color: "amber" as const,
                  },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-[5px]">
                    <div className="flex justify-between text-[13px] text-(--text2)">
                      <span>{stat.label}</span>
                      <span className="font-semibold text-(--text)">
                        {stat.value}
                      </span>
                    </div>
                    <div className="bg-(--bg3) rounded-[4px] h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-[4px] transition-all duration-1000"
                        style={{
                          width: `${stat.fill}%`,
                          background:
                            stat.color === "blue"
                              ? "#012AFE"
                              : stat.color === "green"
                                ? "#00C896"
                                : "#FFB800",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </AnalyticsCard>
          ) : null
        )}

        {/* H2H Personalizado */}
        {selectedTeam && selectedTeam2 && (
          isLoadingH2H ? (
            <Skeleton className="h-[300px]" />
          ) : h2hData ? (
            <AnalyticsCard
              title={`H2H: ${selectedTeam} vs ${selectedTeam2}`}
              badge={`${h2hData.total_matches} confrontos`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-[13px] text-(--text)">
                  <span>Vitórias Casa: <strong className="text-[#012AFE]">{h2hData.home_wins}</strong></span>
                  <span>Empates: <strong>{h2hData.draws}</strong></span>
                  <span>Vitórias Fora: <strong className="text-[#FF3B3B]">{h2hData.away_wins}</strong></span>
                </div>
                
                <div className="bg-(--bg3) rounded-md h-2 flex overflow-hidden">
                  <div style={{ width: `${(h2hData.home_wins / h2hData.total_matches) * 100}%`, backgroundColor: '#012AFE' }} />
                  <div style={{ width: `${(h2hData.draws / h2hData.total_matches) * 100}%`, backgroundColor: 'var(--text3)' }} />
                  <div style={{ width: `${(h2hData.away_wins / h2hData.total_matches) * 100}%`, backgroundColor: '#FF3B3B' }} />
                </div>
                
                <div className="mt-2 text-[12px] text-(--text2)">
                  <p>Média de gols casa: <strong className="text-(--text)">{h2hData.home_goals_avg.toFixed(2)}</strong></p>
                  <p>Média de gols fora: <strong className="text-(--text)">{h2hData.away_goals_avg.toFixed(2)}</strong></p>
                </div>
              </div>
            </AnalyticsCard>
          ) : null
        )}

        {/* Stats do time */}
        {selectedTeam && teamStats && (
          <AnalyticsCard
            title={`${teamStats.team_name} · Estatísticas`}
            badge={`${teamStats.sample_size} jogos`}
            stats={[
              {
                label: "Win rate",
                value: `${(teamStats.win_rate * 100).toFixed(0)}%`,
                fill: teamStats.win_rate * 100,
                color: "green",
              },
              {
                label: "Gols marcados/jogo",
                value: teamStats.avg_goals_scored.toFixed(2),
                fill: Math.min(teamStats.avg_goals_scored * 33, 100),
                color: "blue",
              },
              {
                label: "Gols sofridos/jogo",
                value: teamStats.avg_goals_conceded.toFixed(2),
                fill: Math.min(teamStats.avg_goals_conceded * 33, 100),
                color: "red",
              },
              {
                label: "Clean sheets",
                value: `${(teamStats.clean_sheet_rate * 100).toFixed(0)}%`,
                fill: teamStats.clean_sheet_rate * 100,
                color: "green",
              },
              {
                label: "BTTS",
                value: `${(teamStats.btts_rate * 100).toFixed(0)}%`,
                fill: teamStats.btts_rate * 100,
                color: "amber",
              },
            ]}
          />
        )}

        {/* Forma recente */}
        {selectedTeam && teamForm && (
          <AnalyticsCard
            title={`Forma recente · ${teamForm.team_name}`}
            badge={`Últimos ${teamForm.last_n_matches}`}
          >
            <div className="flex gap-1.5 mb-4">
              {teamForm.form_string.split("").map((r, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{
                    background:
                      r === "W"
                        ? "#00C896"
                        : r === "D"
                          ? "#FFB800"
                          : "#FF3B3B",
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-(--bg2) rounded-lg p-3">
                <div
                  className="text-[22px] text-[#00C896]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {teamForm.wins}
                </div>
                <div className="text-[11px] text-(--text2)">Vitórias</div>
              </div>
              <div className="bg-(--bg2) rounded-lg p-3">
                <div
                  className="text-[22px] text-[#FFB800]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {teamForm.draws}
                </div>
                <div className="text-[11px] text-(--text2)">Empates</div>
              </div>
              <div className="bg-(--bg2) rounded-lg p-3">
                <div
                  className="text-[22px] text-[#FF3B3B]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {teamForm.losses}
                </div>
                <div className="text-[11px] text-(--text2)">Derrotas</div>
              </div>
            </div>
          </AnalyticsCard>
        )}

        {/* Árbitro */}
        {selectedReferee && (
          isLoadingReferee ? (
            <Skeleton className="h-[250px]" />
          ) : refereeStats ? (
            <AnalyticsCard
              title={`Árbitro: ${refereeStats.referee_name}`}
              badge={`${refereeStats.matches} jogos`}
              stats={[
                {
                  label: "Cartões amarelos/jogo",
                  value: refereeStats.avg_yellow_cards.toFixed(2),
                  fill: Math.min(refereeStats.avg_yellow_cards * 20, 100),
                  color: "amber",
                },
                {
                  label: "Cartões vermelhos/jogo",
                  value: refereeStats.avg_red_cards.toFixed(2),
                  fill: Math.min(refereeStats.avg_red_cards * 100, 100),
                  color: "red",
                },
                {
                  label: "Faltas/jogo",
                  value: refereeStats.avg_fouls.toFixed(1),
                  fill: Math.min(refereeStats.avg_fouls * 4, 100),
                  color: "blue",
                },
                {
                  label: "Win rate mandante",
                  value: `${(refereeStats.home_win_rate * 100).toFixed(0)}%`,
                  fill: refereeStats.home_win_rate * 100,
                  color: "green",
                },
              ]}
            />
          ) : null
        )}

        {/* Padrões de gol */}
        {goalPatterns && (
          <AnalyticsCard
            title="Distribuição de gols"
            badge={`${goalPatterns.total_goals.toLocaleString()} gols`}
          >
            <div className="flex flex-col gap-2">
              {goalPatterns.buckets.map((b) => (
                <div key={b.minute_range} className="flex items-center gap-3">
                  <span className="text-[11px] text-(--text2) w-14 shrink-0 font-medium">
                    {b.minute_range}
                  </span>
                  <div className="flex-1 bg-(--bg3) rounded-[4px] h-4 overflow-hidden relative">
                    <div
                      className="h-full rounded-[4px] transition-all duration-700"
                      style={{
                        width: `${b.pct_of_total * 100 * 4.5}%`,
                        background:
                          b.minute_range === goalPatterns.peak_minute_range
                            ? "#012AFE"
                            : "rgba(1,42,254,0.4)",
                      }}
                    />
                    <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] text-(--text) font-semibold">
                      {(b.pct_of_total * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        )}

        {/* Padrões de cartão */}
        {cardPatterns && (
          <AnalyticsCard
            title="Distribuição de cartões"
            badge={`${cardPatterns.total_yellows} amarelos`}
          >
            <div className="flex flex-col gap-2">
              {cardPatterns.buckets.map((b) => (
                <div key={b.minute_range} className="flex items-center gap-3">
                  <span className="text-[11px] text-(--text2) w-14 shrink-0 font-medium">
                    {b.minute_range}
                  </span>
                  <div className="flex-1 bg-(--bg3) rounded-[4px] h-4 overflow-hidden relative">
                    <div
                      className="h-full rounded-[4px] transition-all duration-700"
                      style={{
                        width: `${b.pct_of_total * 100 * 4.5}%`,
                        background:
                          b.minute_range === cardPatterns.peak_minute_range
                            ? "#FFB800"
                            : "rgba(255,184,0,0.4)",
                      }}
                    />
                    <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] text-(--text) font-semibold">
                      {(b.pct_of_total * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        )}

        {/* Calibração do modelo */}
        {calibration && (
          <AnalyticsCard
            title="Calibração do modelo"
            badge={`${calibration.n_matches} jogos`}
            fullWidth
          >
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(calibration.markets).map(([key, m]) => (
                <div key={key} className="bg-(--bg2) rounded-lg p-[14px] text-center">
                  <div
                    className="text-[22px] text-[#012AFE] leading-none mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {m.brier_score.toFixed(4)}
                  </div>
                  <div className="text-[11px] text-(--text2) font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </div>
                  <div className="text-[10px] text-(--text3) mt-0.5">
                    Brier Score
                  </div>
                </div>
              ))}
            </div>
          </AnalyticsCard>
        )}
      </div>
    </div>
  );
}
