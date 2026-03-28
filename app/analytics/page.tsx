"use client";

import { useMemo, useState } from "react";
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
import { useLiveMatches, useUpcomingMatches } from "@/hooks/use-matches";
import { AnalyticsCard } from "@/components/analytics/analytics-card";
import { Skeleton } from "@/components/ui/skeleton";

const TINTS = {
  blue: "#012AFE",
  green: "#00C896",
  amber: "#FFB800",
  red: "#FF3B3B",
};

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <label className="flex flex-col gap-2 min-w-[220px] flex-1">
      <span className="text-[11px] uppercase tracking-[0.08em] text-(--text2) font-semibold">
        {label}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="h-11 bg-card border border-border rounded-xl px-4 text-[13px] text-(--text) outline-none focus:border-[#012AFE] focus:ring-2 focus:ring-[#012AFE]/15 transition-all"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatLine({
  label,
  value,
  fill,
  color,
}: {
  label: string;
  value: string;
  fill: number;
  color: string;
}) {
  const safeFill = Number.isFinite(fill) ? Math.max(0, Math.min(fill, 100)) : 0;

  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex justify-between text-[13px] text-(--text2)">
        <span>{label}</span>
        <span className="font-semibold text-(--text)">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-(--bg3) overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${safeFill}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function TeamSelectionPill({
  name,
  role,
  logo,
  color,
}: {
  name: string;
  role: string;
  logo?: string;
  color: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2.5 h-10 px-2.5 pr-3.5 rounded-full text-[11px] font-semibold border"
      style={{
        borderColor: `${color}35`,
        color,
        backgroundColor: `${color}15`,
      }}
    >
      {logo ? (
        <img
          src={logo}
          alt={name}
          className="w-7 h-7 rounded-full object-contain bg-white/80 p-0.5 border border-white/70"
          loading="lazy"
        />
      ) : (
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] text-white"
          style={{ backgroundColor: color, fontFamily: "var(--font-display)" }}
        >
          {name.slice(0, 3).toUpperCase()}
        </span>
      )}
      <span className="uppercase tracking-[0.06em] opacity-80">{role}</span>
      <span className="text-(--text)">{name}</span>
    </span>
  );
}

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
  const { data: liveMatches } = useLiveMatches();
  const { data: upcomingMatches } = useUpcomingMatches();

  const teams = teamsData?.teams.map((t) => t.name) ?? [];
  const referees = refereesData?.referees ?? [];
  const h2hTotal = h2hData?.total_matches ?? 0;
  const teamLogos = useMemo(() => {
    const map = new Map<string, string>();
    const matches = [...(liveMatches ?? []), ...(upcomingMatches ?? [])];

    matches.forEach((match) => {
      if (match.home.image_url && !map.has(match.home.name)) {
        map.set(match.home.name, match.home.image_url);
      }
      if (match.away.image_url && !map.has(match.away.name)) {
        map.set(match.away.name, match.away.image_url);
      }
    });

    return map;
  }, [liveMatches, upcomingMatches]);

  const safePct = (value: number, total: number) => {
    if (!total) return 0;
    return Math.max(0, Math.min((value / total) * 100, 100));
  };

  return (
    <div className="relative px-4 sm:px-6 py-6 sm:py-8 max-w-[1320px] mx-auto animate-fade-in overflow-hidden">
      <section className="relative mb-6 rounded-3xl border border-border bg-[linear-gradient(135deg,rgba(1,42,254,0.12),rgba(1,42,254,0)_38%),linear-gradient(160deg,var(--card),var(--card))] p-5 sm:p-7 overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-[42%] opacity-30">
          <div className="h-full w-full bg-[radial-gradient(circle_at_70%_24%,rgba(1,42,254,0.35),transparent_54%)]" />
        </div>
        <div className="relative flex flex-col gap-5 sm:gap-6">
          <div>
            <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-(--text2) font-semibold mb-2">
              Inteligencia pre-jogo
            </p>
            <h1
              className="text-[32px] sm:text-[44px] leading-[0.95] uppercase tracking-[0.01em] text-(--text)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Analytics Hub
            </h1>
            <p className="max-w-2xl text-[13px] sm:text-[14px] text-(--text2) mt-3">
              Explore tendencias de desempenho, confrontos diretos e calibracao do
              modelo em uma leitura rapida para decidir os melhores mercados.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Times monitorados",
                value: teams.length.toString(),
                tint: "#012AFE",
              },
              {
                label: "Arbitros disponiveis",
                value: referees.length.toString(),
                tint: "#FFB800",
              },
              {
                label: "Mercados calibrados",
                value: calibration
                  ? Object.keys(calibration.markets).length.toString()
                  : "--",
                tint: "#00C896",
              },
              {
                label: "Confronto selecionado",
                value: selectedTeam && selectedTeam2 ? "ativo" : "inativo",
                tint: "#FF3B3B",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border/80 bg-card/85 px-4 py-3.5"
              >
                <div className="text-[11px] uppercase tracking-[0.08em] text-(--text3) font-semibold">
                  {item.label}
                </div>
                <div
                  className="text-[24px] mt-1 leading-none"
                  style={{ fontFamily: "var(--font-display)", color: item.tint }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mb-7 rounded-2xl border border-border bg-card/85 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <h2
              className="text-[16px] uppercase tracking-[0.05em] text-(--text)"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Filtros de analise
            </h2>
            <p className="text-[12px] text-(--text2)">
              Selecione equipes e arbitro para personalizar os cards.
            </p>
          </div>
          {(selectedTeam || selectedTeam2 || selectedReferee) && (
            <button
              onClick={() => {
                setSelectedTeam(undefined);
                setSelectedTeam2(undefined);
                setSelectedReferee(undefined);
              }}
              className="px-4 py-2 bg-[#FF3B3B]/10 text-[#FF3B3B] hover:bg-[#FF3B3B]/20 rounded-xl text-[12px] font-semibold transition-all border border-[#FF3B3B]/20 whitespace-nowrap cursor-pointer"
            >
              Limpar Seleções
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <SelectField
            label="Time da casa"
            value={selectedTeam}
            onChange={setSelectedTeam}
            placeholder="Selecione um time"
            options={teams.filter((t) => t !== selectedTeam2)}
          />
          <SelectField
            label="Time visitante (H2H)"
            value={selectedTeam2}
            onChange={setSelectedTeam2}
            placeholder="Selecione outro time"
            options={teams.filter((t) => t !== selectedTeam)}
          />
          <SelectField
            label="Arbitro"
            value={selectedReferee}
            onChange={setSelectedReferee}
            placeholder="Selecione um arbitro"
            options={referees}
          />
        </div>
      </section>

      {(selectedTeam || selectedTeam2 || selectedReferee) && (
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          {selectedTeam && (
            <TeamSelectionPill
              name={selectedTeam}
              role="Casa"
              logo={teamLogos.get(selectedTeam)}
              color="#012AFE"
            />
          )}
          {selectedTeam2 && (
            <TeamSelectionPill
              name={selectedTeam2}
              role="Fora"
              logo={teamLogos.get(selectedTeam2)}
              color="#FF3B3B"
            />
          )}
          {selectedReferee && (
            <span
              className="inline-flex items-center h-10 px-3 rounded-full text-[11px] font-semibold border"
              style={{
                borderColor: "#FFB80035",
                color: "#B57B00",
                backgroundColor: "#FFB80015",
              }}
            >
              Arbitro: {selectedReferee}
            </span>
          )}
        </div>
      )}

      {(!selectedTeam && !selectedTeam2 && !selectedReferee) && (
        <h3
          className="text-[16px] uppercase tracking-[0.05em] text-(--text) font-semibold mb-4 px-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Métrica Geral
        </h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {selectedTeam &&
          (isLoadingProfile ? (
            <Skeleton className="h-[320px] rounded-2xl" />
          ) : teamProfile ? (
            <AnalyticsCard
              className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
              title={`${teamProfile.team_name} · Perfil`}
              badge={`${teamProfile.sample_size} jogos`}
            >
              <div className="flex flex-col gap-3.5">
                <StatLine
                  label="Expectativa de Gols por jogo"
                  value={teamProfile.avg_xg.toFixed(2)}
                  fill={teamProfile.avg_xg * 40}
                  color={TINTS.blue}
                />
                <StatLine
                  label="Eficiencia de chute"
                  value={`${(teamProfile.shot_efficiency * 100).toFixed(1)}%`}
                  fill={teamProfile.shot_efficiency * 100}
                  color={TINTS.green}
                />
                <StatLine
                  label="Gols em casa/jogo"
                  value={teamProfile.home_goals_avg.toFixed(2)}
                  fill={teamProfile.home_goals_avg * 33}
                  color={TINTS.blue}
                />
                <StatLine
                  label="Gols fora/jogo"
                  value={teamProfile.away_goals_avg.toFixed(2)}
                  fill={teamProfile.away_goals_avg * 33}
                  color={TINTS.amber}
                />
                <StatLine
                  label="Win rate casa"
                  value={`${(teamProfile.home_win_rate * 100).toFixed(0)}%`}
                  fill={teamProfile.home_win_rate * 100}
                  color={TINTS.green}
                />
                <StatLine
                  label="Win rate fora"
                  value={`${(teamProfile.away_win_rate * 100).toFixed(0)}%`}
                  fill={teamProfile.away_win_rate * 100}
                  color={TINTS.amber}
                />
              </div>
            </AnalyticsCard>
          ) : null)}

        {selectedTeam && selectedTeam2 &&
          (isLoadingH2H ? (
            <Skeleton className="h-[320px] rounded-2xl" />
          ) : h2hData ? (
            <AnalyticsCard
              className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
              title={`H2H: ${selectedTeam} vs ${selectedTeam2}`}
              badge={`${h2hData.total_matches} confrontos`}
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-3 gap-2 text-[12px]">
                  <div className="rounded-xl bg-[#012AFE]/10 border border-[#012AFE]/20 p-2.5">
                    <p className="text-(--text2) text-[10px] uppercase tracking-[0.06em] font-semibold">
                      Casa
                    </p>
                    <p
                      className="text-[22px] leading-none mt-1"
                      style={{ color: TINTS.blue, fontFamily: "var(--font-display)" }}
                    >
                      {h2hData.home_wins}
                    </p>
                  </div>
                  <div className="rounded-xl bg-(--bg2) border border-border p-2.5">
                    <p className="text-(--text2) text-[10px] uppercase tracking-[0.06em] font-semibold">
                      Empates
                    </p>
                    <p
                      className="text-[22px] leading-none mt-1"
                      style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}
                    >
                      {h2hData.draws}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#FF3B3B]/10 border border-[#FF3B3B]/20 p-2.5">
                    <p className="text-(--text2) text-[10px] uppercase tracking-[0.06em] font-semibold">
                      Fora
                    </p>
                    <p
                      className="text-[22px] leading-none mt-1"
                      style={{ color: TINTS.red, fontFamily: "var(--font-display)" }}
                    >
                      {h2hData.away_wins}
                    </p>
                  </div>
                </div>

                <div className="h-2.5 rounded-full bg-(--bg3) overflow-hidden flex">
                  <div
                    style={{ width: `${safePct(h2hData.home_wins, h2hTotal)}%`, backgroundColor: TINTS.blue }}
                  />
                  <div
                    style={{ width: `${safePct(h2hData.draws, h2hTotal)}%`, backgroundColor: "var(--text3)" }}
                  />
                  <div
                    style={{ width: `${safePct(h2hData.away_wins, h2hTotal)}%`, backgroundColor: TINTS.red }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px]">
                  <div className="rounded-lg bg-(--bg2) p-2.5 border border-border">
                    <p className="text-(--text2)">Media de gols casa</p>
                    <p className="text-(--text) font-semibold text-[15px]">
                      {h2hData.home_goals_avg.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-(--bg2) p-2.5 border border-border">
                    <p className="text-(--text2)">Media de gols fora</p>
                    <p className="text-(--text) font-semibold text-[15px]">
                      {h2hData.away_goals_avg.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </AnalyticsCard>
          ) : null)}

        {selectedTeam && teamStats && (
          <AnalyticsCard
            className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
            title={`${teamStats.team_name} · Estatisticas`}
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

        {selectedTeam && teamForm && (
          <AnalyticsCard
            className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
            title={`Forma recente · ${teamForm.team_name}`}
            badge={`Ultimos ${teamForm.last_n_matches}`}
          >
            <div className="flex gap-2 mb-4">
              {teamForm.form_string.split("").map((r, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                  style={{
                    background:
                      r === "W"
                        ? TINTS.green
                        : r === "D"
                          ? TINTS.amber
                          : TINTS.red,
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-(--bg2) rounded-xl p-3 border border-border">
                <div
                  className="text-[24px] leading-none text-[#00C896]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {teamForm.wins}
                </div>
                <div className="text-[11px] text-(--text2) mt-1">Vitorias</div>
              </div>
              <div className="bg-(--bg2) rounded-xl p-3 border border-border">
                <div
                  className="text-[24px] leading-none text-[#FFB800]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {teamForm.draws}
                </div>
                <div className="text-[11px] text-(--text2) mt-1">Empates</div>
              </div>
              <div className="bg-(--bg2) rounded-xl p-3 border border-border">
                <div
                  className="text-[24px] leading-none text-[#FF3B3B]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {teamForm.losses}
                </div>
                <div className="text-[11px] text-(--text2) mt-1">Derrotas</div>
              </div>
            </div>
          </AnalyticsCard>
        )}

        {selectedReferee &&
          (isLoadingReferee ? (
            <Skeleton className="h-[260px] rounded-2xl" />
          ) : refereeStats ? (
            <AnalyticsCard
              className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
              title={`Arbitro: ${refereeStats.referee_name}`}
              badge={`${refereeStats.matches} jogos`}
              stats={[
                {
                  label: "Cartoes amarelos/jogo",
                  value: refereeStats.avg_yellow_cards.toFixed(2),
                  fill: Math.min(refereeStats.avg_yellow_cards * 20, 100),
                  color: "amber",
                },
                {
                  label: "Cartoes vermelhos/jogo",
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
          ) : null)}

        {goalPatterns && (
          <AnalyticsCard
            className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
            title="Distribuicao de gols"
            badge={`${goalPatterns.total_goals.toLocaleString()} gols`}
          >
            <div className="flex flex-col gap-2.5">
              {goalPatterns.buckets.map((b) => {
                const pct = b.pct_of_total * 100;
                return (
                  <div key={b.minute_range} className="flex items-center gap-3">
                    <span className="text-[11px] text-(--text2) w-14 shrink-0 font-medium">
                      {b.minute_range}
                    </span>
                    <div className="flex-1 bg-(--bg3) rounded-full h-5 overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(8, Math.min(pct, 100))}%`,
                          background:
                            b.minute_range === goalPatterns.peak_minute_range
                              ? TINTS.blue
                              : "rgba(1,42,254,0.45)",
                        }}
                      />
                      <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] text-(--text) font-semibold">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnalyticsCard>
        )}

        {cardPatterns && (
          <AnalyticsCard
            className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
            title="Distribuicao de cartoes"
            badge={`${cardPatterns.total_yellows} amarelos`}
          >
            <div className="flex flex-col gap-2.5">
              {cardPatterns.buckets.map((b) => {
                const pct = b.pct_of_total * 100;
                return (
                  <div key={b.minute_range} className="flex items-center gap-3">
                    <span className="text-[11px] text-(--text2) w-14 shrink-0 font-medium">
                      {b.minute_range}
                    </span>
                    <div className="flex-1 bg-(--bg3) rounded-full h-5 overflow-hidden relative">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${Math.max(8, Math.min(pct, 100))}%`,
                          background:
                            b.minute_range === cardPatterns.peak_minute_range
                              ? TINTS.amber
                              : "rgba(255,184,0,0.45)",
                        }}
                      />
                      <span className="absolute right-2 top-0 bottom-0 flex items-center text-[10px] text-(--text) font-semibold">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </AnalyticsCard>
        )}

        {calibration && (
          <AnalyticsCard
            className="rounded-2xl border-border/90 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
            title="Calibracao do modelo"
            badge={`${calibration.n_matches} jogos`}
            fullWidth
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(calibration.markets).map(([key, m]) => (
                <div
                  key={key}
                  className="bg-(--bg2) rounded-xl p-[14px] text-center border border-border"
                >
                  <div
                    className="text-[24px] text-[#012AFE] leading-none mb-1"
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
