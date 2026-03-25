import { fetchApi } from "./api";
import type {
  TeamListResponse,
  TeamForm,
  TeamStats,
  TeamProfile,
  H2HResponse,
  GoalPatterns,
  CardPatterns,
  RiskScores,
  RefereeListResponse,
  RefereeStats,
  WeatherResponse,
  CalibrationResponse,
} from "@/types/api";

export function getTeams() {
  return fetchApi<TeamListResponse>("/analytics/teams");
}

export function getTeamForm(teamName: string, n = 10) {
  return fetchApi<TeamForm>(
    `/analytics/teams/${encodeURIComponent(teamName)}/form?n=${n}`,
  );
}

export function getTeamStats(teamName: string) {
  return fetchApi<TeamStats>(
    `/analytics/teams/${encodeURIComponent(teamName)}/stats`,
  );
}

export function getTeamProfile(teamName: string) {
  return fetchApi<TeamProfile>(
    `/analytics/teams/${encodeURIComponent(teamName)}/profile`,
  );
}

export function getAnalyticsH2H(home: string, away: string, n = 10) {
  return fetchApi<H2HResponse>(
    `/analytics/h2h?home=${encodeURIComponent(home)}&away=${encodeURIComponent(away)}&n=${n}`,
  );
}

export function getGoalPatterns() {
  return fetchApi<GoalPatterns>("/analytics/goal-patterns");
}

export function getCardPatterns() {
  return fetchApi<CardPatterns>("/analytics/card-patterns");
}

export function getRiskScores(minute: number, scoreDiff: number) {
  return fetchApi<RiskScores>(
    `/analytics/risk-scores?minute=${minute}&score_diff=${scoreDiff}`,
  );
}

export function getReferees() {
  return fetchApi<RefereeListResponse>("/analytics/referees");
}

export function getRefereeStats(refereeName: string) {
  return fetchApi<RefereeStats>(
    `/analytics/referees/${encodeURIComponent(refereeName)}/stats`,
  );
}

export function getWeather(params: {
  stadium?: string;
  city?: string;
  match_hour_utc?: number;
}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  const qs = entries
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
  return fetchApi<WeatherResponse>(`/analytics/weather?${qs}`);
}

export function getCalibration(n = 500) {
  return fetchApi<CalibrationResponse>(`/analytics/model/calibration?n=${n}`);
}
